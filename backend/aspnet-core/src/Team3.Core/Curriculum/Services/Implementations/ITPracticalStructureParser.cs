using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Dependency;
using Team3.Curriculum.Entities;
using Team3.Curriculum.Enums;
using Team3.Curriculum.Services.Interfaces;
using Team3.Curriculum.Services.Models;

namespace Team3.Curriculum.Services.Implementations;

public class ITPracticalStructureParser : IStructureParser, ITransientDependency
{
    public LayoutFamilyType SupportedLayoutFamily => LayoutFamilyType.ITPractical;
    public string ParserName => nameof(ITPracticalStructureParser);

    public bool CanParse(DocumentProfile documentProfile, LayoutClassificationResult classificationResult)
    {
        return documentProfile.UnitCount > 0 || documentProfile.GuidedActivityCount > 0;
    }

    public async Task<StructureParseResult> ParseStructureAsync(DocumentProfile documentProfile, long extractionJobId, LayoutClassificationResult classificationResult)
    {
        await Task.Delay(100);

        var nodes = new List<ParsedStructureNode>();
        var lines = documentProfile.NormalizedLines;
        long nextTemporaryId = -1;

        ParsedStructureNode currentTerm = null;
        ParsedStructureNode currentChapter = null;
        int order = 1;

        foreach (var line in lines)
        {
            var lower = line.ToLowerInvariant();
            if (lower.StartsWith("term"))
            {
                currentTerm = CreateNode(ref nextTemporaryId, extractionJobId, null, StructureNodeType.Term, line, ref order);
                nodes.Add(currentTerm);
            }
            else if (lower.StartsWith("chapter"))
            {
                currentChapter = CreateNode(ref nextTemporaryId, extractionJobId, currentTerm?.Id, StructureNodeType.Chapter, line, ref order);
                nodes.Add(currentChapter);
            }
            else if (lower.StartsWith("unit"))
            {
                nodes.Add(CreateNode(ref nextTemporaryId, extractionJobId, currentChapter?.Id, StructureNodeType.Unit, line, ref order));
            }
            else if (lower.Contains("guided activity"))
            {
                nodes.Add(CreateNode(ref nextTemporaryId, extractionJobId, currentChapter?.Id, StructureNodeType.GuidedActivity, line, ref order));
            }
            else if (lower.Contains("consolidation activity"))
            {
                nodes.Add(CreateNode(ref nextTemporaryId, extractionJobId, currentChapter?.Id, StructureNodeType.ConsolidationActivity, line, ref order));
            }
            else if (lower.Contains("example"))
            {
                nodes.Add(CreateNode(ref nextTemporaryId, extractionJobId, currentChapter?.Id, StructureNodeType.Example, line, ref order));
            }
            else if (lower.Contains("activity"))
            {
                nodes.Add(CreateNode(ref nextTemporaryId, extractionJobId, currentChapter?.Id, StructureNodeType.Activity, line, ref order));
            }
            else if (lower.Contains("annexure"))
            {
                nodes.Add(CreateNode(ref nextTemporaryId, extractionJobId, currentChapter?.Id, StructureNodeType.Annexure, line, ref order));
            }
            else if (lower.Contains("glossary"))
            {
                nodes.Add(CreateNode(ref nextTemporaryId, extractionJobId, currentChapter?.Id, StructureNodeType.Glossary, line, ref order));
            }
        }

        return new StructureParseResult
        {
            Nodes = nodes,
            ParserName = ParserName,
            Confidence = nodes.Any(n => n.NodeType == StructureNodeType.Chapter) ? 0.9 : 0.55,
            Mode = nodes.Any(n => n.NodeType == StructureNodeType.Chapter) ? ExtractionMode.Structured : ExtractionMode.PartiallyStructured,
            Warnings = nodes.Any(n => n.NodeType == StructureNodeType.Chapter)
                ? new List<string>()
                : new List<string> { "IT structure detected, but no chapter headings were found." }
        };
    }

    private static ParsedStructureNode CreateNode(ref long nextTemporaryId, long extractionJobId, long? parentNodeId, StructureNodeType nodeType, string title, ref int order)
    {
        return new ParsedStructureNode
        {
            Id = nextTemporaryId--,
            ExtractionJobId = extractionJobId,
            ParentNodeId = parentNodeId,
            NodeType = nodeType,
            Title = title,
            Order = order++,
            Content = title
        };
    }
}
