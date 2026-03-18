using Abp.Domain.Entities.Auditing;
using Ardalis.GuardClauses;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Team3.Localization
{
    /// <summary>
    /// Represents a supported platform UI language option.
    /// </summary>
    [Table("AppUILanguages")]
    [Index(nameof(Code), IsUnique = true)]
    public class UILanguage : FullAuditedEntity<int>
    {
        [Required]
        [MaxLength(16)]
        public string Code { get; private set; } = default!;

        [Required]
        [MaxLength(64)]
        public string Name { get; private set; } = default!;

        public bool IsActive { get; private set; }

        public bool IsDefault { get; private set; }

        protected UILanguage()
        {
        }

        public UILanguage(string code, string name, bool isActive, bool isDefault)
        {
            Code = Guard.Against.NullOrWhiteSpace(code).Trim().ToLowerInvariant();
            Name = Guard.Against.NullOrWhiteSpace(name).Trim();
            IsActive = isActive;
            IsDefault = isDefault;
        }

        /// <summary>
        /// Updates mutable fields while preserving core validation rules.
        /// </summary>
        public void Update(string name, bool isActive, bool isDefault)
        {
            Name = Guard.Against.NullOrWhiteSpace(name).Trim();
            IsActive = isActive;
            IsDefault = isDefault;
        }

        /// <summary>
        /// Updates the language display name.
        /// </summary>
        public void SetName(string name)
        {
            Name = Guard.Against.NullOrWhiteSpace(name).Trim();
        }

        /// <summary>
        /// Marks the language as active or inactive.
        /// </summary>
        public void SetIsActive(bool isActive)
        {
            IsActive = isActive;
        }

        /// <summary>
        /// Marks whether this language is the default platform language.
        /// </summary>
        public void SetIsDefault(bool isDefault)
        {
            IsDefault = isDefault;
        }
    }
}