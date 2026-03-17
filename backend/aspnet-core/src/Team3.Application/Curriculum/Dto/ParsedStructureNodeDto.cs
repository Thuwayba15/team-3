using Abp.Application.Services.Dto;
using Team3.Curriculum.Enums;

namespace Team3.Curriculum.Dto;

public class ParsedStructureNodeDto : EntityDto<long>
{
    public long ExtractionJobId { get; set; }
    public long? ParentNodeId { get; set; }
    public StructureNodeType NodeType { get; set; }
    public string Title { get; set; }
    public int Order { get; set; }
    public string Content { get; set; }
}