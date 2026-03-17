using System.Collections.Generic;
using System.Threading.Tasks;
using Team3.Curriculum.Entities;
using Team3.Curriculum.Enums;

namespace Team3.Curriculum.Services.Interfaces;

/// <summary>
/// Parses the native structure of a document into ParsedStructureNode entities.
/// </summary>
public interface IStructureParser
{
    /// <summary>
    /// Parses the text content into structure nodes.
    /// </summary>
    Task<List<ParsedStructureNode>> ParseStructureAsync(string textContent, long extractionJobId);

    /// <summary>
    /// The layout family this parser handles.
    /// </summary>
    LayoutFamilyType SupportedLayoutFamily { get; }
}