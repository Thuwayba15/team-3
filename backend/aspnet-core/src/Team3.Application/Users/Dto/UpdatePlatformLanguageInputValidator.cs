using FluentValidation;

namespace Team3.Users.Dto
{
    /// <summary>
    /// Validates platform language update input.
    /// </summary>
    public class UpdatePlatformLanguageInputValidator : AbstractValidator<UpdatePlatformLanguageInput>
    {
        public UpdatePlatformLanguageInputValidator()
        {
            RuleFor(x => x.PreferredLanguage)
                .NotEmpty()
                .WithMessage("Language code is required.")
                .MaximumLength(64)
                .WithMessage("Language code cannot exceed 64 characters.");
        }
    }
}