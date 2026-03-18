using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Team3.Services.Subjects.Dto
{
    public class LessonDto : EntityDto<Guid>
    {
        public Guid TopicId { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int SortOrder { get; set; }
        public List<LessonMaterialDto> Materials { get; set; }
    }
}
