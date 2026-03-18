using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using Abp.Dependency;
using Team3.Curriculum.Services.Interfaces;
using Team3.Curriculum.Services.Models;

namespace Team3.Curriculum.Services.Implementations;

public class DocumentProfileBuilder : IDocumentProfileBuilder, ITransientDependency
{
    private static readonly Regex NumberedHeadingRegex = new(@"^\d+[\.\)]\s+\S+", RegexOptions.Compiled);
    private static readonly Regex ChapterHeadingRegex = new(@"^(chapter)\s*\d+\b", RegexOptions.Compiled | RegexOptions.IgnoreCase);
    private static readonly Regex SubsectionMarkerRegex = new(@"\b\d+\.\d+\b", RegexOptions.Compiled);
    private static readonly Regex LetterHyphenLetterRegex = new(@"(?<=\p{L})-(?=\p{L})", RegexOptions.Compiled);
    private static readonly Regex ChapterTocRepairRegex = new(@"(?i)\bchapter\s*(\d+)", RegexOptions.Compiled);
    private static readonly Regex SectionTocRepairRegex = new(@"(?<=\D)(\d+\.\d+)(?=[A-Za-z])", RegexOptions.Compiled);
    private static readonly Regex DigitLetterRegex = new(@"(?<=\d)(?=[A-Za-z])", RegexOptions.Compiled);
    private static readonly Regex TrailingPageNumberRegex = new(@"\s+\d{1,4}\s*$", RegexOptions.Compiled);

    public DocumentProfile BuildProfile(string textContent)
    {
        var pageTexts = textContent.Split('\f', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).ToList();
        var normalizedLines = textContent
            .Split(new[] { '\r', '\n', '\f' }, StringSplitOptions.RemoveEmptyEntries)
            .Select(NormalizeExtractedLine)
            .Where(line => !string.IsNullOrWhiteSpace(line))
            .ToList();

        var lowerLines = normalizedLines.Select(line => line.ToLowerInvariant()).ToList();
        var hasTableOfContents = lowerLines.Any(line => line.Contains("table of contents"));
        var chapterHeadingCandidates = normalizedLines
            .Where(line => ChapterHeadingRegex.IsMatch(line))
            .Distinct()
            .ToList();

        var tocLines = hasTableOfContents
            ? normalizedLines.Where(line =>
                line.StartsWith("Strand:", StringComparison.OrdinalIgnoreCase) ||
                ChapterHeadingRegex.IsMatch(line) ||
                NumberedHeadingRegex.IsMatch(line) ||
                line.StartsWith("Appendices", StringComparison.OrdinalIgnoreCase) ||
                line.Contains("Answers to Activities", StringComparison.OrdinalIgnoreCase))
                .ToList()
            : new List<string>();

        var headingCandidates = normalizedLines.Where(IsHeadingCandidate).Distinct().ToList();

        return new DocumentProfile
        {
            RawText = textContent,
            PageTexts = pageTexts,
            NormalizedLines = normalizedLines,
            TableOfContentsLines = tocLines,
            HeadingCandidates = headingCandidates,
            ChapterHeadingCandidates = chapterHeadingCandidates,
            StrandCount = CountContains(lowerLines, "strand"),
            TermCount = CountStartsWith(lowerLines, "term"),
            ChapterKeywordCount = CountStartsWith(lowerLines, "chapter"),
            ChapterHeadingCount = chapterHeadingCandidates.Count,
            SectionCount = CountStartsWith(lowerLines, "section"),
            UnitCount = CountStartsWith(lowerLines, "unit"),
            ActivityCount = CountContains(lowerLines, "activity"),
            GuidedActivityCount = CountContains(lowerLines, "guided activity"),
            ConsolidationActivityCount = CountContains(lowerLines, "consolidation activity"),
            EndOfTopicExercisesCount = CountContains(lowerLines, "end-of-topic exercises"),
            NumberedHeadingCount = normalizedLines.Count(line => NumberedHeadingRegex.IsMatch(line)),
            AppendixCount = CountContains(lowerLines, "appendi"),
            HasTableOfContents = hasTableOfContents
        };
    }

    private static int CountContains(IEnumerable<string> lines, string token) => lines.Count(line => line.Contains(token));

    private static int CountStartsWith(IEnumerable<string> lines, string token) => lines.Count(line => line.StartsWith(token));

    private static bool IsHeadingCandidate(string line)
    {
        if (line.Length > 160)
        {
            return false;
        }

        return line.StartsWith("Strand:", StringComparison.OrdinalIgnoreCase)
            || line.StartsWith("Term", StringComparison.OrdinalIgnoreCase)
            || line.StartsWith("Chapter", StringComparison.OrdinalIgnoreCase)
            || line.StartsWith("Section", StringComparison.OrdinalIgnoreCase)
            || line.StartsWith("Unit", StringComparison.OrdinalIgnoreCase)
            || NumberedHeadingRegex.IsMatch(line)
            || line.StartsWith("Appendices", StringComparison.OrdinalIgnoreCase);
    }

    private static string NormalizeExtractedLine(string line)
    {
        if (string.IsNullOrWhiteSpace(line))
        {
            return string.Empty;
        }

        var normalized = line.Trim();
        normalized = LetterHyphenLetterRegex.Replace(normalized, string.Empty);
        normalized = ChapterTocRepairRegex.Replace(normalized, "Chapter $1 ");
        normalized = SectionTocRepairRegex.Replace(normalized, " $1 ");
        normalized = DigitLetterRegex.Replace(normalized, " ");
        normalized = Regex.Replace(normalized, @"\s+", " ").Trim();

        if (ChapterHeadingRegex.IsMatch(normalized))
        {
            normalized = TrailingPageNumberRegex.Replace(normalized, string.Empty).Trim();

            var subsectionMatch = SubsectionMarkerRegex.Match(normalized);
            if (subsectionMatch.Success)
            {
                normalized = normalized[..subsectionMatch.Index].Trim();
            }
        }

        return normalized;
    }
}
