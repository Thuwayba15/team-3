using Abp.Domain.Repositories;
using System;
using System.Linq;
using System.Threading.Tasks;
using Team3.Academic;
using Team3.Configuration;
using Team3.Localization;

#nullable enable

namespace Team3.Application.Localization;

/// <summary>
/// Service for resolving user's preferred language and handling language-aware queries.
/// </summary>
public interface ILanguageResolver
{
    /// <summary>
    /// Gets the current user's preferred language code (lowercase, e.g., 'en', 'zu').
    /// Falls back to 'en' if no preference or invalid language.
    /// </summary>
    Task<string> GetUserPreferredLanguageCodeAsync(long userId);

    /// <summary>
    /// Gets the Language entity for a given language code.
    /// Returns the default language if code not found.
    /// </summary>
    Task<Language> GetOrDefaultLanguageAsync(string languageCode);
}

public class LanguageResolver : ILanguageResolver
{
    private readonly IRepository<Language, Guid> _languageRepository;
    private readonly IRepository<UserLanguagePreference, long> _userLanguagePreferenceRepository;

    public LanguageResolver(
        IRepository<Language, Guid> languageRepository,
        IRepository<UserLanguagePreference, long> userLanguagePreferenceRepository)
    {
        _languageRepository = languageRepository;
        _userLanguagePreferenceRepository = userLanguagePreferenceRepository;
    }

    public async Task<string> GetUserPreferredLanguageCodeAsync(long userId)
    {
        try
        {
            var userPref = await _userLanguagePreferenceRepository.FirstOrDefaultAsync(up => up.UserId == userId);
            
            if (!string.IsNullOrWhiteSpace(userPref?.LanguageCode))
            {
                var lang = await _languageRepository.FirstOrDefaultAsync(
                    l => l.Code == userPref.LanguageCode && l.IsActive);
                
                if (lang != null)
                {
                    return lang.Code;
                }
            }
        }
        catch
        {
            // Fall through to default
        }

        // Fallback to default language or 'en'
        var defaultLang = await _languageRepository.FirstOrDefaultAsync(l => l.IsDefault && l.IsActive);
        return defaultLang?.Code ?? "en";
    }

    public async Task<Language> GetOrDefaultLanguageAsync(string languageCode)
    {
        if (string.IsNullOrWhiteSpace(languageCode))
        {
            return await _languageRepository.FirstOrDefaultAsync(l => l.IsDefault && l.IsActive)
                ?? new Language(Guid.Empty, "en", "English", null);
        }

        var lang = await _languageRepository.FirstOrDefaultAsync(
            l => l.Code == languageCode.ToLowerInvariant() && l.IsActive);

        return lang ?? await _languageRepository.FirstOrDefaultAsync(l => l.IsDefault && l.IsActive)
            ?? new Language(Guid.Empty, "en", "English", null);
    }
}

#nullable disable
