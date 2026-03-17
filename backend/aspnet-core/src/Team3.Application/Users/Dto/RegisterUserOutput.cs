using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Team3.Users.Dto
{
    /// <summary>
    /// Output returned after a successful registration.
    /// </summary>
    public class RegisterUserOutput
    {
        public long UserId { get; set; }

        public string Name { get; set; } = default!;

        public string Surname { get; set; } = default!;

        public string EmailAddress { get; set; } = default!;

        public string Role { get; set; } = default!;

        public string PreferredLanguage { get; set; } = default!;

        public string? GradeLevel { get; set; }

        public string? ProgressLevel { get; set; }

        public string? SubjectInterests { get; set; }

        public string? Specialization { get; set; }

        public string? Bio { get; set; }

        public string? RelationshipNotes { get; set; }

        public string? Department { get; set; }
    }
}
