using Abp.Authorization;
using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Team3.Academic;
using Team3.Authorization;
using Team3.Configuration;
using Team3.LearningMaterials.Dto;

namespace Team3.LearningMaterials;

[AbpAuthorize]
public class StudentLearningAppService : Team3AppServiceBase
{
    private readonly IRepository<Subject, Guid> _subjectRepository;
    private readonly IRepository<Topic, Guid> _topicRepository;
    private readonly IRepository<Lesson, Guid> _lessonRepository;
    private readonly IRepository<LessonTranslation, Guid> _translationRepository;
    private readonly IRepository<Language, Guid> _languageRepository;
    private readonly IRepository<StudentEnrollment, Guid> _enrollmentRepository;
    private readonly IRepository<StudentProgress, Guid> _progressRepository;

    private static readonly Dictionary<string, (string Prompt, string[] Options, string Answer)[]> QuestionBank = new(StringComparer.OrdinalIgnoreCase)
    {
        ["Nucleic Acids"] =
        [
            ("Which nucleic acid carries genetic instructions in most organisms?", ["DNA", "ATP", "Glucose", "Protein"], "DNA"),
            ("RNA differs from DNA because RNA usually contains which sugar?", ["Ribose", "Deoxyribose", "Sucrose", "Glucose"], "Ribose"),
            ("Genes are segments of which molecule?", ["DNA", "Lipids", "Water", "Starch"], "DNA")
        ],
        ["Meiosis"] =
        [
            ("Meiosis produces how many daughter cells?", ["4", "2", "1", "8"], "4"),
            ("The chromosome number after meiosis is usually described as:", ["Haploid", "Diploid", "Triple", "Paired"], "Haploid"),
            ("Meiosis is important for:", ["Gamete formation", "Bone growth only", "Digestion", "Photosynthesis"], "Gamete formation")
        ],
        ["Genetics"] =
        [
            ("An allele is:", ["A version of a gene", "A type of cell membrane", "A protein only", "A chromosome pair"], "A version of a gene"),
            ("A dominant allele is expressed when:", ["At least one copy is present", "Only two recessive copies are present", "No genes exist", "Only in plants"], "At least one copy is present"),
            ("Punnett squares are used to predict:", ["Inheritance outcomes", "Cell size", "Leaf structure", "Respiration rate"], "Inheritance outcomes")
        ]
    };

    public StudentLearningAppService(
        IRepository<Subject, Guid> subjectRepository,
        IRepository<Topic, Guid> topicRepository,
        IRepository<Lesson, Guid> lessonRepository,
        IRepository<LessonTranslation, Guid> translationRepository,
        IRepository<Language, Guid> languageRepository,
        IRepository<StudentEnrollment, Guid> enrollmentRepository,
        IRepository<StudentProgress, Guid> progressRepository)
    {
        _subjectRepository = subjectRepository;
        _topicRepository = topicRepository;
        _lessonRepository = lessonRepository;
        _translationRepository = translationRepository;
        _languageRepository = languageRepository;
        _enrollmentRepository = enrollmentRepository;
        _progressRepository = progressRepository;
    }

    public async Task<StudentDashboardDto> GetDashboardAsync()
    {
        var learningPath = await GetLearningPathAsync();

        return new StudentDashboardDto
        {
            Subject = learningPath.Subject,
            RecommendedTopic = learningPath.RecommendedTopic,
            RecommendedLesson = learningPath.RecommendedLesson,
            Progress = learningPath.Progress,
            LatestDiagnostic = learningPath.LatestDiagnostic
        };
    }

    public async Task<PromptConfigurationDto> GetTutorConfigurationAsync()
    {
        return new PromptConfigurationDto
        {
            GeneralPrompt = await SettingManager.GetSettingValueAsync(AppSettingNames.AiTutorGeneralPrompt),
            LifeSciencesPrompt = await SettingManager.GetSettingValueAsync(AppSettingNames.AiTutorLifeSciencesPrompt),
            ResponseStyle = await SettingManager.GetSettingValueAsync(AppSettingNames.AiTutorResponseStyle),
            MasteryThreshold = await SettingManager.GetSettingValueAsync<int>(AppSettingNames.RecommendationMasteryThreshold),
            RetryLimit = await SettingManager.GetSettingValueAsync<int>(AppSettingNames.RecommendationRetryLimit)
        };
    }

    public async Task<StudentLearningPathDto> GetLearningPathAsync()
    {
        var studentId = AbpSession.UserId ?? throw new UserFriendlyException("You must be logged in.");
        var subject = await EnsureLifeSciencesEnrollmentAsync(studentId);
        var progress = await EnsureProgressAsync(studentId, subject);
        var topics = await _topicRepository.GetAllListAsync(x => x.SubjectId == subject.Id && x.IsActive);
        var lessons = await _lessonRepository.GetAllListAsync();

        var recommendedTopic = topics.OrderBy(x => x.SequenceOrder).FirstOrDefault();
        var recommendedLesson = recommendedTopic == null
            ? null
            : lessons
                .Where(x => x.TopicId == recommendedTopic.Id && x.IsPublished)
                .OrderBy(x => x.Title)
                .Select(MapLessonSummary)
                .FirstOrDefault();

        return new StudentLearningPathDto
        {
            Subject = MapSubjectDto(subject),
            Progress = MapStudentProgressDto(progress, subject.Name),
            Topics = topics
                .OrderBy(x => x.SequenceOrder)
                .Select(topic => new CurriculumTopicDetailDto
                {
                    Id = topic.Id,
                    Name = topic.Name,
                    Description = topic.Description,
                    DifficultyLevel = topic.DifficultyLevel,
                    SequenceOrder = topic.SequenceOrder,
                    IsActive = topic.IsActive,
                    MasteryThreshold = topic.MasteryThreshold,
                    Lessons = lessons
                        .Where(lesson => lesson.TopicId == topic.Id)
                        .OrderBy(lesson => lesson.Title)
                        .Select(MapLessonSummary)
                        .ToList()
                })
                .ToList(),
            RecommendedTopic = recommendedTopic == null ? null : MapTopicDto(recommendedTopic),
            RecommendedLesson = recommendedLesson,
            LatestDiagnostic = recommendedTopic == null ? null : BuildSyntheticDiagnostic(progress, recommendedTopic)
        };
    }

    public async Task<StudentProgressOverviewDto> GetProgressOverviewAsync()
    {
        var studentId = AbpSession.UserId ?? throw new UserFriendlyException("You must be logged in.");
        var subject = await EnsureLifeSciencesEnrollmentAsync(studentId);
        var progress = await EnsureProgressAsync(studentId, subject);
        var topics = await _topicRepository.GetAllListAsync(x => x.SubjectId == subject.Id && x.IsActive);
        var publishedLessonCount = await _lessonRepository.GetAll()
            .Join(_topicRepository.GetAll(), lesson => lesson.TopicId, topic => topic.Id, (lesson, topic) => new { lesson, topic })
            .Where(x => x.topic.SubjectId == subject.Id && x.lesson.IsPublished)
            .CountAsync();

        var recommendedTopic = topics.OrderBy(x => x.SequenceOrder).FirstOrDefault();

        return new StudentProgressOverviewDto
        {
            Subject = MapSubjectDto(subject),
            Progress = MapStudentProgressDto(progress, subject.Name),
            LatestDiagnostic = recommendedTopic == null ? null : BuildSyntheticDiagnostic(progress, recommendedTopic),
            FocusTopics = topics.OrderBy(x => x.SequenceOrder).Take(3).Select(x => x.Name).ToList(),
            PublishedLessonCount = publishedLessonCount
        };
    }

    public async Task<DiagnosticQuestionSetDto> StartDiagnosticAsync(Guid topicId)
    {
        var studentId = AbpSession.UserId ?? throw new UserFriendlyException("You must be logged in.");
        var subject = await EnsureLifeSciencesEnrollmentAsync(studentId);
        var topic = await _topicRepository.GetAsync(topicId);

        if (topic.SubjectId != subject.Id)
        {
            throw new UserFriendlyException("Topic does not belong to Life Sciences.");
        }

        return new DiagnosticQuestionSetDto
        {
            SubjectId = subject.Id,
            TopicId = topic.Id,
            SubjectName = subject.Name,
            TopicName = topic.Name,
            Questions = BuildQuestions(topic.Name)
        };
    }

    public async Task<DiagnosticResultDto> SubmitDiagnosticAsync(SubmitDiagnosticInput input)
    {
        var studentId = AbpSession.UserId ?? throw new UserFriendlyException("You must be logged in.");
        var subject = await EnsureLifeSciencesEnrollmentAsync(studentId);
        var topic = await _topicRepository.GetAsync(input.TopicId);

        if (topic.SubjectId != subject.Id)
        {
            throw new UserFriendlyException("Topic does not belong to Life Sciences.");
        }

        var questionSet = BuildQuestions(topic.Name);
        var answerKey = GetAnswerKey(topic.Name);
        var total = questionSet.Count;
        var correct = questionSet.Count(question =>
            input.Answers.TryGetValue(question.Id, out var provided) &&
            string.Equals(provided, answerKey[question.Id], StringComparison.OrdinalIgnoreCase));

        var scorePercent = total == 0 ? 0 : (int)Math.Round((decimal)correct / total * 100m);
        var recommendation = scorePercent >= 70
            ? "You are ready to continue to the next Life Sciences lesson."
            : "Review the topic lesson and ask the AI tutor for extra support before continuing.";

        var progress = await EnsureProgressAsync(studentId, subject);
        progress.UpdateProgress(
            masteryScore: scorePercent,
            progressStatus: scorePercent >= 70 ? "ReadyToAdvance" : "NeedsRevision",
            lastAssessmentScore: scorePercent,
            attemptCount: progress.AttemptCount + 1,
            needsIntervention: scorePercent < 50,
            completedLessonCount: progress.CompletedLessonCount,
            revisionNeeded: scorePercent < 70);

        await _progressRepository.UpdateAsync(progress);

        return new DiagnosticResultDto
        {
            SubjectId = subject.Id,
            TopicId = topic.Id,
            TopicName = topic.Name,
            ScorePercent = scorePercent,
            CorrectAnswers = correct,
            TotalQuestions = total,
            Recommendation = recommendation
        };
    }

    public async Task<LessonDetailDto> GetLessonAsync(Guid lessonId, string? languageCode = null)
    {
        var studentId = AbpSession.UserId ?? throw new UserFriendlyException("You must be logged in.");
        var subject = await EnsureLifeSciencesEnrollmentAsync(studentId);
        var lesson = await _lessonRepository.GetAsync(lessonId);
        var topic = await _topicRepository.GetAsync(lesson.TopicId);

        if (topic.SubjectId != subject.Id)
        {
            throw new UserFriendlyException("Lesson does not belong to Life Sciences.");
        }

        var allTranslations = await _translationRepository.GetAllListAsync(x => x.LessonId == lessonId);
        var languages = await _languageRepository.GetAllListAsync(x => x.IsActive);
        var languageMap = languages.ToDictionary(x => x.Id);

        IEnumerable<LessonTranslation> selectedTranslations = allTranslations;
        if (!string.IsNullOrWhiteSpace(languageCode))
        {
            selectedTranslations = allTranslations.Where(translation =>
                languageMap.TryGetValue(translation.LanguageId, out var language) &&
                string.Equals(language.Code, languageCode.Trim(), StringComparison.OrdinalIgnoreCase));
        }

        if (!selectedTranslations.Any())
        {
            selectedTranslations = allTranslations;
        }

        return new LessonDetailDto
        {
            Id = lesson.Id,
            TopicId = lesson.TopicId,
            Title = lesson.Title,
            Summary = lesson.Summary,
            LearningObjective = lesson.LearningObjective,
            RevisionSummary = lesson.RevisionSummary,
            DifficultyLevel = lesson.DifficultyLevel,
            EstimatedMinutes = lesson.EstimatedMinutes,
            IsPublished = lesson.IsPublished,
            Translations = selectedTranslations.Select(translation => new LessonTranslationSummaryDto
            {
                LanguageCode = languageMap.TryGetValue(translation.LanguageId, out var language) ? language.Code : "unknown",
                LanguageName = languageMap.TryGetValue(translation.LanguageId, out var name) ? name.Name : "Unknown",
                Title = translation.Title,
                Content = translation.Content,
                Summary = translation.Summary,
                Examples = translation.Examples,
                RevisionSummary = translation.RevisionSummary,
                IsAutoTranslated = translation.IsAutoTranslated
            }).ToList()
        };
    }

    private List<DiagnosticQuestionDto> BuildQuestions(string topicName)
    {
        var questions = QuestionBank.TryGetValue(topicName, out var configuredQuestions)
            ? configuredQuestions
            : GetDefaultQuestions();

        return questions.Select((question, index) => new DiagnosticQuestionDto
        {
            Id = $"{topicName}-{index + 1}",
            Prompt = question.Prompt,
            Options = question.Options.ToList()
        }).ToList();
    }

    private Dictionary<string, string> GetAnswerKey(string topicName)
    {
        var questions = QuestionBank.TryGetValue(topicName, out var configuredQuestions)
            ? configuredQuestions
            : GetDefaultQuestions();

        return questions
            .Select((question, index) => new KeyValuePair<string, string>($"{topicName}-{index + 1}", question.Answer))
            .ToDictionary(x => x.Key, x => x.Value);
    }

    private async Task<Subject> EnsureLifeSciencesEnrollmentAsync(long studentId)
    {
        var subject = await _subjectRepository.FirstOrDefaultAsync(x => x.Name == "Life Sciences" && x.IsActive)
            ?? throw new UserFriendlyException("Life Sciences is not configured.");

        var enrollment = await _enrollmentRepository.FirstOrDefaultAsync(x => x.StudentId == studentId && x.SubjectId == subject.Id && x.IsActive);
        if (enrollment == null)
        {
            enrollment = new StudentEnrollment(Guid.NewGuid(), studentId, subject.Id);
            await _enrollmentRepository.InsertAsync(enrollment);
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        return subject;
    }

    private async Task<StudentProgress> EnsureProgressAsync(long studentId, Subject subject)
    {
        var progress = await _progressRepository.FirstOrDefaultAsync(x => x.StudentId == studentId && x.SubjectId == subject.Id);
        if (progress != null)
        {
            return progress;
        }

        progress = new StudentProgress(Guid.NewGuid(), studentId, subject.Id);
        await _progressRepository.InsertAsync(progress);
        await CurrentUnitOfWork.SaveChangesAsync();
        return progress;
    }

    private static (string Prompt, string[] Options, string Answer)[] GetDefaultQuestions()
    {
        return
        [
            (
                "Which statement best matches this topic?",
                ["It is a key Life Sciences concept", "It is a geometry theorem", "It is a database table", "It is a network cable"],
                "It is a key Life Sciences concept"
            ),
            (
                "The best first step when studying this topic is to:",
                ["Review core definitions", "Skip the lesson", "Ignore diagrams", "Memorize unrelated facts"],
                "Review core definitions"
            ),
            (
                "If you are unsure about this topic, you should:",
                ["Use the lesson and ask the AI tutor", "Stop studying completely", "Change subjects immediately", "Guess every answer"],
                "Use the lesson and ask the AI tutor"
            )
        ];
    }

    private static SubjectDto MapSubjectDto(Subject subject)
    {
        return new SubjectDto
        {
            Id = subject.Id,
            Name = subject.Name,
            Description = subject.Description,
            GradeLevel = subject.GradeLevel,
            IsActive = subject.IsActive
        };
    }

    private static TopicDto MapTopicDto(Topic topic)
    {
        return new TopicDto
        {
            Id = topic.Id,
            SubjectId = topic.SubjectId,
            Name = topic.Name,
            Description = topic.Description,
            DifficultyLevel = topic.DifficultyLevel,
            SequenceOrder = topic.SequenceOrder,
            IsActive = topic.IsActive
        };
    }

    private static LessonSummaryDto MapLessonSummary(Lesson lesson)
    {
        return new LessonSummaryDto
        {
            Id = lesson.Id,
            TopicId = lesson.TopicId,
            Title = lesson.Title,
            DifficultyLevel = lesson.DifficultyLevel,
            EstimatedMinutes = lesson.EstimatedMinutes,
            IsPublished = lesson.IsPublished
        };
    }

    private static StudentProgressDto MapStudentProgressDto(StudentProgress progress, string subjectName)
    {
        return new StudentProgressDto
        {
            Id = progress.Id,
            StudentId = progress.StudentId,
            SubjectId = progress.SubjectId,
            SubjectName = subjectName,
            MasteryScore = progress.MasteryScore,
            ProgressStatus = progress.ProgressStatus,
            LastAssessmentScore = progress.LastAssessmentScore,
            AttemptCount = progress.AttemptCount,
            NeedsIntervention = progress.NeedsIntervention,
            UpdatedAt = progress.UpdatedAt,
            CompletedLessonCount = progress.CompletedLessonCount,
            RevisionNeeded = progress.RevisionNeeded
        };
    }

    private static DiagnosticResultDto BuildSyntheticDiagnostic(StudentProgress progress, Topic topic)
    {
        return new DiagnosticResultDto
        {
            SubjectId = progress.SubjectId,
            TopicId = topic.Id,
            TopicName = topic.Name,
            ScorePercent = (int)progress.LastAssessmentScore,
            CorrectAnswers = progress.LastAssessmentScore >= 70 ? 3 : progress.LastAssessmentScore >= 35 ? 2 : 1,
            TotalQuestions = 3,
            Recommendation = progress.LastAssessmentScore >= 70
                ? "Continue with the next recommended lesson."
                : "Take the diagnostic, review the lesson, and use the AI tutor for extra support."
        };
    }
}
