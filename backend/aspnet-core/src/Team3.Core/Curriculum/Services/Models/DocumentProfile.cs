using System.Collections.Generic;
using System.Linq;

namespace Team3.Curriculum.Services.Models;

public class DocumentProfile
{
    public string RawText { get; set; }
    public List<string> PageTexts { get; set; } = new();
    public List<string> NormalizedLines { get; set; } = new();
    public List<string> TableOfContentsLines { get; set; } = new();
    public List<string> HeadingCandidates { get; set; } = new();
    public List<string> ChapterHeadingCandidates { get; set; } = new();
    public int StrandCount { get; set; }
    public int TermCount { get; set; }
    public int ChapterKeywordCount { get; set; }
    public int ChapterHeadingCount { get; set; }
    public int SectionCount { get; set; }
    public int UnitCount { get; set; }
    public int ActivityCount { get; set; }
    public int GuidedActivityCount { get; set; }
    public int ConsolidationActivityCount { get; set; }
    public int EndOfTopicExercisesCount { get; set; }
    public int NumberedHeadingCount { get; set; }
    public int AppendixCount { get; set; }
    public bool HasTableOfContents { get; set; }

    public List<string> SampleHeadingCandidates(int take = 5)
    {
        return HeadingCandidates.Take(take).ToList();
    }
}
