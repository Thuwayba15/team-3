using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Team3.Enums;
using Team3.Domain.Assessment;

namespace Team3.Services.Assessments
{
    public class GenerateLessonQuizInput
    {
        public Guid LessonId { get; set; }
        public bool IsPublished { get; set; } = false;
        public DifficultyLevel? DifficultyLevel { get; set; }
    }

    public class GenerateDiagnosticQuizInput
    {
        public Guid SubjectId { get; set; }
        public bool IsPublished { get; set; } = false;
    }

    public class GeneratedAssessmentOutput
    {
        public List<AssessmentResultDto> Assessments { get; set; } = new();
    }

    public class AssessmentResultDto
    {
        public Guid AssessmentId { get; set; }
        public Guid TopicId { get; set; }
        public Guid? LessonId { get; set; }
        public string Title { get; set; }
        public AssessmentType AssessmentType { get; set; }
        public DifficultyLevel DifficultyLevel { get; set; }
        public decimal TotalMarks { get; set; }
        public List<QuestionResultDto> Questions { get; set; } = new();
    }

    public class QuestionResultDto
    {
        public Guid QuestionId { get; set; }
        public QuestionType QuestionType { get; set; }
        public string CorrectAnswer { get; set; }
        public decimal Marks { get; set; }
        public int SequenceOrder { get; set; }
        public List<QuestionTranslationResultDto> Translations { get; set; } = new();
    }

    public class QuestionTranslationResultDto
    {
        public string LanguageCode { get; set; }
        public string LanguageName { get; set; }
        public string QuestionText { get; set; }
        public string OptionA { get; set; }
        public string OptionB { get; set; }
        public string OptionC { get; set; }
        public string OptionD { get; set; }
        public string ExplanationText { get; set; }
    }

    // Internal — used to pass generated data between Gemini and DB save
    public class GeneratedQuestionData
    {
        public QuestionType QuestionType { get; set; }
        public string CorrectAnswer { get; set; }
        public string Explanation { get; set; }
        public decimal Marks { get; set; }
        public int SequenceOrder { get; set; }
        public List<GeneratedTranslationData> Translations { get; set; } = new();
    }

    public class GeneratedTranslationData
    {
        public string LanguageCode { get; set; }
        public string LanguageName { get; set; }
        public Guid LanguageId { get; set; }
        public string QuestionText { get; set; }
        public string OptionA { get; set; }
        public string OptionB { get; set; }
        public string OptionC { get; set; }
        public string OptionD { get; set; }
        public string HintText { get; set; }
        public string ExplanationText { get; set; }
    }
}
