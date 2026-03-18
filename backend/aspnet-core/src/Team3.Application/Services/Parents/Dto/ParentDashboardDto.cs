using System.Collections.Generic;

namespace Team3.Services.Parents.Dto;

public class ParentDashboardDto
{
    public StudentInfoDto         Child          { get; set; } = default!;
    public DashboardStatsDto      Stats          { get; set; } = default!;
    public List<SubjectSummaryDto> SubjectProgress { get; set; } = new();
    public List<RecentAlertDto>   RecentAlerts   { get; set; } = new();
    public List<RecentActivityDto> RecentActivity { get; set; } = new();
}

public class StudentInfoDto
{
    public string Name       { get; set; } = default!;
    public string GradeLevel { get; set; } = default!;
    public string School     { get; set; } = default!;
    public string Initials   { get; set; } = default!;
}

public class DashboardStatsDto
{
    public int    OverallAverage      { get; set; }
    public int    LessonsCompleted    { get; set; }
    public string TimeSpentThisWeek  { get; set; } = default!;
}

public class SubjectSummaryDto
{
    public string SubjectName { get; set; } = default!;
    public int    Percent     { get; set; }
}

public class RecentAlertDto
{
    public long   Id          { get; set; }
    public string Type        { get; set; } = default!;   // "warning" | "reminder" | "success" | "info"
    public string Title       { get; set; } = default!;
    public string Description { get; set; } = default!;
    public string When        { get; set; } = default!;
}

public class RecentActivityDto
{
    public string  ActivityType { get; set; } = default!;  // "book" | "robot" | "check" | "alert"
    public string  Title        { get; set; } = default!;
    public string  When         { get; set; } = default!;
    public int?    Score        { get; set; }
}
