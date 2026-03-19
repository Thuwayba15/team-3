using Abp.Domain.Entities.Auditing;
using System;
using Ardalis.GuardClauses;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Team3.Users
{
    /// <summary>
    /// Base profile entity for role-specific user profile records.
    /// </summary>
    public abstract class UserProfileBase : FullAuditedEntity<long>
    {
        public long UserId { get; protected set; }

        public string PreferredLanguage { get; protected set; } = default!;

        protected UserProfileBase()
        {
        }

        protected UserProfileBase(long userId, string preferredLanguage)
        {
            UserId = Guard.Against.NegativeOrZero(userId);
            PreferredLanguage = Guard.Against.NullOrWhiteSpace(preferredLanguage).Trim();
        }

        /// <summary>
        /// Updates the preferred language value.
        /// </summary>
        public void SetPreferredLanguage(string preferredLanguage)
        {
            PreferredLanguage = Guard.Against.NullOrWhiteSpace(preferredLanguage).Trim();
        }
    }
}
