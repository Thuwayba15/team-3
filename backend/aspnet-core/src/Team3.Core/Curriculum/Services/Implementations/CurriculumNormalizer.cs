using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Team3.Curriculum.Entities;
using Team3.Curriculum.Enums;
using Team3.Curriculum.Services.Interfaces;
using Team3.Curriculum.Services.Models;

namespace Team3.Curriculum.Services.Implementations;

/// <summary>
/// Normalizes parsed structure nodes into draft curriculum entities.
/// </summary>
public class CurriculumNormalizer : ICurriculumNormalizer, ITransientDependency
{
    private static readonly Regex ChapterHeadingRegex = new(@"^chapter\s*(\d+)", RegexOptions.Compiled | RegexOptions.IgnoreCase);
    private static readonly Regex SubsectionMarkerRegex = new(@"\b\d+\.\d+\b", RegexOptions.Compiled);
    private static readonly Regex LetterHyphenLetterRegex = new(@"(?<=\p{L})-(?=\p{L})", RegexOptions.Compiled);
    private static readonly Regex DigitLetterRegex = new(@"(?<=\d)(?=[A-Za-z])", RegexOptions.Compiled);

    private const int DraftTitleMaxLength = 256;
    private const int DraftDescriptionMaxLength = 1000;
    private const int MaterialContentMaxLength = 4000;
    private const int QuizQuestionTextMaxLength = 1000;
    private const int QuizOptionMaxLength = 500;
    private const int QuizExplanationMaxLength = 1000;

    private readonly IRepository<TopicDraft, long> _topicDraftRepository;
    private readonly IRepository<LessonDraft, long> _lessonDraftRepository;
    private readonly IRepository<LessonMaterialDraft, long> _lessonMaterialDraftRepository;
    private readonly IRepository<QuizDraft, long> _quizDraftRepository;
    private readonly IRepository<QuizQuestionDraft, long> _quizQuestionDraftRepository;

    public CurriculumNormalizer(
        IRepository<TopicDraft, long> topicDraftRepository,
        IRepository<LessonDraft, long> lessonDraftRepository,
        IRepository<LessonMaterialDraft, long> lessonMaterialDraftRepository,
        IRepository<QuizDraft, long> quizDraftRepository,
        IRepository<QuizQuestionDraft, long> quizQuestionDraftRepository)
    {
        _topicDraftRepository = topicDraftRepository;
        _lessonDraftRepository = lessonDraftRepository;
        _lessonMaterialDraftRepository = lessonMaterialDraftRepository;
        _quizDraftRepository = quizDraftRepository;
        _quizQuestionDraftRepository = quizQuestionDraftRepository;
    }

    public async Task<NormalizationResult> NormalizeAsync(List<ParsedStructureNode> nodes, long extractionJobId)
    {
        await ClearExistingDraftsAsync(extractionJobId);

        var chapters = nodes
            .Where(n => n.NodeType == StructureNodeType.Chapter)
            .OrderBy(n => n.Order)
            .ToList();

        if (!chapters.Any())
        {
            chapters = nodes
                .Where(n => n.NodeType == StructureNodeType.Strand)
                .OrderBy(n => n.Order)
                .ToList();
        }

        int topicOrder = 1;
        var result = new NormalizationResult();

        foreach (var chapter in chapters)
        {
            var topicDraft = new TopicDraft
            {
                ExtractionJobId = extractionJobId,
                Title = Truncate(NormalizeDraftTitle(chapter.Title), DraftTitleMaxLength),
                Description = Truncate(NormalizeDraftDescription(chapter.Content), DraftDescriptionMaxLength),
                Order = topicOrder++,
                Status = DraftStatus.Draft
            };

            var topicDraftId = await _topicDraftRepository.InsertAndGetIdAsync(topicDraft);
            result.TopicCount++;

            var topicResult = await ProcessChapterNodesAsync(chapter, nodes, topicDraft, topicDraftId);
            result.LessonCount += topicResult.LessonCount;
            result.SyntheticLessonCount += topicResult.SyntheticLessonCount;
            result.InferredLessonCount += topicResult.InferredLessonCount;
            result.MaterialCount += topicResult.MaterialCount;
            result.QuizCount += topicResult.QuizCount;
        }

        return result;
    }

    private async Task<NormalizationResult> ProcessChapterNodesAsync(ParsedStructureNode chapter, List<ParsedStructureNode> allNodes, TopicDraft topicDraft, long topicDraftId)
    {
        var chapterChildNodes = allNodes
            .Where(n => n.ParentNodeId == chapter.Id)
            .OrderBy(n => n.Order)
            .ToList();

        var lessonNodes = chapterChildNodes
            .Where(IsLessonNode)
            .OrderBy(n => n.Order)
            .ToList();

        var result = new NormalizationResult();
        if (!lessonNodes.Any())
        {
            var syntheticLessonId = await CreateSyntheticLessonAsync(topicDraft, topicDraftId, 1);
            result.LessonCount = 1;
            result.SyntheticLessonCount = 1;

            var chapterScopedNodes = chapterChildNodes.Where(n => !IsLessonNode(n)).ToList();
            var syntheticResources = await CreateLessonResourcesAsync(
                syntheticLessonId,
                topicDraft.Title,
                topicDraft.Description,
                chapterScopedNodes);

            result.MaterialCount += syntheticResources.MaterialCount;
            result.QuizCount += syntheticResources.QuizCount;
            return result;
        }

        int lessonOrder = 1;
        result.InferredLessonCount = lessonNodes.Count;

        for (var index = 0; index < lessonNodes.Count; index++)
        {
            var lessonNode = lessonNodes[index];
            var lessonDraft = new LessonDraft
            {
                TopicDraftId = topicDraftId,
                Title = Truncate(NormalizeDraftTitle(lessonNode.Title), DraftTitleMaxLength),
                Description = Truncate(NormalizeDraftDescription(lessonNode.Content), DraftDescriptionMaxLength),
                Order = lessonOrder++,
                Status = DraftStatus.Draft
            };

            var lessonDraftId = await _lessonDraftRepository.InsertAndGetIdAsync(lessonDraft);
            result.LessonCount++;

            var nextLessonOrder = index < lessonNodes.Count - 1
                ? lessonNodes[index + 1].Order
                : int.MaxValue;

            var directLessonChildren = allNodes
                .Where(n => n.ParentNodeId == lessonNode.Id)
                .OrderBy(n => n.Order)
                .ToList();

            var chapterScopedNodes = chapterChildNodes
                .Where(n => !IsLessonNode(n))
                .Where(n => n.ParentNodeId == chapter.Id)
                .Where(n => n.Order > lessonNode.Order && n.Order < nextLessonOrder)
                .ToList();

            var lessonResources = await CreateLessonResourcesAsync(
                lessonDraftId,
                lessonDraft.Title,
                lessonDraft.Description,
                directLessonChildren.Concat(chapterScopedNodes).OrderBy(n => n.Order).ToList());

            result.MaterialCount += lessonResources.MaterialCount;
            result.QuizCount += lessonResources.QuizCount;
        }

        return result;
    }

    private async Task<NormalizationResult> CreateLessonResourcesAsync(long lessonDraftId, string lessonTitle, string lessonDescription, List<ParsedStructureNode> scopedNodes)
    {
        var result = new NormalizationResult();
        int materialOrder = 1;
        int quizOrder = 1;

        if (!string.IsNullOrWhiteSpace(lessonDescription))
        {
            var overviewMaterial = new LessonMaterialDraft
            {
                LessonDraftId = lessonDraftId,
                Title = Truncate($"Lesson Content: {NormalizeDraftTitle(lessonTitle)}", DraftTitleMaxLength),
                Content = Truncate(lessonDescription, MaterialContentMaxLength),
                Order = materialOrder++,
                Status = DraftStatus.Draft
            };

            await _lessonMaterialDraftRepository.InsertAsync(overviewMaterial);
            result.MaterialCount++;
        }

        foreach (var materialNode in scopedNodes.Where(IsMaterialNode))
        {
            var materialDraft = new LessonMaterialDraft
            {
                LessonDraftId = lessonDraftId,
                Title = Truncate(NormalizeDraftTitle(materialNode.Title), DraftTitleMaxLength),
                Content = Truncate(NormalizeDraftDescription(materialNode.Content), MaterialContentMaxLength),
                Order = materialOrder++,
                Status = DraftStatus.Draft
            };

            await _lessonMaterialDraftRepository.InsertAsync(materialDraft);
            result.MaterialCount++;
        }

        foreach (var activityNode in scopedNodes.Where(IsQuizNode))
        {
            var quizDraft = new QuizDraft
            {
                LessonDraftId = lessonDraftId,
                Title = Truncate(NormalizeDraftTitle(activityNode.Title), DraftTitleMaxLength),
                Description = Truncate(NormalizeDraftDescription(activityNode.Content), DraftDescriptionMaxLength),
                Order = quizOrder++,
                Status = DraftStatus.Draft
            };

            var quizDraftId = await _quizDraftRepository.InsertAndGetIdAsync(quizDraft);
            result.QuizCount++;

            for (int i = 1; i <= 3; i++)
            {
                var question = new QuizQuestionDraft
                {
                    QuizDraftId = quizDraftId,
                    QuestionText = Truncate($"Sample Question {i} for {NormalizeDraftTitle(activityNode.Title)}", QuizQuestionTextMaxLength),
                    OptionA = Truncate("Option A", QuizOptionMaxLength),
                    OptionB = Truncate("Option B", QuizOptionMaxLength),
                    OptionC = Truncate("Option C", QuizOptionMaxLength),
                    OptionD = Truncate("Option D", QuizOptionMaxLength),
                    CorrectAnswer = "A",
                    Explanation = Truncate("Sample explanation", QuizExplanationMaxLength),
                    Order = i,
                    Status = DraftStatus.Draft
                };

                await _quizQuestionDraftRepository.InsertAsync(question);
            }
        }

        return result;
    }

    private async Task<long> CreateSyntheticLessonAsync(TopicDraft topicDraft, long topicDraftId, int order)
    {
        var lessonDraft = new LessonDraft
        {
            TopicDraftId = topicDraftId,
            Title = Truncate(topicDraft.Title, DraftTitleMaxLength),
            Description = Truncate(topicDraft.Description, DraftDescriptionMaxLength),
            Order = order,
            Status = DraftStatus.Draft
        };

        return await _lessonDraftRepository.InsertAndGetIdAsync(lessonDraft);
    }

    private async Task ClearExistingDraftsAsync(long extractionJobId)
    {
        var topics = await _topicDraftRepository.GetAllListAsync(t => t.ExtractionJobId == extractionJobId);
        var topicIds = topics.Select(t => t.Id).ToList();

        var lessons = topicIds.Any()
            ? await _lessonDraftRepository.GetAllListAsync(l => topicIds.Contains(l.TopicDraftId))
            : new List<LessonDraft>();
        var lessonIds = lessons.Select(l => l.Id).ToList();

        var materials = lessonIds.Any()
            ? await _lessonMaterialDraftRepository.GetAllListAsync(m => lessonIds.Contains(m.LessonDraftId))
            : new List<LessonMaterialDraft>();
        foreach (var material in materials)
        {
            await _lessonMaterialDraftRepository.DeleteAsync(material);
        }

        var quizzes = lessonIds.Any()
            ? await _quizDraftRepository.GetAllListAsync(q => lessonIds.Contains(q.LessonDraftId))
            : new List<QuizDraft>();
        var quizIds = quizzes.Select(q => q.Id).ToList();

        var questions = quizIds.Any()
            ? await _quizQuestionDraftRepository.GetAllListAsync(q => quizIds.Contains(q.QuizDraftId))
            : new List<QuizQuestionDraft>();
        foreach (var question in questions)
        {
            await _quizQuestionDraftRepository.DeleteAsync(question);
        }

        foreach (var quiz in quizzes)
        {
            await _quizDraftRepository.DeleteAsync(quiz);
        }

        foreach (var lesson in lessons)
        {
            await _lessonDraftRepository.DeleteAsync(lesson);
        }

        foreach (var topic in topics)
        {
            await _topicDraftRepository.DeleteAsync(topic);
        }
    }

    private static bool IsLessonNode(ParsedStructureNode node)
    {
        return node.NodeType == StructureNodeType.Unit || node.NodeType == StructureNodeType.Section;
    }

    private static bool IsMaterialNode(ParsedStructureNode node)
    {
        return node.NodeType == StructureNodeType.Example ||
               node.NodeType == StructureNodeType.GuidedActivity ||
               node.NodeType == StructureNodeType.Annexure ||
               node.NodeType == StructureNodeType.Glossary;
    }

    private static bool IsQuizNode(ParsedStructureNode node)
    {
        return node.NodeType == StructureNodeType.Activity ||
               node.NodeType == StructureNodeType.ConsolidationActivity ||
               node.NodeType == StructureNodeType.EndOfTopicExercises;
    }

    private static string Truncate(string value, int maxLength)
    {
        if (string.IsNullOrWhiteSpace(value) || value.Length <= maxLength)
        {
            return value;
        }

        return value[..maxLength];
    }

    private static string NormalizeDraftTitle(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return value;
        }

        var normalized = NormalizeCollapsedText(value);
        var chapterMatch = ChapterHeadingRegex.Match(normalized);
        if (!chapterMatch.Success)
        {
            return normalized;
        }

        var chapterNumber = chapterMatch.Groups[1].Value;
        var remainder = normalized[chapterMatch.Length..].Trim(' ', ':', '-', '.');
        var subsectionMatch = SubsectionMarkerRegex.Match(remainder);
        if (subsectionMatch.Success)
        {
            remainder = remainder[..subsectionMatch.Index].Trim();
        }

        return string.IsNullOrWhiteSpace(remainder)
            ? $"Chapter {chapterNumber}"
            : $"Chapter {chapterNumber}: {remainder}";
    }

    private static string NormalizeDraftDescription(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return value;
        }

        return NormalizeCollapsedText(value);
    }

    private static string NormalizeCollapsedText(string value)
    {
        var normalized = value.Trim();
        normalized = LetterHyphenLetterRegex.Replace(normalized, string.Empty);
        normalized = Regex.Replace(normalized, @"(?i)\bchapter\s*(\d+)", "Chapter $1 ");
        normalized = Regex.Replace(normalized, @"(?<=\D)(\d+\.\d+)", " $1 ");
        normalized = DigitLetterRegex.Replace(normalized, " ");
        normalized = Regex.Replace(normalized, @"\s+", " ").Trim();
        return normalized;
    }
}
