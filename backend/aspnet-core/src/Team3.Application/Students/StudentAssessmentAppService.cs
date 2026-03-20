using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Runtime.Session;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Team3.Academic;
using Team3.Configuration;
using Team3.Domain.Assessment;
using Team3.Enums;
using Team3.Localization;
using Team3.Students.Dto;

namespace Team3.Students
{
    [AbpAuthorize]
    public class StudentAssessmentAppService : Team3AppServiceBase, IStudentAssessmentAppService
    {
        private readonly IRepository<Assessment, Guid> _assessmentRepository;
        private readonly IRepository<Question, Guid> _questionRepository;
        private readonly IRepository<QuestionTranslation, Guid> _questionTranslationRepository;
        private readonly IRepository<Topic, Guid> _topicRepository;
        private readonly IRepository<Subject, Guid> _subjectRepository;
        private readonly IRepository<Lesson, Guid> _lessonRepository;
        private readonly IRepository<StudentEnrollment, Guid> _enrollmentRepository;
        private readonly IRepository<StudentAssessmentAttempt, Guid> _attemptRepository;
        private readonly IRepository<StudentAssessmentAnswer, Guid> _answerRepository;
        private readonly IRepository<StudentTopicProgress, Guid> _topicProgressRepository;
        private readonly IRepository<StudentLessonProgress, Guid> _lessonProgressRepository;
        private readonly IRepository<StudentProgress, Guid> _studentProgressRepository;
        private readonly IRepository<Language, Guid> _languageRepository;
        private readonly IRepository<UserLanguagePreference, long> _userLanguagePreferenceRepository;

        public StudentAssessmentAppService(
            IRepository<Assessment, Guid> assessmentRepository,
            IRepository<Question, Guid> questionRepository,
            IRepository<QuestionTranslation, Guid> questionTranslationRepository,
            IRepository<Topic, Guid> topicRepository,
            IRepository<Subject, Guid> subjectRepository,
            IRepository<Lesson, Guid> lessonRepository,
            IRepository<StudentEnrollment, Guid> enrollmentRepository,
            IRepository<StudentAssessmentAttempt, Guid> attemptRepository,
            IRepository<StudentAssessmentAnswer, Guid> answerRepository,
            IRepository<StudentTopicProgress, Guid> topicProgressRepository,
            IRepository<StudentLessonProgress, Guid> lessonProgressRepository,
            IRepository<StudentProgress, Guid> studentProgressRepository,
            IRepository<Language, Guid> languageRepository,
            IRepository<UserLanguagePreference, long> userLanguagePreferenceRepository)
        {
            _assessmentRepository = assessmentRepository;
            _questionRepository = questionRepository;
            _questionTranslationRepository = questionTranslationRepository;
            _topicRepository = topicRepository;
            _subjectRepository = subjectRepository;
            _lessonRepository = lessonRepository;
            _enrollmentRepository = enrollmentRepository;
            _attemptRepository = attemptRepository;
            _answerRepository = answerRepository;
            _topicProgressRepository = topicProgressRepository;
            _lessonProgressRepository = lessonProgressRepository;
            _studentProgressRepository = studentProgressRepository;
            _languageRepository = languageRepository;
            _userLanguagePreferenceRepository = userLanguagePreferenceRepository;
        }

        public async Task<StudentAssessmentDto> GetAssessmentAsync(Guid assessmentId)
        {
            var studentId = AbpSession.GetUserId();
            var context = await GetAssessmentContextAsync(studentId, assessmentId);
            var preferredLanguageCode = await GetPreferredLanguageCodeAsync(studentId);
            var languages = await _languageRepository.GetAllListAsync();
            var languageMap = languages.ToDictionary(x => x.Id);

            var questions = await _questionRepository.GetAll()
                .Where(x => x.AssessmentId == context.Assessment.Id && x.IsActive)
                .OrderBy(x => x.SequenceOrder)
                .ToListAsync();

            var questionIds = questions.Select(x => x.Id).ToList();
            var translations = await _questionTranslationRepository.GetAll()
                .Where(x => questionIds.Contains(x.QuestionId))
                .ToListAsync();

            return new StudentAssessmentDto
            {
                AssessmentId = context.Assessment.Id,
                SubjectId = context.Subject.Id,
                TopicId = context.Topic.Id,
                LessonId = context.Assessment.LessonId,
                SubjectName = context.Subject.Name,
                TopicName = context.Topic.Name,
                Title = context.Assessment.Title,
                AssessmentType = context.Assessment.AssessmentType,
                DifficultyLevel = context.Assessment.DifficultyLevel,
                TotalMarks = context.Assessment.TotalMarks > 0 ? context.Assessment.TotalMarks : questions.Sum(x => x.Marks),
                LanguageCode = preferredLanguageCode,
                Questions = questions.Select(question =>
                {
                    var translation = SelectBestTranslation(
                        translations.Where(x => x.QuestionId == question.Id).ToList(),
                        languageMap,
                        preferredLanguageCode);

                    return new StudentAssessmentQuestionDto
                    {
                        QuestionId = question.Id,
                        QuestionType = question.QuestionType,
                        SequenceOrder = question.SequenceOrder,
                        Marks = question.Marks,
                        QuestionText = translation?.QuestionText ?? string.Empty,
                        OptionA = translation?.OptionA,
                        OptionB = translation?.OptionB,
                        OptionC = translation?.OptionC,
                        OptionD = translation?.OptionD,
                        HintText = translation?.HintText,
                        LanguageCode = translation != null && languageMap.TryGetValue(translation.LanguageId, out var language)
                            ? language.Code
                            : "en",
                        LanguageName = translation != null && languageMap.TryGetValue(translation.LanguageId, out var translationLanguage)
                            ? translationLanguage.Name
                            : "English"
                    };
                }).ToList()
            };
        }

        public Task<SubmitStudentAssessmentOutputDto> SubmitDiagnosticAsync(SubmitStudentAssessmentInputDto input)
        {
            return SubmitAssessmentAsync(input, AssessmentType.Diagnostic);
        }

        public Task<SubmitStudentAssessmentOutputDto> SubmitLessonQuizAsync(SubmitStudentAssessmentInputDto input)
        {
            return SubmitAssessmentAsync(input, AssessmentType.Quiz);
        }

        private async Task<SubmitStudentAssessmentOutputDto> SubmitAssessmentAsync(
            SubmitStudentAssessmentInputDto input,
            AssessmentType expectedAssessmentType)
        {
            if (input == null)
            {
                throw new UserFriendlyException("Assessment submission is required.");
            }

            var studentId = AbpSession.GetUserId();
            var context = await GetAssessmentContextAsync(studentId, input.AssessmentId);

            if (context.Assessment.AssessmentType != expectedAssessmentType)
            {
                throw new UserFriendlyException($"Assessment is not a {expectedAssessmentType}.");
            }

            var preferredLanguageCode = await GetPreferredLanguageCodeAsync(studentId);
            var languages = await _languageRepository.GetAllListAsync();
            var languageMap = languages.ToDictionary(x => x.Id);
            var questions = await _questionRepository.GetAll()
                .Where(x => x.AssessmentId == context.Assessment.Id && x.IsActive)
                .OrderBy(x => x.SequenceOrder)
                .ToListAsync();

            var questionIds = questions.Select(x => x.Id).ToList();
            var translations = await _questionTranslationRepository.GetAll()
                .Where(x => questionIds.Contains(x.QuestionId))
                .ToListAsync();

            var answersByQuestionId = input.Answers.ToDictionary(x => x.QuestionId, x => x);
            var totalMarks = questions.Sum(x => x.Marks);
            decimal score = 0m;
            var feedback = new List<StudentQuestionFeedbackDto>();

            foreach (var question in questions)
            {
                answersByQuestionId.TryGetValue(question.Id, out var submittedAnswer);
                var isCorrect = IsAnswerCorrect(question, submittedAnswer);
                var marksAwarded = isCorrect ? question.Marks : 0m;
                score += marksAwarded;

                var translation = SelectBestTranslation(
                    translations.Where(x => x.QuestionId == question.Id).ToList(),
                    languageMap,
                    preferredLanguageCode);

                feedback.Add(new StudentQuestionFeedbackDto
                {
                    QuestionId = question.Id,
                    SelectedOption = submittedAnswer?.SelectedOption,
                    AnswerText = submittedAnswer?.AnswerText,
                    IsCorrect = isCorrect,
                    MarksAwarded = marksAwarded,
                    CorrectAnswer = question.CorrectAnswer,
                    ExplanationText = translation?.ExplanationText
                });
            }

            var percentage = totalMarks <= 0 ? 0m : Math.Round((score / totalMarks) * 100m, 2, MidpointRounding.AwayFromZero);
            var attemptNumber = await _attemptRepository.CountAsync(x => x.StudentId == studentId && x.AssessmentId == context.Assessment.Id) + 1;
            var assignedDifficulty = context.Assessment.AssessmentType == AssessmentType.Diagnostic
                ? CalculateAssignedDifficulty(percentage)
                : await ResolveAssignedDifficultyAsync(studentId, context.Assessment, context.Topic, percentage);
            var passThresholdPercent = Math.Round(context.Topic.MasteryThreshold * 100m, 2, MidpointRounding.AwayFromZero);
            var passed = percentage >= passThresholdPercent;

            var attempt = new StudentAssessmentAttempt(
                Guid.NewGuid(),
                studentId,
                context.Assessment.Id,
                context.Assessment.AssessmentType,
                context.Subject.Id,
                context.Topic.Id,
                context.Assessment.LessonId,
                score,
                totalMarks,
                percentage,
                assignedDifficulty,
                passed,
                attemptNumber);

            await _attemptRepository.InsertAsync(attempt);

            foreach (var item in feedback)
            {
                await _answerRepository.InsertAsync(new StudentAssessmentAnswer(
                    Guid.NewGuid(),
                    attempt.Id,
                    item.QuestionId,
                    item.SelectedOption,
                    item.AnswerText,
                    item.IsCorrect,
                    item.MarksAwarded));
            }

            string nextRecommendedAction;

            if (context.Assessment.AssessmentType == AssessmentType.Diagnostic)
            {
                await UpsertTopicProgressAsync(studentId, context.Topic.Id, assignedDifficulty, percentage, !passed, false);
                nextRecommendedAction = await BuildDiagnosticNextActionAsync(context.Topic.Id, assignedDifficulty);
            }
            else
            {
                await UpsertTopicProgressAsync(studentId, context.Topic.Id, assignedDifficulty, percentage, !passed, passed);

                if (context.Assessment.LessonId.HasValue)
                {
                    await UpsertLessonProgressAsync(studentId, context.Assessment.LessonId.Value, context.Subject.Id, context.Topic.Id, attempt.Id, passed);
                }

                nextRecommendedAction = passed
                    ? await BuildNextTopicActionAsync(context.Subject.Id, context.Topic.Id)
                    : "Review the lesson and retry the quiz.";
            }

            await UpdateStudentProgressAsync(studentId, context.Subject.Id);
            await CurrentUnitOfWork.SaveChangesAsync();

            return new SubmitStudentAssessmentOutputDto
            {
                AttemptId = attempt.Id,
                AssessmentId = context.Assessment.Id,
                Score = score,
                TotalMarks = totalMarks,
                Percentage = percentage,
                Passed = passed,
                AssignedDifficultyLevel = assignedDifficulty,
                NextRecommendedAction = nextRecommendedAction,
                AttemptNumber = attemptNumber,
                Feedback = feedback
            };
        }

        private async Task<(Assessment Assessment, Topic Topic, Subject Subject)> GetAssessmentContextAsync(long studentId, Guid assessmentId)
        {
            var assessment = await _assessmentRepository.FirstOrDefaultAsync(assessmentId)
                ?? throw new UserFriendlyException("Assessment not found.");

            var topic = await _topicRepository.FirstOrDefaultAsync(assessment.TopicId)
                ?? throw new UserFriendlyException("Topic not found.");
            var subject = await _subjectRepository.FirstOrDefaultAsync(topic.SubjectId)
                ?? throw new UserFriendlyException("Subject not found.");

            await EnsureStudentHasAccessToSubjectAsync(studentId, subject.Id);

            return (assessment, topic, subject);
        }

        private async Task EnsureStudentHasAccessToSubjectAsync(long studentId, Guid subjectId)
        {
            var enrollment = await _enrollmentRepository.FirstOrDefaultAsync(x => x.StudentId == studentId && x.SubjectId == subjectId && x.IsActive);
            if (enrollment == null)
            {
                throw new UserFriendlyException("You are not enrolled in this subject.");
            }
        }

        private async Task<string> GetPreferredLanguageCodeAsync(long userId)
        {
            var preference = await _userLanguagePreferenceRepository.FirstOrDefaultAsync(x => x.UserId == userId);
            if (preference != null && !string.IsNullOrWhiteSpace(preference.LanguageCode))
            {
                return preference.LanguageCode.Trim().ToLowerInvariant();
            }

            var defaultLanguage = await _languageRepository.FirstOrDefaultAsync(x => x.IsDefault && x.IsActive);
            return defaultLanguage?.Code?.Trim().ToLowerInvariant() ?? "en";
        }

        private static QuestionTranslation? SelectBestTranslation(IReadOnlyCollection<QuestionTranslation> translations, IReadOnlyDictionary<Guid, Language> languageMap, string preferredLanguageCode)
        {
            return translations.FirstOrDefault(x => languageMap.TryGetValue(x.LanguageId, out var language) && string.Equals(language.Code, preferredLanguageCode, StringComparison.OrdinalIgnoreCase))
                   ?? translations.FirstOrDefault(x => languageMap.TryGetValue(x.LanguageId, out var language) && string.Equals(language.Code, "en", StringComparison.OrdinalIgnoreCase))
                   ?? translations.FirstOrDefault();
        }

        private static bool IsAnswerCorrect(Question question, StudentAssessmentAnswerInputDto? answer)
        {
            if (answer == null)
            {
                return false;
            }

            var expected = (question.CorrectAnswer ?? string.Empty).Trim();

            return question.QuestionType switch
            {
                QuestionType.MultipleChoice or QuestionType.TrueFalse => string.Equals(expected, (answer.SelectedOption ?? string.Empty).Trim(), StringComparison.OrdinalIgnoreCase),
                QuestionType.ShortAnswer => string.Equals(expected, (answer.AnswerText ?? string.Empty).Trim(), StringComparison.OrdinalIgnoreCase),
                _ => false
            };
        }

        private static DifficultyLevel CalculateAssignedDifficulty(decimal percentage)
        {
            if (percentage < 40m)
            {
                return DifficultyLevel.Easy;
            }

            if (percentage < 75m)
            {
                return DifficultyLevel.Medium;
            }

            return DifficultyLevel.Hard;
        }

        private async Task<DifficultyLevel> ResolveAssignedDifficultyAsync(long studentId, Assessment assessment, Topic topic, decimal percentage)
        {
            var existingTopicProgress = await _topicProgressRepository.FirstOrDefaultAsync(x => x.StudentId == studentId && x.TopicId == topic.Id);
            if (existingTopicProgress != null)
            {
                return percentage < 40m ? DifficultyLevel.Easy : existingTopicProgress.AssignedDifficultyLevel;
            }

            return assessment.DifficultyLevel;
        }

        private async Task UpsertTopicProgressAsync(long studentId, Guid topicId, DifficultyLevel assignedDifficulty, decimal masteryScore, bool needsRevision, bool completed)
        {
            var topicProgress = await _topicProgressRepository.FirstOrDefaultAsync(x => x.StudentId == studentId && x.TopicId == topicId);
            if (topicProgress == null)
            {
                topicProgress = new StudentTopicProgress(Guid.NewGuid(), studentId, topicId, assignedDifficulty);
                await _topicProgressRepository.InsertAsync(topicProgress);
            }

            if (completed)
            {
                topicProgress.MarkCompleted(masteryScore, needsRevision);
            }
            else
            {
                topicProgress.MarkCurrent(assignedDifficulty, masteryScore, needsRevision);
            }
        }

        private async Task UpsertLessonProgressAsync(long studentId, Guid lessonId, Guid subjectId, Guid topicId, Guid attemptId, bool completed)
        {
            var lessonProgress = await _lessonProgressRepository.FirstOrDefaultAsync(x => x.StudentId == studentId && x.LessonId == lessonId);
            if (lessonProgress == null)
            {
                lessonProgress = new StudentLessonProgress(Guid.NewGuid(), studentId, lessonId, subjectId, topicId);
                await _lessonProgressRepository.InsertAsync(lessonProgress);
            }

            if (completed)
            {
                lessonProgress.MarkCompleted(attemptId);
            }
            else
            {
                lessonProgress.MarkCurrent();
                lessonProgress.SetLastQuizAttempt(attemptId);
            }
        }

        private async Task<string> BuildDiagnosticNextActionAsync(Guid topicId, DifficultyLevel assignedDifficulty)
        {
            var lesson = await _lessonRepository.GetAll()
                .Where(x => x.TopicId == topicId && x.DifficultyLevel == assignedDifficulty)
                .OrderBy(x => x.Title)
                .FirstOrDefaultAsync()
                ?? await _lessonRepository.GetAll()
                    .Where(x => x.TopicId == topicId)
                    .OrderBy(x => x.Title)
                    .FirstOrDefaultAsync();

            return lesson == null ? "No lesson is available for this topic yet." : $"Start lesson: {lesson.Title}.";
        }

        private async Task<string> BuildNextTopicActionAsync(Guid subjectId, Guid currentTopicId)
        {
            var topics = await _topicRepository.GetAll()
                .Where(x => x.SubjectId == subjectId && x.IsActive)
                .OrderBy(x => x.SequenceOrder)
                .ToListAsync();

            var currentIndex = topics.FindIndex(x => x.Id == currentTopicId);
            var nextTopic = currentIndex >= 0 && currentIndex + 1 < topics.Count ? topics[currentIndex + 1] : null;

            return nextTopic == null ? "You have completed the available topic path for this subject." : $"Take the diagnostic for the next topic: {nextTopic.Name}.";
        }

        private async Task UpdateStudentProgressAsync(long studentId, Guid subjectId)
        {
            var attempts = await _attemptRepository.GetAll()
                .Where(x => x.StudentId == studentId && x.SubjectId == subjectId)
                .OrderByDescending(x => x.SubmittedAt)
                .ToListAsync();

            var topicIds = await _topicRepository.GetAll()
                .Where(x => x.SubjectId == subjectId && x.IsActive)
                .Select(x => x.Id)
                .ToListAsync();

            var topicProgresses = await _topicProgressRepository.GetAll()
                .Where(x => x.StudentId == studentId && topicIds.Contains(x.TopicId))
                .ToListAsync();

            var lessonProgresses = await _lessonProgressRepository.GetAll()
                .Where(x => x.StudentId == studentId && x.SubjectId == subjectId)
                .ToListAsync();

            var masteryScore = attempts.Any() ? Math.Round(attempts.Average(x => x.Percentage), 2, MidpointRounding.AwayFromZero) : 0m;
            var lastAssessmentScore = attempts.FirstOrDefault()?.Percentage ?? 0m;
            var attemptCount = attempts.Count;
            var completedLessonCount = lessonProgresses.Count(x => x.Status == LearningProgressStatus.Completed);
            var revisionNeeded = topicProgresses.Any(x => x.NeedsRevision);
            var needsIntervention = revisionNeeded || attempts.Take(2).Count(x => !x.Passed) == 2;
            var completedTopics = topicProgresses.Count(x => x.Status == LearningProgressStatus.Completed);
            var progressStatus = completedTopics == topicIds.Count && topicIds.Count > 0
                ? "Completed"
                : attemptCount == 0 && completedLessonCount == 0
                    ? "NotStarted"
                    : "InProgress";

            var studentProgress = await _studentProgressRepository.FirstOrDefaultAsync(x => x.StudentId == studentId && x.SubjectId == subjectId);
            if (studentProgress == null)
            {
                studentProgress = new StudentProgress(Guid.NewGuid(), studentId, subjectId);
                await _studentProgressRepository.InsertAsync(studentProgress);
            }

            studentProgress.UpdateProgress(masteryScore, progressStatus, lastAssessmentScore, attemptCount, needsIntervention, completedLessonCount, revisionNeeded);
        }
    }
}
