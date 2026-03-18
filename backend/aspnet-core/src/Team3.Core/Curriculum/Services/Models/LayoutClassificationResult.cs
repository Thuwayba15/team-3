using System.Collections.Generic;
using System.Linq;
using Team3.Curriculum.Enums;

namespace Team3.Curriculum.Services.Models;

public class LayoutClassificationResult
{
    public LayoutFamilyType BestMatch { get; set; }
    public double Confidence { get; set; }
    public List<LayoutClassificationCandidate> CandidateFamilies { get; set; } = new();
    public List<string> ReasonCodes { get; set; } = new();

    public bool IsLowConfidence(double threshold = 0.55)
    {
        return Confidence < threshold;
    }

    public string ToSummary()
    {
        return string.Join("; ", CandidateFamilies.Select(c => $"{c.Family}:{c.Score:F2} ({c.Reason})"));
    }
}
