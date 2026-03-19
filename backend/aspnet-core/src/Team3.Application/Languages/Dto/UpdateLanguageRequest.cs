namespace Team3.Languages.Dto;

public class UpdateLanguageRequest
{
    public string Name { get; set; }
    public string NativeName { get; set; }
    public bool IsActive { get; set; }
    public bool IsDefault { get; set; }
    public int SortOrder { get; set; }
}
