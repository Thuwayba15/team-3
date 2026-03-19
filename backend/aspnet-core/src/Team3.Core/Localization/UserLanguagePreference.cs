using Abp.Domain.Entities.Auditing;
using Ardalis.GuardClauses;

namespace Team3.Localization
{
    /// <summary>
    /// Stores a per-user platform language selection linked to the custom Languages table by code.
    /// </summary>
    public class UserLanguagePreference : FullAuditedEntity<long>
    {
        public long UserId { get; private set; }

        public string LanguageCode { get; private set; } = default!;

        protected UserLanguagePreference()
        {
        }

        public UserLanguagePreference(long userId, string languageCode)
        {
            UserId = Guard.Against.NegativeOrZero(userId);
            LanguageCode = Guard.Against.NullOrWhiteSpace(languageCode).Trim().ToLowerInvariant();
        }

        /// <summary>
        /// Updates the persisted language code.
        /// </summary>
        public void SetLanguageCode(string languageCode)
        {
            LanguageCode = Guard.Against.NullOrWhiteSpace(languageCode).Trim().ToLowerInvariant();
        }
    }
}
