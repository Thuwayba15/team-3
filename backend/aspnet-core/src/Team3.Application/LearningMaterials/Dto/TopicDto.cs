using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Team3.Enums;

namespace Team3.LearningMaterials.Dto
{
    public class TopicDto
    {
        public Guid Id { get; set; }
        public Guid SubjectId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DifficultyLevel DifficultyLevel { get; set; }
        public int SequenceOrder { get; set; }
        public bool IsActive { get; set; }
    }
}
