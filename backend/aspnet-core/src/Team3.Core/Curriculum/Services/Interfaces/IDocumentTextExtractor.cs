using System.Threading.Tasks;

namespace Team3.Curriculum.Services.Interfaces;

/// <summary>
/// Extracts text content from documents.
/// </summary>
public interface IDocumentTextExtractor
{
    /// <summary>
    /// Extracts text from the supplied PDF content.
    /// </summary>
    Task<string> ExtractTextAsync(byte[] fileContent, string sourceName);
}
