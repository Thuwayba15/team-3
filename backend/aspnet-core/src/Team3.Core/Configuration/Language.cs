using Abp.Domain.Entities.Auditing;
using Ardalis.GuardClauses;
using System;

#nullable enable

namespace Team3.Configuration;

public class Language : FullAuditedEntity<Guid>
{
    public string Code { get; private set; } = default!;

    public string Name { get; private set; } = default!;

    public string? NativeName { get; private set; }

    public bool IsActive { get; private set; } = true;

    public bool IsDefault { get; private set; }

    public int SortOrder { get; private set; }

    protected Language()
    {
    }

    public Language(
        Guid id,
        string code,
        string name,
        string? nativeName,
        bool isDefault = false,
        bool isActive = true,
        int sortOrder = 0)
    {
        Id = id == Guid.Empty ? Guid.NewGuid() : id;
        Code = Guard.Against.NullOrWhiteSpace(code).Trim().ToLowerInvariant();
        Name = Guard.Against.NullOrWhiteSpace(name).Trim();
        NativeName = nativeName?.Trim();
        IsDefault = isDefault;
        IsActive = isActive;
        SortOrder = sortOrder;
    }

    public void Update(string name, string? nativeName, bool isActive, int sortOrder)
    {
        Name = Guard.Against.NullOrWhiteSpace(name).Trim();
        NativeName = nativeName?.Trim();
        IsActive = isActive;
        SortOrder = sortOrder;
    }

    public void SetDefault(bool isDefault)
    {
        IsDefault = isDefault;
    }
}

#nullable disable
