using System;
using FluentValidation;

namespace Team3.Curriculum.Dto;

public class RegisterSourceDocumentInputValidator : AbstractValidator<RegisterSourceDocumentInput>
{
    public RegisterSourceDocumentInputValidator()
    {
        RuleFor(x => x.SubjectName)
            .NotEmpty().WithMessage("Subject name is required")
            .MaximumLength(256).WithMessage("Subject name cannot exceed 256 characters");

        RuleFor(x => x.GradeLevel)
            .NotEmpty().WithMessage("Grade level is required")
            .MaximumLength(64).WithMessage("Grade level cannot exceed 64 characters");

        RuleFor(x => x.SourceUrl)
            .NotEmpty().WithMessage("Source URL is required")
            .MaximumLength(2048).WithMessage("Source URL cannot exceed 2048 characters")
            .Must(BeAbsoluteHttpUrl).WithMessage("Source URL must be an absolute HTTP or HTTPS URL");

        RuleFor(x => x.DocumentType)
            .Equal(Enums.SourceDocumentType.Pdf)
            .WithMessage("Only PDF source documents are supported");

        RuleFor(x => x.OriginalFileName)
            .MaximumLength(256).WithMessage("Original file name cannot exceed 256 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.OriginalFileName));
    }

    private static bool BeAbsoluteHttpUrl(string value)
    {
        if (!Uri.TryCreate(value, UriKind.Absolute, out var uri))
        {
            return false;
        }

        return uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps;
    }
}
