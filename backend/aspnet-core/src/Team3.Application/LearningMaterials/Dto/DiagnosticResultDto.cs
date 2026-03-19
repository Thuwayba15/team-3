using System;

namespace Team3.LearningMaterials.Dto;

public class DiagnosticResultDto
{
    public Guid SubjectId { get; set; }

    public Guid TopicId { get; set; }

    public string TopicName { get; set; } = string.Empty;

    public int ScorePercent { get; set; }

    public int CorrectAnswers { get; set; }

    public int TotalQuestions { get; set; }

    public string Recommendation { get; set; } = string.Empty;
}
