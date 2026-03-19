using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Team3.Users.Dto
{
    /// <summary>
    /// Input used to register a new user and create the matching role-specific profile.
    /// </summary>
    public class RegisterUserInput
    {
        public string Name { get; set; } = default!;

        public string Surname { get; set; } = default!;

        public string EmailAddress { get; set; } = default!;

        public string Password { get; set; } = default!;

        public string Role { get; set; } = default!;

        public string PreferredLanguage { get; set; } = "en";

        // Student
        public string? GradeLevel { get; set; }

        public string? ProgressLevel { get; set; }

        // Shared
        public string? SubjectInterests { get; set; }

        // Tutor
        public string? Specialization { get; set; }

        public string? Bio { get; set; }

        // Parent
        public string? RelationshipNotes { get; set; }

        // Admin
        public string? Department { get; set; }
    }
}
