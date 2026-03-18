using System.Linq;
using System.Threading.Tasks;
using Abp.Dependency;
using Team3.Curriculum.Enums;
using Team3.Curriculum.Services.Interfaces;
using Team3.Curriculum.Services.Models;

namespace Team3.Curriculum.Services.Implementations;

/// <summary>
/// Classifies document layout based on keywords in text.
/// </summary>
public class DocumentLayoutClassifier : IDocumentLayoutClassifier, ITransientDependency
{
    public async Task<LayoutClassificationResult> ClassifyLayoutAsync(DocumentProfile documentProfile)
    {
        await Task.Delay(50); // Simulate processing

        var result = new LayoutClassificationResult();

        var itScore = 0d;
        if (documentProfile.TermCount > 0) itScore += 0.15;
        if (documentProfile.ChapterKeywordCount > 0) itScore += 0.10;
        if (documentProfile.UnitCount > 1) itScore += 0.30;
        if (documentProfile.GuidedActivityCount > 0) itScore += 0.25;
        if (documentProfile.ConsolidationActivityCount > 0) itScore += 0.20;

        var lifeSciencesScore = 0d;
        if (documentProfile.StrandCount > 0) lifeSciencesScore += 0.35;
        if (documentProfile.SectionCount > 0) lifeSciencesScore += 0.10;
        if (documentProfile.EndOfTopicExercisesCount > 0) lifeSciencesScore += 0.20;
        if (documentProfile.NumberedHeadingCount > 2) lifeSciencesScore += 0.20;
        if (documentProfile.HasTableOfContents) lifeSciencesScore += 0.10;
        if (documentProfile.AppendixCount > 0) lifeSciencesScore += 0.05;

        var genericScore = 0d;
        if (documentProfile.ChapterHeadingCount > 1) genericScore += 0.30;
        if (documentProfile.NumberedHeadingCount > 2) genericScore += 0.45;
        if (documentProfile.HasTableOfContents) genericScore += 0.20;
        if (documentProfile.AppendixCount > 0) genericScore += 0.10;
        if (documentProfile.HeadingCandidates.Count > 3) genericScore += 0.15;

        AddCandidate(result, LayoutFamilyType.ITPractical, itScore, "term/unit/activity markers");
        AddCandidate(result, LayoutFamilyType.LifeSciences, lifeSciencesScore, "strand/numbered-heading/toc markers");
        AddCandidate(result, LayoutFamilyType.Unknown, genericScore, "generic numbered-outline markers");

        if (!result.CandidateFamilies.Any())
        {
            result.BestMatch = LayoutFamilyType.Unknown;
            result.Confidence = 0;
            result.ReasonCodes.Add("No recognizable layout markers were found.");
            return result;
        }

        var best = result.CandidateFamilies.OrderByDescending(c => c.Score).First();
        result.BestMatch = best.Family == LayoutFamilyType.Unknown && best.Score < 0.35
            ? LayoutFamilyType.Unknown
            : best.Family;
        result.Confidence = best.Score;
        result.ReasonCodes = result.CandidateFamilies.Select(c => $"{c.Family}:{c.Score:F2}").ToList();
        return result;
    }

    private static void AddCandidate(LayoutClassificationResult result, LayoutFamilyType family, double score, string reason)
    {
        if (score <= 0)
        {
            return;
        }

        result.CandidateFamilies.Add(new LayoutClassificationCandidate
        {
            Family = family,
            Score = score > 1 ? 1 : score,
            Reason = reason
        });
    }
}
