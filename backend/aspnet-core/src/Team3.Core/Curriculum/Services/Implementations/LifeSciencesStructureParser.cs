using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Abp.Dependency;
using Team3.Curriculum.Entities;
using Team3.Curriculum.Enums;
using Team3.Curriculum.Services.Interfaces;
using Team3.Curriculum.Services.Models;

namespace Team3.Curriculum.Services.Implementations;

public class LifeSciencesStructureParser : IStructureParser, ITransientDependency
{
    private static readonly Regex NumberedHeadingRegex = new(@"^\d+[\.\)]\s+\S+", RegexOptions.Compiled);

    public LayoutFamilyType SupportedLayoutFamily => LayoutFamilyType.LifeSciences;
    public string ParserName => nameof(LifeSciencesStructureParser);

    public bool CanParse(DocumentProfile documentProfile, LayoutClassificationResult classificationResult)
    {
        return documentProfile.StrandCount > 0 || documentProfile.NumberedHeadingCount > 2 || documentProfile.SectionCount > 0;
    }

    public async Task<StructureParseResult> ParseStructureAsync(DocumentProfile documentProfile, long extractionJobId, LayoutClassificationResult classificationResult)
    {
        await Task.Delay(100);

        var nodes = new List<ParsedStructureNode>();
        var lines = documentProfile.TableOfContentsLines.Any()
            ? documentProfile.TableOfContentsLines
            : documentProfile.NormalizedLines;

        long nextTemporaryId = -1;
        ParsedStructureNode currentStrand = null;
        ParsedStructureNode currentChapter = null;
        int order = 1;
        var warnings = new List<string>();

        foreach (var line in lines)
        {
            var lower = line.ToLowerInvariant();
            if (lower.StartsWith("strand:"))
            {
                currentStrand = CreateNode(ref nextTemporaryId, extractionJobId, null, StructureNodeType.Strand, line, ref order);
                nodes.Add(currentStrand);
            }
            else if (lower.StartsWith("chapter"))
            {
                currentChapter = CreateNode(ref nextTemporaryId, extractionJobId, currentStrand?.Id, StructureNodeType.Chapter, line, ref order);
                nodes.Add(currentChapter);
            }
            else if (NumberedHeadingRegex.IsMatch(line))
            {
                currentChapter = CreateNode(ref nextTemporaryId, extractionJobId, currentStrand?.Id, StructureNodeType.Chapter, line, ref order);
                nodes.Add(currentChapter);
            }
            else if (lower.StartsWith("section"))
            {
                nodes.Add(CreateNode(ref nextTemporaryId, extractionJobId, currentChapter?.Id ?? currentStrand?.Id, StructureNodeType.Section, line, ref order));
            }
            else if (lower.Contains("end-of-topic exercises") || lower.Contains("answers to activities"))
            {
                nodes.Add(CreateNode(ref nextTemporaryId, extractionJobId, currentChapter?.Id ?? currentStrand?.Id, StructureNodeType.EndOfTopicExercises, line, ref order));
            }
            else if (lower.Contains("activity"))
            {
                nodes.Add(CreateNode(ref nextTemporaryId, extractionJobId, currentChapter?.Id ?? currentStrand?.Id, StructureNodeType.Activity, line, ref order));
            }
            else if (lower.StartsWith("appendices") || lower.StartsWith("appendix") || lower.Contains("final word") || lower.Contains("image attribution"))
            {
                nodes.Add(CreateNode(ref nextTemporaryId, extractionJobId, currentChapter?.Id ?? currentStrand?.Id, StructureNodeType.Annexure, line, ref order));
            }
        }

        if (!nodes.Any(n => n.NodeType == StructureNodeType.Chapter))
        {
            warnings.Add("Life Sciences markers were detected, but no chapter-like headings were confirmed.");
        }

        if (documentProfile.TableOfContentsLines.Any() && documentProfile.SectionCount == 0)
        {
            warnings.Add("TOC-based structure was used because body section markers were limited.");
        }

        return new StructureParseResult
        {
            Nodes = nodes,
            ParserName = ParserName,
            Confidence = nodes.Any(n => n.NodeType == StructureNodeType.Chapter) && nodes.Any(n => n.NodeType == StructureNodeType.Strand) ? 0.88 : 0.62,
            Mode = nodes.Any(n => n.NodeType == StructureNodeType.Chapter) ? ExtractionMode.Structured : ExtractionMode.PartiallyStructured,
            Warnings = warnings
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
