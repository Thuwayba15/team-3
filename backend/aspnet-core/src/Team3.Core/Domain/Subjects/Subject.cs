using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Team3.Domain.Subjects
{
    public class Subject : FullAuditedEntity<Guid>, IMultiLingualEntity<SubjectTranslation>
    {
        public string SubjectCode { get; set; } // e.g., "MATH-G12"
        public virtual ICollection<Topic> Topics { get; set; }
        public virtual ICollection<SubjectTranslation> Translations { get; set; }
    }
}
