using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using Team3.Localization;

namespace Team3.EntityFrameworkCore.Seed.Host
{
    /// <summary>
    /// Seeds supported platform UI languages.
    /// </summary>
    public class InitialUILanguagesBuilder
    {
        private readonly Team3DbContext _context;

        public InitialUILanguagesBuilder(Team3DbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Ensures the default platform language set exists.
        /// </summary>
        public void Create()
        {
            var initialLanguages = GetInitialLanguages();
            var existingByCode = _context.UILanguages
                .IgnoreQueryFilters()
                .ToDictionary(x => x.Code);

            foreach (var language in initialLanguages)
            {
                if (!existingByCode.TryGetValue(language.Code, out var existingLanguage))
                {
                    _context.UILanguages.Add(language);
                    continue;
                }

                existingLanguage.Update(language.Name, language.IsActive, language.IsDefault);
            }

            _context.SaveChanges();
        }

        private static IReadOnlyList<UILanguage> GetInitialLanguages()
        {
            return new List<UILanguage>
            {
                new UILanguage("en", "English", isActive: true, isDefault: true),
                new UILanguage("zu", "isiZulu", isActive: true, isDefault: false),
                new UILanguage("st", "Sesotho", isActive: true, isDefault: false),
                new UILanguage("af", "Afrikaans", isActive: true, isDefault: false)
            };
        }

    }
}