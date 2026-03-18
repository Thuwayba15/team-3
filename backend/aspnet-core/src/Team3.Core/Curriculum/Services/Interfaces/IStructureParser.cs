using System.Collections.Generic;
using System.Threading.Tasks;
using Team3.Curriculum.Entities;
using Team3.Curriculum.Enums;
using Team3.Curriculum.Services.Models;

namespace Team3.Curriculum.Services.Interfaces;

/// <summary>
/// Parses the native structure of a document into ParsedStructureNode entities.
/// </summary>
public interface IStructureParser
{
    /// <summary>
    /// Returns true when the parser can contribute useful structure for the profile.
    /// </summary>
    bool CanParse(DocumentProfile documentProfile, LayoutClassificationResult classificationResult);

    /// <summary>
    /// Parses the document profile into structure nodes plus diagnostics.
    /// </summary>
    Task<StructureParseResult> ParseStructureAsync(DocumentProfile documentProfile, long extractionJobId, LayoutClassificationResult classificationResult);

    /// <summary>
    /// The layout family this parser handles.
    /// </summary>
    LayoutFamilyType SupportedLayoutFamily { get; }

    string ParserName { get; }
}
