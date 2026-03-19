using Ardalis.GuardClauses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Team3.Users
{
    /// <summary>
    /// Stores student-specific profile data linked to an existing ABP user.
    /// </summary>
    public class StudentProfile : UserProfileBase
    {
        public string GradeLevel { get; private set; } = default!;

        public string? ProgressLevel { get; private set; }

        public string? SubjectInterests { get; private set; }

        protected StudentProfile()
        {
        }

        public StudentProfile(
            long userId,
            string preferredLanguage,
            string gradeLevel,
            string? progressLevel,
            string? subjectInterests)
            : base(userId, preferredLanguage)
        {
            GradeLevel = Guard.Against.NullOrWhiteSpace(gradeLevel).Trim();
            ProgressLevel = progressLevel?.Trim();
            SubjectInterests = subjectInterests?.Trim();
        }

        /// <summary>
        /// Updates editable student profile fields.
        /// </summary>
        public void UpdateProfile(
            string preferredLanguage,
            string gradeLevel,
            string? progressLevel,
            string? subjectInterests)
        {
            SetPreferredLanguage(preferredLanguage);
            GradeLevel = Guard.Against.NullOrWhiteSpace(gradeLevel).Trim();
            ProgressLevel = progressLevel?.Trim();
            SubjectInterests = subjectInterests?.Trim();
        }
    }
}
