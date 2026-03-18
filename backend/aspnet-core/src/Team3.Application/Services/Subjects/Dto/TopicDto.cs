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
    [AutoMapFrom(typeof(Topic))]
    public class TopicDto : EntityDto<Guid>
    {
        public Guid SubjectId { get; set; }
        public string Title { get; set; }
        public string Summary { get; set; }
        public int SortOrder { get; set; }
    }
}
