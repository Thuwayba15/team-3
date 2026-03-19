using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Team3.Users.Dto
{
    /// <summary>
    /// Validates profile update input.
    /// </summary>
    public class UpdateMyProfileInputValidator : AbstractValidator<UpdateMyProfileInput>
    {
        public UpdateMyProfileInputValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(64);

            RuleFor(x => x.Surname)
                .NotEmpty()
                .MaximumLength(64);

            RuleFor(x => x.PreferredLanguage)
                .NotEmpty()
                .MaximumLength(64);

            RuleFor(x => x.GradeLevel)
                .MaximumLength(32);

            RuleFor(x => x.ProgressLevel)
                .MaximumLength(64);

            RuleFor(x => x.SubjectInterests)
                .MaximumLength(512);

            RuleFor(x => x.Specialization)
                .MaximumLength(128);

            RuleFor(x => x.Bio)
                .MaximumLength(1000);

            RuleFor(x => x.RelationshipNotes)
                .MaximumLength(256);

            RuleFor(x => x.Department)
                .MaximumLength(128);
        }
    }
}
