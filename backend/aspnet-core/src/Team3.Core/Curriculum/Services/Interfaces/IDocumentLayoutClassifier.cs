using System.Threading.Tasks;
using Team3.Curriculum.Enums;

namespace Team3.Curriculum.Services.Interfaces;

/// <summary>
/// Classifies the layout family of a document based on its text content.
/// </summary>
public interface IDocumentLayoutClassifier
{
    /// <summary>
    /// Determines the layout family from the extracted text.
    /// </summary>
    Task<LayoutFamilyType> ClassifyLayoutAsync(string textContent);
}