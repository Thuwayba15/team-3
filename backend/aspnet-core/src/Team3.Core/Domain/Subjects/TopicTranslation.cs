using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Team3.Domain.Subjects
{
    public class TopicTranslation : Entity<Guid>, IEntityTranslation<Topic, Guid>
    {
        public string Title { get; set; }
        public string Summary { get; set; }//Used for AI to get brief context before tutoring

        public string Language { get; set; } // "en", "zu", "st", "af"
        public Topic Core { get; set; }//Subject
        public Guid CoreId { get; set; }//Subject ID
    }
}
