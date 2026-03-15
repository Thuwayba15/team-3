using System.ComponentModel.DataAnnotations;

namespace Team3.Configuration.Dto;

public class ChangeUiThemeInput
{
    [Required]
    [StringLength(32)]
    public string Theme { get; set; }
}
