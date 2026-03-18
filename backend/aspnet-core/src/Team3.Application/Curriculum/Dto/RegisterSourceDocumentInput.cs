using System.ComponentModel.DataAnnotations;
using Team3.Curriculum.Enums;

namespace Team3.Curriculum.Dto;

public class RegisterSourceDocumentInput
{
    [Required]
    [StringLength(256)]
    public string SubjectName { get; set; }

    [Required]
    [StringLength(64)]
    public string GradeLevel { get; set; }

    public SourceDocumentType DocumentType { get; set; } = SourceDocumentType.Pdf;

    [Required]
    [StringLength(2048)]
    public string SourceUrl { get; set; }

    [StringLength(256)]
    public string OriginalFileName { get; set; }
}
