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
            foreach (var language in GetInitialLanguages())
            {
                AddLanguageIfNotExists(language);
            }
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

        private void AddLanguageIfNotExists(UILanguage language)
        {
            var exists = _context.UILanguages
                .IgnoreQueryFilters()
                .Any(x => x.Code == language.Code);

            if (exists)
            {
                return;
            }

            _context.UILanguages.Add(language);
            _context.SaveChanges();
        }
    }
}