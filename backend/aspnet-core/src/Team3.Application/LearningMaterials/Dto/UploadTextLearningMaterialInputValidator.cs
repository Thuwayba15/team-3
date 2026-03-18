using FluentValidation;

namespace Team3.LearningMaterials.Dto;

public class UploadTextLearningMaterialInputValidator : AbstractValidator<UploadTextLearningMaterialInput>
{
    public UploadTextLearningMaterialInputValidator()
    {
        RuleFor(x => x.SubjectId)
            .NotEmpty();

        RuleFor(x => x.Title)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Content)
            .NotEmpty();

        RuleFor(x => x.Summary)
            .MaximumLength(2000);

        RuleFor(x => x.LearningObjective)
            .MaximumLength(500);

        RuleFor(x => x.RevisionSummary)
            .MaximumLength(1000);

        RuleFor(x => x.SourceLanguageCode)
            .NotEmpty()
            .MaximumLength(10);

        RuleFor(x => x.TopicName)
            .MaximumLength(150);

        RuleFor(x => x.TopicDescription)
            .MaximumLength(1000);

        RuleFor(x => x.GradeLevel)
            .MaximumLength(20);

        RuleFor(x => x.Description)
            .MaximumLength(500);

        RuleFor(x => x.EstimatedMinutes)
            .GreaterThan(0)
            .LessThanOrEqualTo(600);
    }
}
