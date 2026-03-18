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

public class GenericNumberedOutlineParser : IStructureParser, ITransientDependency
{
    private static readonly Regex ChapterHeadingRegex = new(@"^chapter\s*(\d+)\b", RegexOptions.Compiled | RegexOptions.IgnoreCase);
    private static readonly Regex SubsectionHeadingRegex = new(@"^(?<marker>\d+\.\d+(?:\.\d+)*)\s+(?<title>.+)$", RegexOptions.Compiled);
    private static readonly Regex InlineSubsectionMarkerRegex = new(@"\b\d+\.\d+(?:\.\d+)?\b", RegexOptions.Compiled);
    private static readonly Regex ActivityHeadingRegex = new(@"^(activity\s*\d+(?:\s*[-–]\s*\d+)?|activity|end of chapter activity|end-of-chapter activity|end of topic exercises)\b", RegexOptions.Compiled | RegexOptions.IgnoreCase);
    private static readonly Regex WorkedExampleHeadingRegex = new(@"^(worked example|example)\b", RegexOptions.Compiled | RegexOptions.IgnoreCase);
    private static readonly Regex AnnexureHeadingRegex = new(@"^(appendices|appendix)\b|answers to activities|image attribution|list of definitions|final word", RegexOptions.Compiled | RegexOptions.IgnoreCase);
    private static readonly Regex TrailingPageNumberRegex = new(@"\s+\d{1,4}\s*$", RegexOptions.Compiled);
    private static readonly Regex MultiDotLeaderRegex = new(@"\.{3,}", RegexOptions.Compiled);
    private static readonly Regex WhitespaceRegex = new(@"\s+", RegexOptions.Compiled);
    private static readonly Regex MidwordHyphenRegex = new(@"(?<=\p{L})-(?=\p{L})", RegexOptions.Compiled);
    private static readonly Regex ChapterRepairRegex = new(@"(?i)\bchapter\s*(\d+)", RegexOptions.Compiled);
    private static readonly Regex MarkerRepairRegex = new(@"(?<=\D)(\d+\.\d+(?:\.\d+)?)(?=[A-Za-z])", RegexOptions.Compiled);
    private static readonly Regex DigitLetterRegex = new(@"(?<=\d)(?=[A-Za-z])", RegexOptions.Compiled);

    public LayoutFamilyType SupportedLayoutFamily => LayoutFamilyType.Unknown;
    public string ParserName => nameof(GenericNumberedOutlineParser);

    public bool CanParse(DocumentProfile documentProfile, LayoutClassificationResult classificationResult)
    {
        return documentProfile.ChapterHeadingCount > 0 ||
               documentProfile.NumberedHeadingCount > 1 ||
               documentProfile.AppendixCount > 0 ||
               documentProfile.HeadingCandidates.Count > 2;
    }

    public async Task<StructureParseResult> ParseStructureAsync(DocumentProfile documentProfile, long extractionJobId, LayoutClassificationResult classificationResult)
    {
        await Task.Delay(50);

        var nodes = new List<ParsedStructureNode>();
        var chapterIndex = new Dictionary<string, ParsedStructureNode>();
        long nextTemporaryId = -1;
        int order = 1;

        ParsedStructureNode currentChapter = null;
        ParsedStructureNode currentLesson = null;
        ParsedStructureNode currentContentNode = null;

        int chapterCount = 0;
        int inferredLessonCount = 0;
        int attachedMaterialCount = 0;
        int attachedActivityCount = 0;

        foreach (var sourceLine in documentProfile.NormalizedLines)
        {
            var line = NormalizeStructureText(sourceLine);
            if (string.IsNullOrWhiteSpace(line) || IsProbableTableOfContentsLine(line))
            {
                continue;
            }

            if (TryBuildChapterNode(line, extractionJobId, ref nextTemporaryId, ref order, out var chapterNode))
            {
                FlushCurrentContentNode(currentContentNode);
                currentContentNode = null;
                currentLesson = null;

                var chapterKey = chapterNode.Title.ToLowerInvariant();
                if (chapterIndex.TryGetValue(chapterKey, out var existingChapter))
                {
                    currentChapter = existingChapter;
                }
                else
                {
                    currentChapter = chapterNode;
                    chapterIndex[chapterKey] = currentChapter;
                    nodes.Add(currentChapter);
                    chapterCount++;
                }

                continue;
            }

            if (TryBuildLessonNode(line, extractionJobId, currentChapter?.Id, ref nextTemporaryId, ref order, out var lessonNode))
            {
                if (currentChapter == null)
                {
                    continue;
                }

                FlushCurrentContentNode(currentContentNode);
                currentContentNode = null;
                currentLesson = lessonNode;
                nodes.Add(currentLesson);
                inferredLessonCount++;
                continue;
            }

            if (TryBuildExplicitContentNode(line, extractionJobId, currentLesson?.Id ?? currentChapter?.Id, ref nextTemporaryId, ref order, out var contentNode))
            {
                if (currentChapter == null)
                {
                    continue;
                }

                FlushCurrentContentNode(currentContentNode);
                currentContentNode = contentNode;
                nodes.Add(currentContentNode);

                if (currentContentNode.NodeType == StructureNodeType.Activity ||
                    currentContentNode.NodeType == StructureNodeType.ConsolidationActivity ||
                    currentContentNode.NodeType == StructureNodeType.EndOfTopicExercises)
                {
                    attachedActivityCount++;
                }
                else
                {
                    attachedMaterialCount++;
                }

                continue;
            }

            AppendNarrativeLine(currentContentNode, currentLesson, currentChapter, line);
        }

        FlushCurrentContentNode(currentContentNode);

        var warnings = new List<string>();
        if (chapterCount > 0)
        {
            warnings.Add($"Generic textbook parser extracted {chapterCount} chapter nodes, {inferredLessonCount} inferred lesson nodes, {attachedMaterialCount} material nodes and {attachedActivityCount} activity nodes.");
        }

        if (inferredLessonCount == 0 && chapterCount > 0)
        {
            warnings.Add("Chapter-only textbook structure detected; lesson rows may need to be synthesized downstream.");
        }

        return new StructureParseResult
        {
            Nodes = nodes,
            ParserName = ParserName,
            Confidence = inferredLessonCount > 0 ? 0.78 : chapterCount > 0 ? 0.58 : 0.30,
            Mode = inferredLessonCount > 0 ? ExtractionMode.Structured : nodes.Any() ? ExtractionMode.PartiallyStructured : ExtractionMode.Unstructured,
            Warnings = nodes.Any()
                ? warnings.Concat(new[] { "Generic numbered-outline fallback parser was used." }).Distinct().ToList()
                : new List<string> { "No reliable outline could be extracted from the document profile." }
        };
    }

    private static bool TryBuildChapterNode(string line, long extractionJobId, ref long nextTemporaryId, ref int order, out ParsedStructureNode node)
    {
        node = null;

        var match = ChapterHeadingRegex.Match(line);
        if (!match.Success)
        {
            return false;
        }

        var chapterNumber = match.Groups[1].Value;
        var remainder = line[match.Length..].Trim(' ', ':', '-', '.');
        remainder = TrimTrailingSectionNoise(remainder);

        var cleanedTitle = string.IsNullOrWhiteSpace(remainder)
            ? $"Chapter {chapterNumber}"
            : $"Chapter {chapterNumber}: {remainder}";

        node = CreateNode(ref nextTemporaryId, extractionJobId, null, StructureNodeType.Chapter, cleanedTitle, ref order, cleanedTitle);
        return true;
    }

    private static bool TryBuildLessonNode(string line, long extractionJobId, long? parentNodeId, ref long nextTemporaryId, ref int order, out ParsedStructureNode node)
    {
        node = null;
        if (!parentNodeId.HasValue)
        {
            return false;
        }

        var match = SubsectionHeadingRegex.Match(line);
        if (!match.Success)
        {
            return false;
        }

        var marker = match.Groups["marker"].Value;
        var title = TrimTrailingSectionNoise(match.Groups["title"].Value);
        var cleanedTitle = string.IsNullOrWhiteSpace(title) ? marker : $"{marker} {title}";

        node = CreateNode(ref nextTemporaryId, extractionJobId, parentNodeId, StructureNodeType.Section, cleanedTitle, ref order, cleanedTitle);
        return true;
    }

    private static bool TryBuildExplicitContentNode(string line, long extractionJobId, long? parentNodeId, ref long nextTemporaryId, ref int order, out ParsedStructureNode node)
    {
        node = null;
        if (!parentNodeId.HasValue)
        {
            return false;
        }

        var lower = line.ToLowerInvariant();
        if (WorkedExampleHeadingRegex.IsMatch(line))
        {
            node = CreateNode(ref nextTemporaryId, extractionJobId, parentNodeId, StructureNodeType.Example, TrimTrailingSectionNoise(line), ref order, line);
            return true;
        }

        if (ActivityHeadingRegex.IsMatch(line))
        {
            var nodeType = lower.Contains("end of topic exercises")
                ? StructureNodeType.EndOfTopicExercises
                : lower.Contains("end of chapter activity") || lower.Contains("end-of-chapter activity")
                    ? StructureNodeType.ConsolidationActivity
                    : StructureNodeType.Activity;

            node = CreateNode(ref nextTemporaryId, extractionJobId, parentNodeId, nodeType, TrimTrailingSectionNoise(line), ref order, line);
            return true;
        }

        if (AnnexureHeadingRegex.IsMatch(line))
        {
            node = CreateNode(ref nextTemporaryId, extractionJobId, parentNodeId, StructureNodeType.Annexure, TrimTrailingSectionNoise(line), ref order, line);
            return true;
        }

        return false;
    }

    private static void AppendNarrativeLine(ParsedStructureNode currentContentNode, ParsedStructureNode currentLesson, ParsedStructureNode currentChapter, string line)
    {
        if (currentContentNode != null)
        {
            currentContentNode.Content = AppendContent(currentContentNode.Content, line);
            return;
        }

        if (currentLesson != null)
        {
            currentLesson.Content = AppendContent(currentLesson.Content, line);
            return;
        }

        if (currentChapter != null)
        {
            currentChapter.Content = AppendContent(currentChapter.Content, line);
        }
    }

    private static void FlushCurrentContentNode(ParsedStructureNode currentContentNode)
    {
        if (currentContentNode == null)
        {
            return;
        }

        currentContentNode.Content = NormalizeContentBlock(currentContentNode.Content);
    }

    private static string AppendContent(string existing, string line)
    {
        if (string.IsNullOrWhiteSpace(line))
        {
            return existing;
        }

        if (string.IsNullOrWhiteSpace(existing))
        {
            return line;
        }

        return $"{existing}\n{line}";
    }

    private static string NormalizeContentBlock(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return value;
        }

        var lines = value
            .Split('\n')
            .Select(line => NormalizeStructureText(line))
            .Where(line => !string.IsNullOrWhiteSpace(line))
            .Distinct()
            .ToList();

        return string.Join("\n", lines);
    }

    private static string NormalizeStructureText(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return string.Empty;
        }

        var normalized = value.Trim();
        normalized = MidwordHyphenRegex.Replace(normalized, string.Empty);
        normalized = ChapterRepairRegex.Replace(normalized, "Chapter $1 ");
        normalized = MarkerRepairRegex.Replace(normalized, " $1 ");
        normalized = DigitLetterRegex.Replace(normalized, " ");
        normalized = TrailingPageNumberRegex.Replace(normalized, string.Empty);
        normalized = WhitespaceRegex.Replace(normalized, " ").Trim(' ', ':', '-', '.');
        return normalized;
    }

    private static string TrimTrailingSectionNoise(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return value;
        }

        var normalized = NormalizeStructureText(value);
        var nestedSubsectionMatch = SubsectionHeadingRegex.Match(normalized);
        if (nestedSubsectionMatch.Success)
        {
            normalized = normalized[..nestedSubsectionMatch.Index].Trim();
        }

        var activityMatch = Regex.Match(normalized, @"\b(Activity|Worked Example)\b", RegexOptions.IgnoreCase);
        if (activityMatch.Success && activityMatch.Index > 0)
        {
            normalized = normalized[..activityMatch.Index].Trim();
        }

        return normalized;
    }

    private static bool IsProbableTableOfContentsLine(string line)
    {
        var lower = line.ToLowerInvariant();
        if (lower == "contents" || lower.StartsWith("contents "))
        {
            return true;
        }

        if (MultiDotLeaderRegex.IsMatch(line))
        {
            return true;
        }

        var subsectionMatches = InlineSubsectionMarkerRegex.Matches(line).Count;
        if (subsectionMatches > 1)
        {
            return true;
        }

        var digitCount = line.Count(char.IsDigit);
        return line.Length > 180 && digitCount > 15;
    }

    private static ParsedStructureNode CreateNode(ref long nextTemporaryId, long extractionJobId, long? parentNodeId, StructureNodeType nodeType, string title, ref int order, string content)
    {
        return new ParsedStructureNode
        {
            Id = nextTemporaryId--,
            ExtractionJobId = extractionJobId,
            ParentNodeId = parentNodeId,
            NodeType = nodeType,
            Title = title,
            Order = order++,
            Content = NormalizeContentBlock(content)
        };
    }
}
