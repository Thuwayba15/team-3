using Abp.Domain.Entities;
using Ardalis.GuardClauses;
using System;

namespace Team3.AI;

/// <summary>
/// Stores a named AI prompt template with its configuration parameters.
/// </summary>
public class AIPromptTemplate : Entity<Guid>
{
    public string Name { get; private set; } = default!;

    public string Purpose { get; private set; } = default!;

    public string TemplateText { get; private set; } = default!;

    public double Temperature { get; private set; }

    protected AIPromptTemplate() { }

    /// <summary>Updates all mutable fields of the template.</summary>
    public void Update(string name, string purpose, string templateText, double temperature)
    {
        Name = Guard.Against.NullOrWhiteSpace(name).Trim();
        Purpose = Guard.Against.NullOrWhiteSpace(purpose).Trim();
        TemplateText = Guard.Against.NullOrWhiteSpace(templateText).Trim();
        Temperature = temperature;
    }

    public AIPromptTemplate(
        Guid id,
        string name,
        string purpose,
        string templateText,
        double temperature)
    {
        Id = id == Guid.Empty ? Guid.NewGuid() : id;
        Name = Guard.Against.NullOrWhiteSpace(name).Trim();
        Purpose = Guard.Against.NullOrWhiteSpace(purpose).Trim();
        TemplateText = Guard.Against.NullOrWhiteSpace(templateText).Trim();
        Temperature = temperature;
    }
}
