using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.ObjectMapping;
using Abp.Timing;
using Abp.UI;
using Team3.Authorization;
using Team3.Curriculum.Dto;
using Team3.Curriculum.Entities;
using Team3.Curriculum.Enums;
using Team3.Curriculum.Services.Interfaces;
using Team3.Curriculum.Services.Models;

namespace Team3.Curriculum;

/// <summary>
/// Application service for curriculum ingestion operations.
/// </summary>
[AbpAllowAnonymous]
public class CurriculumIngestionAppService : Team3AppServiceBase, ICurriculumIngestionAppService
{
    private const int ParsedNodeTitleMaxLength = 512;
    private const int ParsedNodeContentMaxLength = 4000;
    private const int SafeLegacyUrlMaxLength = 512;
    private const int SafeLegacyErrorMessageMaxLength = 512;

    private readonly IRepository<CurriculumSourceDocument, long> _sourceDocumentRepository;
    private readonly IRepository<CurriculumExtractionJob, long> _extractionJobRepository;
    private readonly IRepository<ParsedStructureNode, long> _parsedStructureNodeRepository;
    private readonly IRepository<TopicDraft, long> _topicDraftRepository;
    private readonly IRepository<LessonDraft, long> _lessonDraftRepository;
    private readonly IRepository<QuizDraft, long> _quizDraftRepository;
    private readonly IRemoteDocumentFetcher _remoteDocumentFetcher;
    private readonly IDocumentTextExtractor _textExtractor;
    private readonly IDocumentProfileBuilder _documentProfileBuilder;
    private readonly IDocumentLayoutClassifier _layoutClassifier;
    private readonly IEnumerable<IStructureParser> _structureParsers;
    private readonly ICurriculumNormalizer _curriculumNormalizer;
    private readonly IObjectMapper _objectMapper;

    public CurriculumIngestionAppService(
        IRepository<CurriculumSourceDocument, long> sourceDocumentRepository,
        IRepository<CurriculumExtractionJob, long> extractionJobRepository,
        IRepository<ParsedStructureNode, long> parsedStructureNodeRepository,
        IRepository<TopicDraft, long> topicDraftRepository,
        IRepository<LessonDraft, long> lessonDraftRepository,
        IRepository<QuizDraft, long> quizDraftRepository,
        IRemoteDocumentFetcher remoteDocumentFetcher,
        IDocumentTextExtractor textExtractor,
        IDocumentProfileBuilder documentProfileBuilder,
        IDocumentLayoutClassifier layoutClassifier,
        IEnumerable<IStructureParser> structureParsers,
        ICurriculumNormalizer curriculumNormalizer,
        IObjectMapper objectMapper)
    {
        _sourceDocumentRepository = sourceDocumentRepository;
        _extractionJobRepository = extractionJobRepository;
        _parsedStructureNodeRepository = parsedStructureNodeRepository;
        _topicDraftRepository = topicDraftRepository;
        _lessonDraftRepository = lessonDraftRepository;
        _quizDraftRepository = quizDraftRepository;
        _remoteDocumentFetcher = remoteDocumentFetcher;
        _textExtractor = textExtractor;
        _documentProfileBuilder = documentProfileBuilder;
        _layoutClassifier = layoutClassifier;
        _structureParsers = structureParsers;
        _curriculumNormalizer = curriculumNormalizer;
        _objectMapper = objectMapper;
    }

    public async Task<RegisterSourceDocumentOutput> RegisterSourceDocument(RegisterSourceDocumentInput input)
    {
        var sourceUrl = input.SourceUrl.Trim();
        var sourceDocument = new CurriculumSourceDocument
        {
            SubjectName = input.SubjectName,
            GradeLevel = input.GradeLevel,
            DocumentType = input.DocumentType,
            SourceKind = SourceDocumentSourceKind.RemotePdfUrl,
            SourceUrl = sourceUrl,
            OriginalFileName = ResolveOriginalFileName(sourceUrl, input.OriginalFileName)
        };

        var savedDocument = await _sourceDocumentRepository.InsertAsync(sourceDocument);
        await CurrentUnitOfWork.SaveChangesAsync();

        return new RegisterSourceDocumentOutput
        {
            Id = savedDocument.Id,
            SubjectName = savedDocument.SubjectName,
            GradeLevel = savedDocument.GradeLevel,
            DocumentType = savedDocument.DocumentType,
            SourceKind = savedDocument.SourceKind,
            SourceUrl = savedDocument.SourceUrl,
            OriginalFileName = savedDocument.OriginalFileName,
            ContentType = savedDocument.ContentType,
            FileSize = savedDocument.FileSize
        };
    }

    public async Task<long> StartExtractionJob(StartExtractionJobInput input)
    {
        var sourceDocument = await _sourceDocumentRepository.GetAsync(input.SourceDocumentId);

        var job = new CurriculumExtractionJob
        {
            SourceDocumentId = input.SourceDocumentId,
            Status = ExtractionJobStatus.InProgress,
            StartedAt = Clock.Now,
            ProcessingStage = ExtractionProcessingStage.Fetching,
            SourceUrlSnapshot = Truncate(sourceDocument.SourceUrl, SafeLegacyUrlMaxLength)
        };

        var savedJob = await _extractionJobRepository.InsertAsync(job);
        await CurrentUnitOfWork.SaveChangesAsync();

        await PerformExtractionAsync(savedJob.Id, sourceDocument);
        return savedJob.Id;
    }

    private async Task PerformExtractionAsync(long jobId, CurriculumSourceDocument sourceDocument)
    {
        var job = await _extractionJobRepository.GetAsync(jobId);

        try
        {
            await UpdateJobStageAsync(job, ExtractionProcessingStage.Fetching);
            var fetchedDocument = await _remoteDocumentFetcher.FetchPdfAsync(sourceDocument.SourceUrl);

            sourceDocument.ContentType = fetchedDocument.ContentType;
            sourceDocument.FileSize = fetchedDocument.FileSize;
            sourceDocument.OriginalFileName = Truncate(ResolveOriginalFileName(sourceDocument.SourceUrl, fetchedDocument.FileName), 256);
            sourceDocument.LastFetchedAt = Clock.Now;
            sourceDocument.DownloadErrorMessage = null;
            await _sourceDocumentRepository.UpdateAsync(sourceDocument);

            job.SourceUrlSnapshot = Truncate(fetchedDocument.FinalUrl, SafeLegacyUrlMaxLength);
            job.DownloadedContentType = fetchedDocument.ContentType;
            job.DownloadedFileSize = fetchedDocument.FileSize;
            await _extractionJobRepository.UpdateAsync(job);
            await CurrentUnitOfWork.SaveChangesAsync();

            await UpdateJobStageAsync(job, ExtractionProcessingStage.ExtractingText);
            var textContent = await _textExtractor.ExtractTextAsync(fetchedDocument.ContentBytes, sourceDocument.OriginalFileName);
            var documentProfile = _documentProfileBuilder.BuildProfile(textContent);

            await UpdateJobStageAsync(job, ExtractionProcessingStage.ClassifyingLayout);
            var classificationResult = await _layoutClassifier.ClassifyLayoutAsync(documentProfile);
            job.DetectedLayoutFamily = classificationResult.BestMatch;
            job.ClassificationConfidence = classificationResult.Confidence;
            job.CandidateFamilies = Truncate(classificationResult.ToSummary(), 2000);
            await _extractionJobRepository.UpdateAsync(job);
            await CurrentUnitOfWork.SaveChangesAsync();

            await UpdateJobStageAsync(job, ExtractionProcessingStage.ParsingStructure);
            var parser = SelectParser(documentProfile, classificationResult);
            if (parser == null)
            {
                throw new UserFriendlyException("No structure parser was able to handle the extracted document profile.");
            }

            var parseResult = await parser.ParseStructureAsync(documentProfile, jobId, classificationResult);
            if (!parseResult.Nodes.Any())
            {
                throw new UserFriendlyException("No usable structure could be extracted from the PDF text.");
            }

            await UpdateJobStageAsync(job, ExtractionProcessingStage.PersistingNodes);
            await PersistParsedNodesAsync(parseResult.Nodes);

            job.Status = ExtractionJobStatus.Completed;
            job.CompletedAt = Clock.Now;
            job.DetectedLayoutFamily = classificationResult.BestMatch;
            job.ProcessingStage = ExtractionProcessingStage.Completed;
            job.ErrorMessage = null;
            job.ExtractionMode = parseResult.Mode;
            job.ParserName = parseResult.ParserName;
            job.ParserConfidence = parseResult.Confidence;
            job.WarningMessages = Truncate(string.Join("; ", parseResult.Warnings.Concat(BuildClassificationWarnings(classificationResult, documentProfile))), 4000);
            await _extractionJobRepository.UpdateAsync(job);
        }
        catch (Exception ex)
        {
            sourceDocument.LastFetchedAt = Clock.Now;
            sourceDocument.DownloadErrorMessage = Truncate(ex.GetBaseException().Message, SafeLegacyErrorMessageMaxLength);
            await _sourceDocumentRepository.UpdateAsync(sourceDocument);

            job.Status = ExtractionJobStatus.Failed;
            job.CompletedAt = Clock.Now;
            job.ErrorMessage = Truncate(ex.GetBaseException().Message, SafeLegacyErrorMessageMaxLength);
            job.ProcessingStage = ExtractionProcessingStage.Failed;
            await _extractionJobRepository.UpdateAsync(job);
        }

        await CurrentUnitOfWork.SaveChangesAsync();
    }

    public async Task<ExtractionJobDto> GetExtractionJob(long extractionJobId)
    {
        var job = await _extractionJobRepository.GetAsync(extractionJobId);
        return _objectMapper.Map<ExtractionJobDto>(job);
    }

    public async Task<List<ParsedStructureNodeDto>> GetParsedStructure(long extractionJobId)
    {
        var nodes = await _parsedStructureNodeRepository.GetAllListAsync(n => n.ExtractionJobId == extractionJobId);
        return _objectMapper.Map<List<ParsedStructureNodeDto>>(nodes.OrderBy(n => n.Order));
    }

    public async Task GenerateDraftCurriculum(long extractionJobId)
    {
        var nodes = await _parsedStructureNodeRepository.GetAllListAsync(n => n.ExtractionJobId == extractionJobId);
        var normalizationResult = await _curriculumNormalizer.NormalizeAsync(nodes, extractionJobId);

        var job = await _extractionJobRepository.GetAsync(extractionJobId);
        var warnings = new List<string>();
        if (!string.IsNullOrWhiteSpace(job.WarningMessages))
        {
            warnings.Add(job.WarningMessages);
        }

        warnings.Add($"Draft generation created {normalizationResult.TopicCount} topics, {normalizationResult.LessonCount} lessons, {normalizationResult.MaterialCount} materials and {normalizationResult.QuizCount} quizzes.");

        if (normalizationResult.InferredLessonCount > 0)
        {
            warnings.Add($"{normalizationResult.InferredLessonCount} inferred lesson nodes were used during draft generation.");
        }

        if (normalizationResult.SyntheticLessonCount > 0)
        {
            warnings.Add($"Chapter-only fallback was used for {normalizationResult.SyntheticLessonCount} synthesized lesson rows.");
        }

        job.WarningMessages = Truncate(string.Join("; ", warnings.Distinct()), 4000);
        await _extractionJobRepository.UpdateAsync(job);
        await CurrentUnitOfWork.SaveChangesAsync();
    }

    public async Task<List<TopicDraftDto>> GetTopicDrafts(long extractionJobId)
    {
        var topics = await _topicDraftRepository.GetAllListAsync(t => t.ExtractionJobId == extractionJobId);
        return _objectMapper.Map<List<TopicDraftDto>>(topics.OrderBy(t => t.Order));
    }

    public async Task<List<LessonDraftDto>> GetLessonDrafts(long topicDraftId)
    {
        var lessons = await _lessonDraftRepository.GetAllListAsync(l => l.TopicDraftId == topicDraftId);
        return _objectMapper.Map<List<LessonDraftDto>>(lessons.OrderBy(l => l.Order));
    }

    public async Task<List<QuizDraftDto>> GetQuizDrafts(long lessonDraftId)
    {
        var quizzes = await _quizDraftRepository.GetAllListAsync(q => q.LessonDraftId == lessonDraftId);
        return _objectMapper.Map<List<QuizDraftDto>>(quizzes.OrderBy(q => q.Order));
    }

    public async Task PublishCurriculum(PublishCurriculumInput input)
    {
        var topics = await _topicDraftRepository.GetAllListAsync(t => t.ExtractionJobId == input.ExtractionJobId);
        foreach (var topic in topics)
        {
            topic.Status = DraftStatus.Approved;
            await _topicDraftRepository.UpdateAsync(topic);
        }

        var lessons = await _lessonDraftRepository.GetAllListAsync(l => topics.Select(t => t.Id).Contains(l.TopicDraftId));
        foreach (var lesson in lessons)
        {
            lesson.Status = DraftStatus.Approved;
            await _lessonDraftRepository.UpdateAsync(lesson);
        }

        var quizzes = await _quizDraftRepository.GetAllListAsync(q => lessons.Select(l => l.Id).Contains(q.LessonDraftId));
        foreach (var quiz in quizzes)
        {
            quiz.Status = DraftStatus.Approved;
            await _quizDraftRepository.UpdateAsync(quiz);
        }
    }

    private async Task UpdateJobStageAsync(CurriculumExtractionJob job, ExtractionProcessingStage stage)
    {
        job.ProcessingStage = stage;
        await _extractionJobRepository.UpdateAsync(job);
        await CurrentUnitOfWork.SaveChangesAsync();
    }

    private async Task PersistParsedNodesAsync(List<ParsedStructureNode> parsedNodes)
    {
        var idMap = new Dictionary<long, long>();

        foreach (var node in parsedNodes.OrderBy(n => n.Order))
        {
            node.Title = Truncate(node.Title, ParsedNodeTitleMaxLength);
            node.Content = Truncate(node.Content, ParsedNodeContentMaxLength);

            var temporaryId = node.Id;
            if (node.ParentNodeId.HasValue && idMap.TryGetValue(node.ParentNodeId.Value, out var parentId))
            {
                node.ParentNodeId = parentId;
            }
            else if (node.ParentNodeId.HasValue)
            {
                node.ParentNodeId = null;
            }

            node.Id = 0;
            var savedNode = await _parsedStructureNodeRepository.InsertAsync(node);
            await CurrentUnitOfWork.SaveChangesAsync();

            if (temporaryId != 0)
            {
                idMap[temporaryId] = savedNode.Id;
            }
        }
    }

    private static string ResolveOriginalFileName(string sourceUrl, string providedFileName)
    {
        if (!string.IsNullOrWhiteSpace(providedFileName))
        {
            return providedFileName.Trim();
        }

        if (Uri.TryCreate(sourceUrl, UriKind.Absolute, out var uri))
        {
            var fileName = System.IO.Path.GetFileName(uri.AbsolutePath);
            if (!string.IsNullOrWhiteSpace(fileName))
            {
                return fileName;
            }
        }

        return "document.pdf";
    }

    private IStructureParser SelectParser(DocumentProfile documentProfile, LayoutClassificationResult classificationResult)
    {
        var candidateScores = classificationResult.CandidateFamilies.ToDictionary(candidate => candidate.Family, candidate => candidate.Score);

        var preferredMatch = _structureParsers
            .Where(parser => parser.CanParse(documentProfile, classificationResult))
            .Where(parser => parser.SupportedLayoutFamily != LayoutFamilyType.Unknown)
            .OrderByDescending(parser => candidateScores.TryGetValue(parser.SupportedLayoutFamily, out var score) ? score : 0)
            .FirstOrDefault();

        if (preferredMatch != null)
        {
            return preferredMatch;
        }

        return _structureParsers.FirstOrDefault(parser =>
            parser.SupportedLayoutFamily == LayoutFamilyType.Unknown &&
            parser.CanParse(documentProfile, classificationResult));
    }

    private static IEnumerable<string> BuildClassificationWarnings(LayoutClassificationResult classificationResult, DocumentProfile documentProfile)
    {
        if (classificationResult.IsLowConfidence())
        {
            yield return $"Classification confidence was low ({classificationResult.Confidence:F2}).";
        }

        if (documentProfile.HasTableOfContents)
        {
            yield return "Table of contents markers were used during profiling.";
        }

        foreach (var heading in documentProfile.SampleHeadingCandidates(3))
        {
            yield return $"Heading sample: {heading}";
        }
    }

    private static string Truncate(string value, int maxLength)
    {
        if (string.IsNullOrWhiteSpace(value) || value.Length <= maxLength)
        {
            return value;
        }

        return value[..maxLength];
    }
}
