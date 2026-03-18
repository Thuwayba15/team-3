using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Team3.Domain.Subjects.Enums.Team3.Domain.Subjects;

namespace Team3.Services.Subjects.Dto
{
    public class LessonMaterialDto : EntityDto<Guid>
    {
        public MaterialType Type { get; set; }
        public string ContentUrl { get; set; }
        public string RawBody { get; set; }
    }
}
