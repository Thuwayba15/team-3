using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Team3.Domain.Subjects.Enums.Team3.Domain.Subjects;

namespace Team3.Domain.Subjects
{
    public class LessonMaterial : FullAuditedEntity<Guid>
    {
        public Guid LessonId { get; set; }
        public MaterialType Type { get; set; } // Enum: Video, PDF, Quiz, Text
        public string ContentUrl { get; set; } // Maybe YouTube URL
        public string RawBody { get; set; }    // Used if the material is just text
    }
}
