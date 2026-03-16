using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Team3.Authorization.Users;

namespace Team3.Users.Dto
{
    /// <summary>
    /// Validates registration input.
    /// </summary>
    public class RegisterUserInputValidator : AbstractValidator<RegisterUserInput>
    {
        public RegisterUserInputValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(64);

            RuleFor(x => x.Surname)
                .NotEmpty()
                .MaximumLength(64);

            RuleFor(x => x.EmailAddress)
                .NotEmpty()
                .EmailAddress()
                .MaximumLength(256);

            RuleFor(x => x.Password)
                .NotEmpty()
                .MinimumLength(8);

            RuleFor(x => x.Role)
                .NotEmpty()
                .Must(BeSupportedRole)
                .WithMessage("Role must be one of: Student, Tutor, Parent, Admin.");

            RuleFor(x => x.PreferredLanguage)
                .NotEmpty()
                .MaximumLength(64);

            RuleFor(x => x.SubjectInterests)
                .MaximumLength(512);

            When(x => x.Role == UserRoleNames.Student, () =>
            {
                RuleFor(x => x.GradeLevel)
                    .NotEmpty()
                    .MaximumLength(32);

                RuleFor(x => x.ProgressLevel)
                    .MaximumLength(64);
            });

            When(x => x.Role == UserRoleNames.Tutor, () =>
            {
                RuleFor(x => x.Specialization)
                    .MaximumLength(128);

                RuleFor(x => x.Bio)
                    .MaximumLength(1000);
            });

            When(x => x.Role == UserRoleNames.Parent, () =>
            {
                RuleFor(x => x.RelationshipNotes)
                    .MaximumLength(256);
            });

            When(x => x.Role == UserRoleNames.Admin, () =>
            {
                RuleFor(x => x.Department)
                    .MaximumLength(128);
            });
        }

        private static bool BeSupportedRole(string role)
        {
            return UserRoleNames.All.Contains(role);
        }
    }
}
