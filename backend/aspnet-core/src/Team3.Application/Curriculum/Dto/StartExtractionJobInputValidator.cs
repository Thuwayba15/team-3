using FluentValidation;
using Team3.Curriculum.Dto;

namespace Team3.Curriculum.Dto;

public class StartExtractionJobInputValidator : AbstractValidator<StartExtractionJobInput>
{
    public StartExtractionJobInputValidator()
    {
        RuleFor(x => x.SourceDocumentId)
            .GreaterThan(0).WithMessage("Source document ID must be greater than 0");
    }
}