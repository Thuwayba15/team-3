using FluentValidation;
using Team3.Curriculum.Dto;

namespace Team3.Curriculum.Dto;

public class UploadSourceDocumentInputValidator : AbstractValidator<UploadSourceDocumentInput>
{
    public UploadSourceDocumentInputValidator()
    {
        RuleFor(x => x.SubjectName)
            .NotEmpty().WithMessage("Subject name is required")
            .MaximumLength(256).WithMessage("Subject name cannot exceed 256 characters");

        RuleFor(x => x.GradeLevel)
            .NotEmpty().WithMessage("Grade level is required")
            .MaximumLength(64).WithMessage("Grade level cannot exceed 64 characters");

        RuleFor(x => x.File)
            .NotNull().WithMessage("File is required")
            .Must(file => file.Length > 0).WithMessage("File cannot be empty")
            .Must(file => file.FileName.EndsWith(".pdf", System.StringComparison.OrdinalIgnoreCase))
            .WithMessage("Only PDF files are supported");
    }
}