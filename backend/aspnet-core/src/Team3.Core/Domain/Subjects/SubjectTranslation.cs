using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Team3.Domain.Subjects
{
    public class SubjectTranslation : Entity<Guid>, IEntityTranslation<Subject, Guid>
    {
        public string Name { get; set; } // e.g., "Mathematics" or "I-Mathematics"
        public string Description { get; set; }
        public string Language { get; set; } // "en", "zu", "st", "af"
        public Subject Core { get; set; }
        public Guid CoreId { get; set; }
    }
}
