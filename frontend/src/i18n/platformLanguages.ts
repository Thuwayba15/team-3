import platformLanguages from "./platformLanguages.json";

export interface IPlatformLanguageDefinition {
    code: string;
    name: string;
    isDefault: boolean;
}

const DEFAULT_LANGUAGE_CODE = "en";

export const PLATFORM_LANGUAGES: IPlatformLanguageDefinition[] = platformLanguages.map((language) => ({
    code: language.code.trim().toLowerCase(),
    name: language.name,
    isDefault: language.isDefault,
}));

const PLATFORM_LANGUAGE_CODE_SET = new Set(PLATFORM_LANGUAGES.map((language) => language.code));

const FALLBACK_PLATFORM_LANGUAGE_CODE = PLATFORM_LANGUAGES.find((language) => language.isDefault)?.code
    ?? (PLATFORM_LANGUAGE_CODE_SET.has(DEFAULT_LANGUAGE_CODE) ? DEFAULT_LANGUAGE_CODE : PLATFORM_LANGUAGES[0]?.code ?? DEFAULT_LANGUAGE_CODE);

export function normalizePlatformLanguageCode(languageCode: string | null | undefined): string {
    if (!languageCode) {
        return FALLBACK_PLATFORM_LANGUAGE_CODE;
    }

    const normalizedLanguageCode = languageCode.trim().toLowerCase();
    return PLATFORM_LANGUAGE_CODE_SET.has(normalizedLanguageCode)
        ? normalizedLanguageCode
        : FALLBACK_PLATFORM_LANGUAGE_CODE;
}

export function getPlatformLanguageSelectOptions(): Array<{ label: string; value: string }> {
    return PLATFORM_LANGUAGES.map((language) => ({
        label: language.name,
        value: language.code,
    }));
}
