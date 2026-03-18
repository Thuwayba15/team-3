using System.IO;
using System.Text;
using System.Threading.Tasks;
using Abp.Dependency;
using Abp.UI;
using Team3.Curriculum.Services.Interfaces;
using UglyToad.PdfPig;

namespace Team3.Curriculum.Services.Implementations;

public class PdfPigDocumentTextExtractor : IDocumentTextExtractor, ITransientDependency
{
    public Task<string> ExtractTextAsync(byte[] fileContent, string sourceName)
    {
        if (fileContent == null || fileContent.Length == 0)
        {
            throw new UserFriendlyException("PDF content is required for text extraction.");
        }

        using var memoryStream = new MemoryStream(fileContent, writable: false);
        using var document = PdfDocument.Open(memoryStream);

        var builder = new StringBuilder();
        foreach (var page in document.GetPages())
        {
            builder.AppendLine(page.Text);
            builder.Append('\f');
        }

        var text = builder.ToString().Trim();
        if (string.IsNullOrWhiteSpace(text))
        {
            throw new UserFriendlyException($"No extractable text was found in '{sourceName}'.");
        }

        return Task.FromResult(text);
    }
}
