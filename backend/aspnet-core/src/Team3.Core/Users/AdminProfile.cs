using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Team3.Users
{
    /// <summary>
    /// Stores administrator-specific profile data linked to an existing ABP user.
    /// </summary>
    public class AdminProfile : UserProfileBase
    {
        public string? Department { get; private set; }

        protected AdminProfile()
        {
        }

        public AdminProfile(
            long userId,
            string preferredLanguage,
            string? department)
            : base(userId, preferredLanguage)
        {
            Department = department?.Trim();
        }

        /// <summary>
        /// Updates editable administrator profile fields.
        /// </summary>
        public void UpdateProfile(string preferredLanguage, string? department)
        {
            SetPreferredLanguage(preferredLanguage);
            Department = department?.Trim();
        }
    }
}
