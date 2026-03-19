using Abp.Domain.Entities;
using System;

namespace Team3.Localization
{
    /// <summary>
    /// Represents a row in the custom Languages table used by the platform.
    /// </summary>
    public class PlatformLanguage : Entity<int>
    {
        public string Code { get; set; } = default!;

        public string Name { get; set; } = default!;

        public string? NativeName { get; set; }

        public bool IsActive { get; set; }

        public bool IsDefault { get; set; }

        public int SortOrder { get; set; }

        public DateTime CreationTime { get; set; }

        public long? CreatorUserId { get; set; }

        public DateTime? LastModificationTime { get; set; }

        public bool IsDeleted { get; set; }

        public long? DeleterUserId { get; set; }

        public DateTime? DeletionTime { get; set; }
    }
}