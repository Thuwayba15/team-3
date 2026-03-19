using System.ComponentModel.DataAnnotations;

namespace Team3.Services.Parents.Dto;

public class LinkChildInput
{
    /// <summary>The student's username or email address.</summary>
    [Required]
    public string UsernameOrEmail { get; set; } = default!;
}

public class RegisterChildInput
{
    [Required]
    [StringLength(64)]
    public string Name { get; set; } = default!;

    [Required]
    [StringLength(64)]
    public string Surname { get; set; } = default!;

    [Required]
    [StringLength(256)]
    [EmailAddress]
    public string EmailAddress { get; set; } = default!;

    [Required]
    [StringLength(256)]
    public string UserName { get; set; } = default!;

    [Required]
    [StringLength(128)]
    public string Password { get; set; } = default!;
}

public class ChildLinkResultDto
{
    public long StudentUserId   { get; set; }
    public string StudentName   { get; set; } = default!;
    public string GradeLevel    { get; set; } = default!;
    public string Relationship  { get; set; } = default!;
    public string Initials      { get; set; } = default!;
}
