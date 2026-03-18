using System.Collections.Generic;
using Team3.Curriculum.Entities;
using Team3.Curriculum.Enums;

namespace Team3.Curriculum.Services.Models;

public class StructureParseResult
{
    public List<ParsedStructureNode> Nodes { get; set; } = new();
    public string ParserName { get; set; }
    public double Confidence { get; set; }
    public ExtractionMode Mode { get; set; } = ExtractionMode.Unstructured;
    public List<string> Warnings { get; set; } = new();
}
