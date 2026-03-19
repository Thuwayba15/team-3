using System.Collections.Generic;

namespace Team3.Services.Parents.Dto;

public class AlertDto
{
    public long         Id          { get; set; }
    public string       Type        { get; set; } = default!;     // "warning" | "reminder" | "success" | "info"
    public string       Category    { get; set; } = default!;     // "academic" | "activity" | "system"
    public string       Title       { get; set; } = default!;
    public string       Description { get; set; } = default!;
    public string       When        { get; set; } = default!;
    public bool         IsDismissed { get; set; }
    public List<string> Actions     { get; set; } = new();        // "view" | "dismiss"
}
