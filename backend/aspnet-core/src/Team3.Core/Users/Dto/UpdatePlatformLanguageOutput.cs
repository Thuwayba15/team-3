namespace Team3.Users.Dto
{
    /// <summary>
    /// Response returned after updating the current user's platform language preference.
    /// </summary>
    public class UpdatePlatformLanguageOutput
    {
        public string PreferredLanguage { get; set; } = default!;
    }
}
