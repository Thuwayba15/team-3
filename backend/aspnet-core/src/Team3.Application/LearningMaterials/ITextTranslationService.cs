using System.Threading.Tasks;

namespace Team3.LearningMaterials;

public interface ITextTranslationService
{
    Task<string> TranslateTextAsync(string text, string sourceLanguageCode, string targetLanguageCode);
    Task<string> SendPromptAsync(string prompt);
}
