using System;
using System.Collections.Generic;
using System.Linq;
using Team3.Configuration;

namespace Team3.EntityFrameworkCore.Seed.Host;

/// <summary>
/// Seeds the UbuntuLearn domain language records required by learning material translation.
/// </summary>
public class DefaultLearningLanguagesCreator
{
    private readonly Team3DbContext _context;

    private static readonly IReadOnlyList<(string Code, string Name, string NativeName, bool IsDefault, int SortOrder)> RequiredLanguages =
    [
        ("en", "English", "English", true, 0),
        ("zu", "isiZulu", "IsiZulu", false, 1),
        ("st", "Sesotho", "Sesotho", false, 2),
        ("af", "Afrikaans", "Afrikaans", false, 3)
    ];

    public DefaultLearningLanguagesCreator(Team3DbContext context)
    {
        _context = context;
    }

    public void Create()
    {
        foreach (var item in RequiredLanguages)
        {
            var existing = _context.LearningLanguages.FirstOrDefault(x => x.Code == item.Code);
            if (existing is null)
            {
                var language = new Language(
                    Guid.NewGuid(),
                    item.Code,
                    item.Name,
                    item.NativeName,
                    isDefault: item.IsDefault,
                    isActive: true,
                    sortOrder: item.SortOrder);

                _context.LearningLanguages.Add(language);
            }
            else
            {
                existing.Update(item.Name, item.NativeName, isActive: true, sortOrder: item.SortOrder);
                existing.SetDefault(item.IsDefault);
                _context.LearningLanguages.Update(existing);
            }
        }

        _context.SaveChanges();
    }
}
