using Abp.Application.Services.Dto;

namespace Team3.Curriculum.Dto;

public class UploadSourceDocumentOutput : EntityDto<long>
{
    public string SubjectName { get; set; }
    public string GradeLevel { get; set; }
    public string FilePath { get; set; }
    public string OriginalFileName { get; set; }
    public long FileSize { get; set; }
}