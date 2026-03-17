using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Dependency;
using Team3.Curriculum.Entities;
using Team3.Curriculum.Enums;
using Team3.Curriculum.Services.Interfaces;

namespace Team3.Curriculum.Services.Implementations;

/// <summary>
/// Parses IT Practical textbook structure.
/// </summary>
public class ITPracticalStructureParser : IStructureParser, ITransientDependency
{
    public LayoutFamilyType SupportedLayoutFamily => LayoutFamilyType.ITPractical;

    public async Task<List<ParsedStructureNode>> ParseStructureAsync(string textContent, long extractionJobId)
    {
        await Task.Delay(100); // Simulate parsing

        var nodes = new List<ParsedStructureNode>();
        var lines = textContent.Split('\n').Select(l => l.Trim()).Where(l => !string.IsNullOrEmpty(l)).ToArray();

        ParsedStructureNode currentTerm = null;
        ParsedStructureNode currentChapter = null;
        int order = 1;

        foreach (var line in lines)
        {
            if (line.ToLower().StartsWith("term"))
            {
                currentTerm = new ParsedStructureNode
                {
                    ExtractionJobId = extractionJobId,
                    NodeType = StructureNodeType.Term,
                    Title = line,
                    Order = order++,
                    Content = line
                };
                nodes.Add(currentTerm);
            }
            else if (line.ToLower().StartsWith("chapter"))
            {
                currentChapter = new ParsedStructureNode
                {
                    ExtractionJobId = extractionJobId,
                    ParentNodeId = currentTerm?.Id,
                    NodeType = StructureNodeType.Chapter,
                    Title = line,
                    Order = order++,
                    Content = line
                };
                nodes.Add(currentChapter);
            }
            else if (line.ToLower().StartsWith("unit"))
            {
                nodes.Add(new ParsedStructureNode
                {
                    ExtractionJobId = extractionJobId,
                    ParentNodeId = currentChapter?.Id,
                    NodeType = StructureNodeType.Unit,
                    Title = line,
                    Order = order++,
                    Content = line
                });
            }
            else if (line.ToLower().Contains("example"))
            {
                nodes.Add(new ParsedStructureNode
                {
                    ExtractionJobId = extractionJobId,
                    ParentNodeId = currentChapter?.Id,
                    NodeType = StructureNodeType.Example,
                    Title = line,
                    Order = order++,
                    Content = line
                });
            }
            else if (line.ToLower().Contains("guided activity"))
            {
                nodes.Add(new ParsedStructureNode
                {
                    ExtractionJobId = extractionJobId,
                    ParentNodeId = currentChapter?.Id,
                    NodeType = StructureNodeType.GuidedActivity,
                    Title = line,
                    Order = order++,
                    Content = line
                });
            }
            else if (line.ToLower().Contains("activity") && !line.ToLower().Contains("consolidation"))
            {
                nodes.Add(new ParsedStructureNode
                {
                    ExtractionJobId = extractionJobId,
                    ParentNodeId = currentChapter?.Id,
                    NodeType = StructureNodeType.Activity,
                    Title = line,
                    Order = order++,
                    Content = line
                });
            }
            else if (line.ToLower().Contains("consolidation activity"))
            {
                nodes.Add(new ParsedStructureNode
                {
                    ExtractionJobId = extractionJobId,
                    ParentNodeId = currentChapter?.Id,
                    NodeType = StructureNodeType.ConsolidationActivity,
                    Title = line,
                    Order = order++,
                    Content = line
                });
            }
            else if (line.ToLower().Contains("annexure"))
            {
                nodes.Add(new ParsedStructureNode
                {
                    ExtractionJobId = extractionJobId,
                    ParentNodeId = currentChapter?.Id,
                    NodeType = StructureNodeType.Annexure,
                    Title = line,
                    Order = order++,
                    Content = line
                });
            }
            else if (line.ToLower().Contains("glossary"))
            {
                nodes.Add(new ParsedStructureNode
                {
                    ExtractionJobId = extractionJobId,
                    ParentNodeId = currentChapter?.Id,
                    NodeType = StructureNodeType.Glossary,
                    Title = line,
                    Order = order++,
                    Content = line
                });
            }
        }

        return nodes;
    }
}