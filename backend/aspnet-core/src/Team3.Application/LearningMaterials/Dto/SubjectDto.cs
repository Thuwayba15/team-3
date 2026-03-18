using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Team3.LearningMaterials.Dto
{
    public class SubjectDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string GradeLevel { get; set; }
        public bool IsActive { get; set; }
    }
}
