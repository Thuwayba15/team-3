using System.Collections.Generic;

namespace Team3.Services.Parents.Dto;

public class ChildProgressDto
{
    public StudentInfoDto              Child             { get; set; } = default!;
    public List<SubjectWithTopicsDto>  Subjects          { get; set; } = new();
    public List<TopicMasteryDto>       TopicMastery      { get; set; } = new();
    public List<AssessmentResultDto>   RecentAssessments { get; set; } = new();
    public List<RecentActivityDto>     RecentActivity    { get; set; } = new();
}

public class SubjectWithTopicsDto
{
    public string              SubjectName { get; set; } = default!;
    public int                 Percent     { get; set; }
    public List<TopicProgressDto> Topics   { get; set; } = new();
}

public class TopicProgressDto
{
    public string TopicName { get; set; } = default!;
    public int    Percent   { get; set; }
}

public class TopicMasteryDto
{
    public string TopicName { get; set; } = default!;
    public int    Percent   { get; set; }
}

public class AssessmentResultDto
{
    public string Title     { get; set; } = default!;
    public string TopicName { get; set; } = default!;
    public string When      { get; set; } = default!;
    public int    Score     { get; set; }
}
