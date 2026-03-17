using FluentValidation;
using Team3.Curriculum.Dto;

namespace Team3.Curriculum.Dto;

public class PublishCurriculumInputValidator : AbstractValidator<PublishCurriculumInput>
{
    public PublishCurriculumInputValidator()
    {
        RuleFor(x => x.ExtractionJobId)
            .GreaterThan(0).WithMessage("Extraction job ID must be greater than 0");
    }
}