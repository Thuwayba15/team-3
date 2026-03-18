using System.Threading.Tasks;
using Team3.Curriculum.Services.Models;

namespace Team3.Curriculum.Services.Interfaces;

/// <summary>
/// Classifies the layout family of a document based on its text content.
/// </summary>
public interface IDocumentLayoutClassifier
{
    /// <summary>
    /// Determines the most likely layout family from the document profile.
    /// </summary>
    Task<LayoutClassificationResult> ClassifyLayoutAsync(DocumentProfile documentProfile);
}
