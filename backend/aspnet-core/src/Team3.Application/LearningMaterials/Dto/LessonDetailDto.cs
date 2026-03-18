using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Team3.Enums;

namespace Team3.LearningMaterials.Dto
{
    public class LessonDetailDto
    {
        public Guid Id { get; set; }
        public Guid TopicId { get; set; }
        public string Title { get; set; }
        public string Summary { get; set; }
        public string LearningObjective { get; set; }
        public string RevisionSummary { get; set; }
        public DifficultyLevel DifficultyLevel { get; set; }
        public int EstimatedMinutes { get; set; }
        public bool IsPublished { get; set; }
        public List<LessonTranslationSummaryDto> Translations { get; set; } = new();
    }
}
