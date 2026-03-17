using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Dependency;
using Team3.Curriculum.Entities;
using Team3.Curriculum.Enums;
using Team3.Curriculum.Services.Interfaces;

namespace Team3.Curriculum.Services.Implementations;

/// <summary>
/// Parses Life Sciences textbook structure.
/// </summary>
public class LifeSciencesStructureParser : IStructureParser, ITransientDependency
{
    public LayoutFamilyType SupportedLayoutFamily => LayoutFamilyType.LifeSciences;

    public async Task<List<ParsedStructureNode>> ParseStructureAsync(string textContent, long extractionJobId)
    {
        await Task.Delay(100); // Simulate parsing

        var nodes = new List<ParsedStructureNode>();
        var lines = textContent.Split('\n').Select(l => l.Trim()).Where(l => !string.IsNullOrEmpty(l)).ToArray();

        ParsedStructureNode currentStrand = null;
        ParsedStructureNode currentChapter = null;
        int order = 1;

        foreach (var line in lines)
        {
            if (line.ToLower().StartsWith("strand"))
            {
                currentStrand = new ParsedStructureNode
                {
                    ExtractionJobId = extractionJobId,
                    NodeType = StructureNodeType.Strand,
                    Title = line,
                    Order = order++,
                    Content = line
                };
                nodes.Add(currentStrand);
            }
            else if (line.ToLower().StartsWith("chapter"))
            {
                currentChapter = new ParsedStructureNode
                {
                    ExtractionJobId = extractionJobId,
                    ParentNodeId = currentStrand?.Id,
                    NodeType = StructureNodeType.Chapter,
                    Title = line,
                    Order = order++,
                    Content = line
                };
                nodes.Add(currentChapter);
            }
            else if (line.ToLower().StartsWith("section"))
            {
                nodes.Add(new ParsedStructureNode
                {
                    ExtractionJobId = extractionJobId,
                    ParentNodeId = currentChapter?.Id,
                    NodeType = StructureNodeType.Section,
                    Title = line,
                    Order = order++,
                    Content = line
                });
            }
            else if (line.ToLower().Contains("activity"))
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
            else if (line.ToLower().Contains("end-of-topic exercises"))
            {
                nodes.Add(new ParsedStructureNode
                {
                    ExtractionJobId = extractionJobId,
                    ParentNodeId = currentChapter?.Id,
                    NodeType = StructureNodeType.EndOfTopicExercises,
                    Title = line,
                    Order = order++,
                    Content = line
                });
            }
        }

        return nodes;
    }
}