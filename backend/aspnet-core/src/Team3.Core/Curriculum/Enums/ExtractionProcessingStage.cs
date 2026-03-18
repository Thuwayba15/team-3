namespace Team3.Curriculum.Enums;

public enum ExtractionProcessingStage
{
    Registered = 1,
    Fetching = 2,
    ExtractingText = 3,
    ClassifyingLayout = 4,
    ParsingStructure = 5,
    PersistingNodes = 6,
    Completed = 7,
    Failed = 8
}
