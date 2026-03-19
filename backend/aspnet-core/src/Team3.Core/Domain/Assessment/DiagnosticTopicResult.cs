using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Team3.Academic;
using Team3.Enums;

namespace Team3.Domain.Assessment
{
    internal class DiagnosticTopicResult
    {
        public Topic Topic { get; set; }
        public List<GeneratedQuestionData> Questions { get; set; }
    }

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
