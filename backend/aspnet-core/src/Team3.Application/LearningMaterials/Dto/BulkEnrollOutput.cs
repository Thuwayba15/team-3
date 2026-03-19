using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Team3.LearningMaterials.Dto
{
    public class BulkEnrollOutput
    {
        public List<Guid> EnrolledSubjectIds { get; set; } = new();
        public List<Guid> AlreadyEnrolledSubjectIds { get; set; } = new();
        public List<Guid> NotFoundSubjectIds { get; set; } = new();
    }
}
