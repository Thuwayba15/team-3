using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Team3.Users
{
    /// <summary>
    /// Stores parent or guardian profile data linked to an existing ABP user.
    /// </summary>
    public class ParentProfile : UserProfileBase
    {
        public string? RelationshipNotes { get; private set; }

        protected ParentProfile()
        {
        }

        public ParentProfile(
            long userId,
            string preferredLanguage,
            string? relationshipNotes)
            : base(userId, preferredLanguage)
        {
            RelationshipNotes = relationshipNotes?.Trim();
        }

        /// <summary>
        /// Updates editable parent profile fields.
        /// </summary>
        public void UpdateProfile(string preferredLanguage, string? relationshipNotes)
        {
            SetPreferredLanguage(preferredLanguage);
            RelationshipNotes = relationshipNotes?.Trim();
        }
    }
}
