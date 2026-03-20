namespace Team3.Users.Dto
{
    /// <summary>
    /// Input for updating the current authenticated user's platform language preference.
    /// </summary>
    public class UpdatePlatformLanguageInput
    {
        /// <summary>
        /// Language code (e.g., "en", "zu", "st", "af").
        /// </summary>
        public string PreferredLanguage { get; set; } = default!;
    }
}