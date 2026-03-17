using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;
using Microsoft.AspNetCore.Http;
using Team3.Curriculum.Enums;

namespace Team3.Curriculum.Dto;

public class UploadSourceDocumentInput
{
    [Required]
    [StringLength(256)]
    public string SubjectName { get; set; }

    [Required]
    [StringLength(64)]
    public string GradeLevel { get; set; }

    public SourceDocumentType DocumentType { get; set; } = SourceDocumentType.Pdf;

    [Required]
    public IFormFile File { get; set; }
}