namespace Team3.Users.Dto
{
    /// <summary>
    /// Represents a frontend-facing language option for platform UI selection.
    /// </summary>
    public class PlatformLanguageOptionDto
    {
        public string Code { get; set; } = default!;

        public string Name { get; set; } = default!;

        public bool IsDefault { get; set; }
    }
}
