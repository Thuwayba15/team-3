using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Team3.LearningMaterials.Dto
{
    public class LessonTranslationSummaryDto
    {
        public string LanguageCode { get; set; }
        public string LanguageName { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string Summary { get; set; }
        public string Examples { get; set; }
        public string RevisionSummary { get; set; }
        public bool IsAutoTranslated { get; set; }
    }
}
