namespace Team3.LearningMaterials.Dto;

public class AdminDashboardSummaryDto
{
    public int AdminCount { get; set; }

    public int StudentCount { get; set; }

    public int LifeSciencesTopicCount { get; set; }

    public int LifeSciencesLessonCount { get; set; }

    public bool PromptConfigurationReady { get; set; }
}
