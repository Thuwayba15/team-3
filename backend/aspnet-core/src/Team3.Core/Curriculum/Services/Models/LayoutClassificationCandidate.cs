using Team3.Curriculum.Enums;

namespace Team3.Curriculum.Services.Models;

public class LayoutClassificationCandidate
{
    public LayoutFamilyType Family { get; set; }
    public double Score { get; set; }
    public string Reason { get; set; }
}
