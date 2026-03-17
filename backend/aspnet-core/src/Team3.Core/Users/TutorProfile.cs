using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Team3.Users
{
    /// <summary>
    /// Stores tutor-specific profile data linked to an existing ABP user.
    /// </summary>
    public class TutorProfile : UserProfileBase
    {
        public string? Specialization { get; private set; }

        public string? Bio { get; private set; }

        public string? SubjectInterests { get; private set; }

        protected TutorProfile()
        {
        }

        public TutorProfile(
            long userId,
            string preferredLanguage,
            string? specialization,
            string? bio,
            string? subjectInterests)
            : base(userId, preferredLanguage)
        {
            Specialization = specialization?.Trim();
            Bio = bio?.Trim();
            SubjectInterests = subjectInterests?.Trim();
        }

        /// <summary>
        /// Updates editable tutor profile fields.
        /// </summary>
        public void UpdateProfile(
            string preferredLanguage,
            string? specialization,
            string? bio,
            string? subjectInterests)
        {
            SetPreferredLanguage(preferredLanguage);
            Specialization = specialization?.Trim();
            Bio = bio?.Trim();
            SubjectInterests = subjectInterests?.Trim();
        }
    }
}
