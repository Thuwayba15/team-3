using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Team3.Domain.Subjects
{
    public class Topic : FullAuditedEntity<Guid>, IMultiLingualEntity<TopicTranslation>
    {
        public Guid SubjectId { get; set; }
        public virtual Subject Subject { get; set; }

        public int SortOrder { get; set; } // To ensure topics appear in the correct curriculum order

        public virtual ICollection<Lesson> Lessons { get; set; }
        public virtual ICollection<TopicTranslation> Translations { get; set; }

        protected Topic() { }

        public Topic(Guid subjectId, int sortOrder)
        {
            SubjectId = subjectId;
            SortOrder = sortOrder;
            Lessons = new List<Lesson>();
            Translations = new List<TopicTranslation>();
        }
    }
}
