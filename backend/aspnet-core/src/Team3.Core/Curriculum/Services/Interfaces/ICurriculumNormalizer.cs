using System.Collections.Generic;
using System.Threading.Tasks;
using Team3.Curriculum.Entities;

namespace Team3.Curriculum.Services.Interfaces;

/// <summary>
/// Normalizes parsed structure nodes into draft curriculum entities.
/// </summary>
public interface ICurriculumNormalizer
{
    /// <summary>
    /// Normalizes the parsed nodes into topic, lesson, quiz drafts.
    /// </summary>
    Task NormalizeAsync(List<ParsedStructureNode> nodes, long extractionJobId);
}