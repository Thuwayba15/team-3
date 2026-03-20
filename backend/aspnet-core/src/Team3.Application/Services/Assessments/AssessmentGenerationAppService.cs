using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Team3.Academic;
using Team3.Configuration;
using Team3.Domain.Assessment;
using Team3.Enums;
using Team3.LearningMaterials;

namespace Team3.Services.Assessments
{
    internal class DiagnosticTopicResult
    {
        public Topic Topic { get; set; }
        public List<GeneratedQuestionData> Questions { get; set; }
    }

    [AbpAllowAnonymous]
    public class AssessmentGenerationAppService : Team3AppServiceBase, IAssessmentGenerationAppService
    {
        private static readonly string[] RequiredLanguageCodes = ["en", "zu", "st", "af"];
        private static readonly DifficultyLevel[] AllDifficulties = [DifficultyLevel.Easy, DifficultyLevel.Medium, DifficultyLevel.Hard];

        public IRepository<Lesson, Guid> LessonRepository { get; set; }
        public IRepository<Topic, Guid> TopicRepository { get; set; }
        public IRepository<Subject, Guid> SubjectRepository { get; set; }
        public IRepository<Assessment, Guid> AssessmentRepository { get; set; }
        public IRepository<Question, Guid> QuestionRepository { get; set; }
        public IRepository<QuestionTranslation, Guid> QuestionTranslationRepository { get; set; }
        public IRepository<Language, Guid> LanguageRepository { get; set; }




        // -------------------------------------------------------
        // LESSON QUIZ — Easy, Medium, Hard × all languages
        // -------------------------------------------------------
        [AbpAllowAnonymous]
        [UnitOfWork(false)]
        public async Task<GeneratedAssessmentOutput> GenerateLessonQuizAsync(GenerateLessonQuizInput input)
        {

            if (LessonRepository == null) throw new UserFriendlyException("LessonRepository is null");
            if (TopicRepository == null) throw new UserFriendlyException("TopicRepository is null");
            if (SubjectRepository == null) throw new UserFriendlyException("SubjectRepository is null");
            if (AssessmentRepository == null) throw new UserFriendlyException("AssessmentRepository is null");
            if (QuestionRepository == null) throw new UserFriendlyException("QuestionRepository is null");
            if (QuestionTranslationRepository == null) throw new UserFriendlyException("QuestionTranslationRepository is null");
            if (LanguageRepository == null) throw new UserFriendlyException("LanguageRepository is null");
            var translationService = new GeminiPlaceholderTranslationService(SettingManager);

            try
            {
                var lesson = await LessonRepository.FirstOrDefaultAsync(input.LessonId)
                    ?? throw new UserFriendlyException("Lesson not found.");

                var topic = await TopicRepository.FirstOrDefaultAsync(lesson.TopicId)
                    ?? throw new UserFriendlyException("Topic not found.");

                var allLanguages = await LanguageRepository.GetAllListAsync(
                    x => RequiredLanguageCodes.Contains(x.Code) && x.IsActive);

                var lessonContent = $"Title: {lesson.Title}\nSummary: {lesson.Summary}\nLearning Objective: {lesson.LearningObjective}";

                var difficultiesToGenerate = input.DifficultyLevel.HasValue
                    ? [input.DifficultyLevel.Value]
                    : AllDifficulties;

                var difficultyTasks = difficultiesToGenerate.Select(async difficulty =>
                {
                    var questions = await GenerateQuestionsFromGemini(
                        translationService, lessonContent, difficulty, allLanguages, AssessmentType.Quiz);

                    return (Difficulty: difficulty, Questions: questions);
                });

                var allGeneratedDifficulties = await Task.WhenAll(difficultyTasks);

                // Save to DB
                var output = new GeneratedAssessmentOutput();

                foreach (var (difficulty, questions) in allGeneratedDifficulties)
                {
                    var assessment = new Assessment(
                        Guid.NewGuid(),
                        topic.Id,
                        lesson.Id,
                        $"{lesson.Title} — Quiz ({difficulty})",
                        AssessmentType.Quiz,
                        difficulty,
                        input.IsPublished,
                        generatedByAI: true);

                    await AssessmentRepository.InsertAsync(assessment);

                    var questionDtos = await SaveQuestionsAsync(questions, assessment.Id, allLanguages);

                    var totalMarks = questions.Sum(q => q.Marks);
                    assessment.SetTotalMarks(totalMarks);

                    output.Assessments.Add(new AssessmentResultDto
                    {
                        AssessmentId = assessment.Id,
                        TopicId = topic.Id,
                        LessonId = lesson.Id,
                        Title = assessment.Title,
                        AssessmentType = AssessmentType.Quiz,
                        DifficultyLevel = difficulty,
                        TotalMarks = totalMarks,
                        Questions = questionDtos
                    });
                }

                await CurrentUnitOfWork.SaveChangesAsync();
                return output;
            }
            catch (UserFriendlyException) { throw; }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString(), ex);
                throw new UserFriendlyException($"DEBUG: {ex.GetType().Name}: {ex.Message} | {ex.InnerException?.Message}");
            }
        }

        // -------------------------------------------------------
        // DIAGNOSTIC QUIZ — Medium only × all languages
        // covers all lessons across all topics for a subject
        // -------------------------------------------------------
        [AbpAllowAnonymous]
        [UnitOfWork(false)]
        public async Task<GeneratedAssessmentOutput> GenerateDiagnosticQuizAsync(GenerateDiagnosticQuizInput input)
        {
            var translationService = new GeminiPlaceholderTranslationService(SettingManager);

            try
            {
                var subject = await SubjectRepository.FirstOrDefaultAsync(input.SubjectId)
                    ?? throw new UserFriendlyException("Subject not found.");

                var topics = await TopicRepository.GetAllListAsync(
                    x => x.SubjectId == input.SubjectId && x.IsActive);

                if (!topics.Any())
                    throw new UserFriendlyException("No active topics found for this subject.");

                var allLanguages = await LanguageRepository.GetAllListAsync(
                    x => RequiredLanguageCodes.Contains(x.Code) && x.IsActive);

                // For each topic, gather all its lessons and generate one medium diagnostic — all in parallel
                var topicTasks = topics.Select(async topic =>
                {
                    var lessons = await LessonRepository.GetAllListAsync(
                        x => x.TopicId == topic.Id && x.IsPublished);

                    if (!lessons.Any()) return null;

                    var combinedContent = string.Join("\n\n", lessons.Select(l =>
                        $"Lesson: {l.Title}\nSummary: {l.Summary}\nObjective: {l.LearningObjective}"));

                    var questions = await GenerateQuestionsFromGemini(
                        translationService, combinedContent, DifficultyLevel.Medium, allLanguages, AssessmentType.Diagnostic);

                    return new DiagnosticTopicResult { Topic = topic, Questions = questions };
                });

                var topicResults = (await Task.WhenAll(topicTasks))
                    .Where(x => x != null)
                    .ToList();

                // Save to DB
                var output = new GeneratedAssessmentOutput();

                foreach (var result in topicResults)
                {
                    var assessment = new Assessment(
                        Guid.NewGuid(),
                        result.Topic.Id,
                        null,
                        $"{subject.Name} — {result.Topic.Name} Diagnostic Quiz",
                        AssessmentType.Diagnostic,
                        DifficultyLevel.Medium,
                        input.IsPublished,
                        generatedByAI: true);

                    await AssessmentRepository.InsertAsync(assessment);

                    var questionDtos = await SaveQuestionsAsync(result.Questions, assessment.Id, allLanguages);
                    var totalMarks = result.Questions.Sum(q => q.Marks);
                    assessment.SetTotalMarks(totalMarks);

                    output.Assessments.Add(new AssessmentResultDto
                    {
                        AssessmentId = assessment.Id,
                        TopicId = result.Topic.Id,
                        LessonId = null,
                        Title = assessment.Title,
                        AssessmentType = AssessmentType.Diagnostic,
                        DifficultyLevel = DifficultyLevel.Medium,
                        TotalMarks = totalMarks,
                        Questions = questionDtos
                    });
                }

                await CurrentUnitOfWork.SaveChangesAsync();
                return output;
            }
            catch (UserFriendlyException) { throw; }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString(), ex);
                throw new UserFriendlyException($"DEBUG: {ex.GetType().Name}: {ex.Message} | {ex.InnerException?.Message}");
            }
        }

        // -------------------------------------------------------
        // GEMINI — generate questions + translate all in parallel
        // -------------------------------------------------------
        private async Task<List<GeneratedQuestionData>> GenerateQuestionsFromGemini(
            GeminiPlaceholderTranslationService translationService,
            string lessonContent,
            DifficultyLevel difficulty,
            List<Language> allLanguages,
            AssessmentType assessmentType)
        {
            var difficultyLabel = difficulty switch
            {
                DifficultyLevel.Easy => "easy (simple language, basic recall)",
                DifficultyLevel.Medium => "medium (moderate complexity, some application)",
                DifficultyLevel.Hard => "hard (advanced reasoning, analysis)",
                _ => "medium"
            };

            var assessmentLabel = assessmentType == AssessmentType.Diagnostic
                ? "diagnostic assessment covering the overall topic"
                : "quiz focused on this specific lesson";

            var jsonStructure = """
                {
                  "questions": [
                    {
                      "questionText": "Question here?",
                      "optionA": "Option A",
                      "optionB": "Option B",
                      "optionC": "Option C",
                      "optionD": "Option D",
                      "correctAnswer": "A",
                      "explanation": "Explanation here"
                    }
                  ]
                }
                """;

            var prompt = $"""
                You are generating a {assessmentLabel} at {difficultyLabel} difficulty.

                Based on the following lesson content, generate exactly 5 multiple choice questions.

                Rules:
                - Each question must have exactly 4 options: A, B, C, D
                - Only one option is correct
                - Include a brief explanation for the correct answer
                - Each question is worth 1 mark
                - Return ONLY valid JSON, no commentary, no markdown

                Return this exact JSON structure:
                {jsonStructure}

                Lesson content:
                {lessonContent}
                """;

            var jsonResponse = await translationService.SendPromptAsync(prompt);
            var parsedQuestions = ParseQuestionsFromJson(jsonResponse);

            var sourceLanguage = allLanguages.First(x => x.Code == "en");

            var translationTasks = parsedQuestions.Select(async (q, index) =>
            {
                var languageTasks = allLanguages.Select(async language =>
                {
                    if (language.Code == sourceLanguage.Code)
                    {
                        return new GeneratedTranslationData
                        {
                            LanguageCode = language.Code,
                            LanguageName = language.Name,
                            LanguageId = language.Id,
                            QuestionText = q.QuestionText,
                            OptionA = q.OptionA,
                            OptionB = q.OptionB,
                            OptionC = q.OptionC,
                            OptionD = q.OptionD,
                            ExplanationText = q.Explanation
                        };
                    }

                    var fields = await Task.WhenAll(
                        translationService.TranslateTextAsync(q.QuestionText, "en", language.Code),
                        translationService.TranslateTextAsync(q.OptionA, "en", language.Code),
                        translationService.TranslateTextAsync(q.OptionB, "en", language.Code),
                        translationService.TranslateTextAsync(q.OptionC, "en", language.Code),
                        translationService.TranslateTextAsync(q.OptionD, "en", language.Code),
                        translationService.TranslateTextAsync(q.Explanation ?? string.Empty, "en", language.Code)
                    );

                    return new GeneratedTranslationData
                    {
                        LanguageCode = language.Code,
                        LanguageName = language.Name,
                        LanguageId = language.Id,
                        QuestionText = fields[0],
                        OptionA = fields[1],
                        OptionB = fields[2],
                        OptionC = fields[3],
                        OptionD = fields[4],
                        ExplanationText = fields[5]
                    };
                });

                var translations = await Task.WhenAll(languageTasks);

                return new GeneratedQuestionData
                {
                    QuestionType = QuestionType.MultipleChoice,
                    CorrectAnswer = q.CorrectAnswer,
                    Explanation = q.Explanation,
                    Marks = 1,
                    SequenceOrder = index + 1,
                    Translations = translations.ToList()
                };
            });

            return (await Task.WhenAll(translationTasks)).ToList();
        }

        // -------------------------------------------------------
        // SAVE questions + translations to DB
        // -------------------------------------------------------
        private async Task<List<QuestionResultDto>> SaveQuestionsAsync(
            List<GeneratedQuestionData> questions,
            Guid assessmentId,
            List<Language> allLanguages)
        {
            var questionDtos = new List<QuestionResultDto>();

            foreach (var q in questions)
            {
                var question = new Question(
                    Guid.NewGuid(),
                    assessmentId,
                    q.QuestionType,
                    DifficultyLevel.Medium,
                    q.CorrectAnswer,
                    q.Explanation,
                    q.Marks,
                    q.SequenceOrder,
                    generatedByAI: true);

                await QuestionRepository.InsertAsync(question);

                var translationDtos = new List<QuestionTranslationResultDto>();

                foreach (var t in q.Translations)
                {
                    var translation = new QuestionTranslation(
                        Guid.NewGuid(),
                        question.Id,
                        t.LanguageId,
                        t.QuestionText,
                        t.OptionA,
                        t.OptionB,
                        t.OptionC,
                        t.OptionD,
                        t.HintText,
                        t.ExplanationText);

                    await QuestionTranslationRepository.InsertAsync(translation);

                    translationDtos.Add(new QuestionTranslationResultDto
                    {
                        LanguageCode = t.LanguageCode,
                        LanguageName = t.LanguageName,
                        QuestionText = t.QuestionText,
                        OptionA = t.OptionA,
                        OptionB = t.OptionB,
                        OptionC = t.OptionC,
                        OptionD = t.OptionD,
                        ExplanationText = t.ExplanationText
                    });
                }

                questionDtos.Add(new QuestionResultDto
                {
                    QuestionId = question.Id,
                    QuestionType = q.QuestionType,
                    CorrectAnswer = q.CorrectAnswer,
                    Marks = q.Marks,
                    SequenceOrder = q.SequenceOrder,
                    Translations = translationDtos
                });
            }

            return questionDtos;
        }

        // -------------------------------------------------------
        // PARSE Gemini JSON response into question data
        // -------------------------------------------------------
        private static List<(string QuestionText, string OptionA, string OptionB, string OptionC, string OptionD, string CorrectAnswer, string Explanation)>
            ParseQuestionsFromJson(string json)
         {
            var result = new List<(string, string, string, string, string, string, string)>();

            try
            {
                var cleaned = json.Trim();
                if (cleaned.StartsWith("```"))
                {
                    var lines = cleaned.Split('\n').ToList();
                    cleaned = string.Join("\n", lines.Skip(1).Take(lines.Count - 2)).Trim();
                }

                using var doc = JsonDocument.Parse(cleaned);
                var questions = doc.RootElement.GetProperty("questions");

                foreach (var q in questions.EnumerateArray())
                {
                    result.Add((
                        q.GetProperty("questionText").GetString() ?? string.Empty,
                        q.GetProperty("optionA").GetString() ?? string.Empty,
                        q.GetProperty("optionB").GetString() ?? string.Empty,
                        q.GetProperty("optionC").GetString() ?? string.Empty,
                        q.GetProperty("optionD").GetString() ?? string.Empty,
                        q.GetProperty("correctAnswer").GetString() ?? "A",
                        q.TryGetProperty("explanation", out var exp) ? exp.GetString() ?? string.Empty : string.Empty
                    ));
                }
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException($"Failed to parse Gemini question response: {ex.Message} | Raw: {json}");
            }

            return result;
        }







        //Gets
        [AbpAllowAnonymous]
        public async Task<GeneratedAssessmentOutput> GetLessonAssessmentsAsync(Guid lessonId)
        {
            try
            {
                var lesson = await LessonRepository.FirstOrDefaultAsync(lessonId)
                    ?? throw new UserFriendlyException("Lesson not found.");

                var topic = await TopicRepository.FirstOrDefaultAsync(lesson.TopicId)
                    ?? throw new UserFriendlyException("Topic not found.");

                var allLanguages = await LanguageRepository.GetAllListAsync(
                    x => RequiredLanguageCodes.Contains(x.Code) && x.IsActive);

                var assessments = await AssessmentRepository.GetAllListAsync(
                    x => x.LessonId == lessonId && x.AssessmentType == AssessmentType.Quiz);

                if (!assessments.Any())
                    throw new UserFriendlyException("No assessments found for this lesson. Generate them first.");

                var output = new GeneratedAssessmentOutput();

                foreach (var assessment in assessments.OrderBy(x => x.DifficultyLevel))
                {
                    var questions = await QuestionRepository.GetAllListAsync(
                        x => x.AssessmentId == assessment.Id && x.IsActive);

                    var questionDtos = new List<QuestionResultDto>();

                    foreach (var question in questions.OrderBy(x => x.SequenceOrder))
                    {
                        var translations = await QuestionTranslationRepository.GetAllListAsync(
                            x => x.QuestionId == question.Id);

                        var translationDtos = translations.Select(t =>
                        {
                            var language = allLanguages.FirstOrDefault(l => l.Id == t.LanguageId);
                            return new QuestionTranslationResultDto
                            {
                                LanguageCode = language?.Code ?? string.Empty,
                                LanguageName = language?.Name ?? string.Empty,
                                QuestionText = t.QuestionText,
                                OptionA = t.OptionA,
                                OptionB = t.OptionB,
                                OptionC = t.OptionC,
                                OptionD = t.OptionD,
                                ExplanationText = t.ExplanationText
                            };
                        }).ToList();

                        questionDtos.Add(new QuestionResultDto
                        {
                            QuestionId = question.Id,
                            QuestionType = question.QuestionType,
                            CorrectAnswer = question.CorrectAnswer,
                            Marks = question.Marks,
                            SequenceOrder = question.SequenceOrder,
                            Translations = translationDtos
                        });
                    }

                    output.Assessments.Add(new AssessmentResultDto
                    {
                        AssessmentId = assessment.Id,
                        TopicId = topic.Id,
                        LessonId = lessonId,
                        Title = assessment.Title,
                        AssessmentType = assessment.AssessmentType,
                        DifficultyLevel = assessment.DifficultyLevel,
                        TotalMarks = assessment.TotalMarks,
                        Questions = questionDtos
                    });
                }

                return output;
            }
            catch (UserFriendlyException) { throw; }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString(), ex);
                throw new UserFriendlyException($"DEBUG: {ex.GetType().Name}: {ex.Message} | {ex.InnerException?.Message}");
            }
        }

        // -------------------------------------------------------
        // GET all diagnostic assessments for a subject
        // one per topic, medium difficulty
        // -------------------------------------------------------
        [AbpAllowAnonymous]
        public async Task<GeneratedAssessmentOutput> GetDiagnosticAssessmentsAsync(Guid subjectId)
        {
            try
            {
                var subject = await SubjectRepository.FirstOrDefaultAsync(subjectId)
                    ?? throw new UserFriendlyException("Subject not found.");

                var topics = await TopicRepository.GetAllListAsync(
                    x => x.SubjectId == subjectId && x.IsActive);

                if (!topics.Any())
                    throw new UserFriendlyException("No active topics found for this subject.");

                var allLanguages = await LanguageRepository.GetAllListAsync(
                    x => RequiredLanguageCodes.Contains(x.Code) && x.IsActive);

                var topicIds = topics.Select(x => x.Id).ToList();

                var assessments = await AssessmentRepository.GetAllListAsync(
                    x => topicIds.Contains(x.TopicId) && x.AssessmentType == AssessmentType.Diagnostic);

                if (!assessments.Any())
                    throw new UserFriendlyException("No diagnostic assessments found for this subject. Generate them first.");

                var output = new GeneratedAssessmentOutput();

                foreach (var assessment in assessments.OrderBy(x => x.Title))
                {
                    var topic = topics.First(x => x.Id == assessment.TopicId);

                    var questions = await QuestionRepository.GetAllListAsync(
                        x => x.AssessmentId == assessment.Id && x.IsActive);

                    var questionDtos = new List<QuestionResultDto>();

                    foreach (var question in questions.OrderBy(x => x.SequenceOrder))
                    {
                        var translations = await QuestionTranslationRepository.GetAllListAsync(
                            x => x.QuestionId == question.Id);

                        var translationDtos = translations.Select(t =>
                        {
                            var language = allLanguages.FirstOrDefault(l => l.Id == t.LanguageId);
                            return new QuestionTranslationResultDto
                            {
                                LanguageCode = language?.Code ?? string.Empty,
                                LanguageName = language?.Name ?? string.Empty,
                                QuestionText = t.QuestionText,
                                OptionA = t.OptionA,
                                OptionB = t.OptionB,
                                OptionC = t.OptionC,
                                OptionD = t.OptionD,
                                ExplanationText = t.ExplanationText
                            };
                        }).ToList();

                        questionDtos.Add(new QuestionResultDto
                        {
                            QuestionId = question.Id,
                            QuestionType = question.QuestionType,
                            CorrectAnswer = question.CorrectAnswer,
                            Marks = question.Marks,
                            SequenceOrder = question.SequenceOrder,
                            Translations = translationDtos
                        });
                    }

                    output.Assessments.Add(new AssessmentResultDto
                    {
                        AssessmentId = assessment.Id,
                        TopicId = topic.Id,
                        LessonId = null,
                        Title = assessment.Title,
                        AssessmentType = assessment.AssessmentType,
                        DifficultyLevel = assessment.DifficultyLevel,
                        TotalMarks = assessment.TotalMarks,
                        Questions = questionDtos
                    });
                }

                return output;
            }
            catch (UserFriendlyException) { throw; }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString(), ex);
                throw new UserFriendlyException($"DEBUG: {ex.GetType().Name}: {ex.Message} | {ex.InnerException?.Message}");
            }
        }
    }
}