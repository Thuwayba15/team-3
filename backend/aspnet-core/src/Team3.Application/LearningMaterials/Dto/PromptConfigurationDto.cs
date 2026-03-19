namespace Team3.LearningMaterials.Dto;

public class PromptConfigurationDto
{
    public string GeneralPrompt { get; set; } = string.Empty;

    public string LifeSciencesPrompt { get; set; } = string.Empty;

    public string ResponseStyle { get; set; } = string.Empty;

    public int MasteryThreshold { get; set; }

    public int RetryLimit { get; set; }
}
