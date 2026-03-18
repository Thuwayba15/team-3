using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Team3.LearningMaterials.Dto
{
    public class BulkEnrollInput
    {
        public List<Guid> SubjectIds { get; set; } = new();
    }
}
