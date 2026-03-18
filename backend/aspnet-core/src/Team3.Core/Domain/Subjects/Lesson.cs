using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Team3.Domain.Subjects
{
    public class Lesson : FullAuditedEntity<Guid>, IMultiLingualEntity<LessonTranslation>
    {
        public Guid TopicId { get; set; }
        public virtual Topic Topic { get; set; }

        public int SortOrder { get; set; }
        public virtual ICollection<LessonMaterial> Materials { get; set; }
        public virtual ICollection<LessonTranslation> Translations { get; set; }
    }
}
