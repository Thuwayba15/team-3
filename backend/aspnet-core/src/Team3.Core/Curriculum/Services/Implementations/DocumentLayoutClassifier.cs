using System.Threading.Tasks;
using Abp.Dependency;
using Team3.Curriculum.Enums;
using Team3.Curriculum.Services.Interfaces;

namespace Team3.Curriculum.Services.Implementations;

/// <summary>
/// Classifies document layout based on keywords in text.
/// </summary>
public class DocumentLayoutClassifier : IDocumentLayoutClassifier, ITransientDependency
{
    public async Task<LayoutFamilyType> ClassifyLayoutAsync(string textContent)
    {
        await Task.Delay(50); // Simulate processing

        var lowerText = textContent.ToLowerInvariant();

        // Check for IT Practical keywords
        if (lowerText.Contains("unit") && lowerText.Contains("guided activity") && lowerText.Contains("consolidation activity"))
        {
            return LayoutFamilyType.ITPractical;
        }

        // Check for Life Sciences keywords
        if (lowerText.Contains("strand") && lowerText.Contains("section") && lowerText.Contains("end-of-topic exercises"))
        {
            return LayoutFamilyType.LifeSciences;
        }

        return LayoutFamilyType.Unknown;
    }
}