namespace Team3.Languages.Dto;

public class CreateLanguageRequest
{
    public string Code { get; set; }
    public string Name { get; set; }
    public string NativeName { get; set; }
    public bool IsDefault { get; set; }
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }
}
