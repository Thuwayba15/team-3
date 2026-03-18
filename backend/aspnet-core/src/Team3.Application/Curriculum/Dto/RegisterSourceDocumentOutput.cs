using Abp.Application.Services.Dto;
using Team3.Curriculum.Enums;

namespace Team3.Curriculum.Dto;

public class RegisterSourceDocumentOutput : EntityDto<long>
{
    public string SubjectName { get; set; }
    public string GradeLevel { get; set; }
    public SourceDocumentType DocumentType { get; set; }
    public SourceDocumentSourceKind SourceKind { get; set; }
    public string SourceUrl { get; set; }
    public string OriginalFileName { get; set; }
    public string ContentType { get; set; }
    public long? FileSize { get; set; }
}
