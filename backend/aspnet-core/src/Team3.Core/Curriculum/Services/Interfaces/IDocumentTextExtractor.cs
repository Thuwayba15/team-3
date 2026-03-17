using System.Threading.Tasks;

namespace Team3.Curriculum.Services.Interfaces;

/// <summary>
/// Extracts text content from documents.
/// </summary>
public interface IDocumentTextExtractor
{
    /// <summary>
    /// Extracts text from the document at the given path.
    /// </summary>
    Task<string> ExtractTextAsync(string filePath);
}