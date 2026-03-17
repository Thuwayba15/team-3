using Abp.Domain.Entities;
using System.ComponentModel.DataAnnotations;
using Team3.Curriculum.Enums;

namespace Team3.Curriculum.Entities;

/// <summary>
/// Represents a parsed node from the native textbook structure.
/// </summary>
public class ParsedStructureNode : Entity<long>
{
    public long ExtractionJobId { get; set; }

    public long? ParentNodeId { get; set; }

    public StructureNodeType NodeType { get; set; }

    [Required]
    [StringLength(512)]
    public string Title { get; set; }

    public int Order { get; set; }

    [StringLength(4000)]
    public string Content { get; set; }

    // Navigation
    public virtual CurriculumExtractionJob ExtractionJob { get; set; }
    public virtual ParsedStructureNode ParentNode { get; set; }
}