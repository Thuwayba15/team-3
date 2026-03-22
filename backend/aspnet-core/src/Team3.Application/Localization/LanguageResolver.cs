using Abp.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Linq;
using System.Threading.Tasks;
using Team3.Academic;
using Team3.Application.Caching;
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
    /// Clears the cached preferred language for a user after it changes.
    /// </summary>
    void InvalidateUserPreferredLanguage(long userId);

    /// <summary>
    /// Gets the Language entity for a given language code.
    /// Returns the default language if code not found.
    /// </summary>
    Task<Language> GetOrDefaultLanguageAsync(string languageCode);
}

public class LanguageResolver : ILanguageResolver
{
    private static readonly TimeSpan PreferredLanguageCacheDuration = TimeSpan.FromMinutes(5);
    private static readonly TimeSpan LanguageLookupCacheDuration = TimeSpan.FromMinutes(10);

    private readonly IRepository<Language, Guid> _languageRepository;
    private readonly IRepository<UserLanguagePreference, long> _userLanguagePreferenceRepository;
    private readonly IMemoryCache _memoryCache;

    public LanguageResolver(
        IRepository<Language, Guid> languageRepository,
        IRepository<UserLanguagePreference, long> userLanguagePreferenceRepository,
        IMemoryCache memoryCache)
    {
        _languageRepository = languageRepository;
        _userLanguagePreferenceRepository = userLanguagePreferenceRepository;
        _memoryCache = memoryCache;
    }

    public async Task<string> GetUserPreferredLanguageCodeAsync(long userId)
    {
        var cacheKey = BuildPreferredLanguageCacheKey(userId);
        if (_memoryCache.TryGetValue(cacheKey, out string? cachedLanguageCode) && !string.IsNullOrWhiteSpace(cachedLanguageCode))
        {
            return cachedLanguageCode;
        }

        var resolvedLanguageCode = await ResolveUserPreferredLanguageCodeAsync(userId);
        _memoryCache.Set(cacheKey, resolvedLanguageCode, MemoryCacheEntryOptionsFactory.Create(PreferredLanguageCacheDuration));
        return resolvedLanguageCode;
    }

    public void InvalidateUserPreferredLanguage(long userId)
    {
        _memoryCache.Remove(BuildPreferredLanguageCacheKey(userId));
    }

    public async Task<Language> GetOrDefaultLanguageAsync(string languageCode)
    {
        var normalizedLanguageCode = string.IsNullOrWhiteSpace(languageCode)
            ? "default"
            : languageCode.Trim().ToLowerInvariant();
        var cacheKey = $"language-resolver:language:{normalizedLanguageCode}";

        if (_memoryCache.TryGetValue(cacheKey, out Language? cachedLanguage) && cachedLanguage != null)
        {
            return cachedLanguage;
        }

        var resolvedLanguage = await ResolveLanguageAsync(languageCode);
        _memoryCache.Set(cacheKey, resolvedLanguage, MemoryCacheEntryOptionsFactory.Create(LanguageLookupCacheDuration));
        return resolvedLanguage;
    }

    private async Task<string> ResolveUserPreferredLanguageCodeAsync(long userId)
    {
        try
        {
            var userPreferenceCode = await _userLanguagePreferenceRepository.GetAll()
                .Where(up => up.UserId == userId)
                .Select(up => up.LanguageCode)
                .FirstOrDefaultAsync();

            if (!string.IsNullOrWhiteSpace(userPreferenceCode))
            {
                var normalizedUserPreferenceCode = userPreferenceCode.Trim().ToLowerInvariant();
                var activeLanguageCode = await _languageRepository.GetAll()
                    .Where(language => language.Code == normalizedUserPreferenceCode && language.IsActive)
                    .Select(language => language.Code)
                    .FirstOrDefaultAsync();

                if (!string.IsNullOrWhiteSpace(activeLanguageCode))
                {
                    return activeLanguageCode;
                }
            }
        }
        catch
        {
            // fall through to default language
        }

        var defaultLanguageCode = await _languageRepository.GetAll()
            .Where(language => language.IsDefault && language.IsActive)
            .Select(language => language.Code)
            .FirstOrDefaultAsync();

        return string.IsNullOrWhiteSpace(defaultLanguageCode) ? "en" : defaultLanguageCode;
    }

    private async Task<Language> ResolveLanguageAsync(string languageCode)
    {
        if (!string.IsNullOrWhiteSpace(languageCode))
        {
            var normalizedLanguageCode = languageCode.Trim().ToLowerInvariant();
            var matchingLanguage = await _languageRepository.FirstOrDefaultAsync(
                language => language.Code == normalizedLanguageCode && language.IsActive);

            if (matchingLanguage != null)
            {
                return matchingLanguage;
            }
        }

        return await _languageRepository.FirstOrDefaultAsync(language => language.IsDefault && language.IsActive)
            ?? new Language(Guid.Empty, "en", "English", null);
    }

    private static string BuildPreferredLanguageCacheKey(long userId)
    {
        return $"language-resolver:user:{userId}";
    }
}

#nullable disable
