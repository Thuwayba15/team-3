using System.ComponentModel.DataAnnotations;

namespace Team3.Users.Dto;

public class ChangeUserLanguageDto
{
    [Required]
    public string LanguageName { get; set; }
}