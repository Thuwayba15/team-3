using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Team3.Domain.Subjects;

namespace Team3.Services.Subjects.Dto
{
    [AutoMapFrom(typeof(Subject))]
    public class SubjectDto : EntityDto<Guid>
    {
        public string SubjectCode { get; set; }
        public string Name { get; set; } // This will be auto-filled by the translation
        public string Description { get; set; }
    }
}
