using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.ObjectMapping;
using Abp.Timing;
using Microsoft.AspNetCore.Hosting;
using Team3.Authorization;
using Team3.Curriculum.Dto;
using Team3.Curriculum.Entities;
using Team3.Curriculum.Enums;
using Team3.Curriculum.Services.Interfaces;

namespace Team3.Curriculum;

/// <summary>
/// Application service for curriculum ingestion operations.
/// </summary>
[AbpAuthorize(PermissionNames.Pages_Curriculum)]
public class CurriculumIngestionAppService : Team3AppServiceBase, ICurriculumIngestionAppService
{
    private readonly IRepository<CurriculumSourceDocument, long> _sourceDocumentRepository;
    private readonly IRepository<CurriculumExtractionJob, long> _extractionJobRepository;
    private readonly IRepository<ParsedStructureNode, long> _parsedStructureNodeRepository;
    private readonly IRepository<TopicDraft, long> _topicDraftRepository;
    private readonly IRepository<LessonDraft, long> _lessonDraftRepository;
    private readonly IRepository<QuizDraft, long> _quizDraftRepository;
    private readonly IDocumentStorageService _documentStorageService;
    private readonly IDocumentTextExtractor _textExtractor;
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
        IDocumentStorageService documentStorageService,
        IDocumentTextExtractor textExtractor,
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
        _documentStorageService = documentStorageService;
        _textExtractor = textExtractor;
        _layoutClassifier = layoutClassifier;
        _structureParsers = structureParsers;
        _curriculumNormalizer = curriculumNormalizer;
        _objectMapper = objectMapper;
    }

    public async Task<UploadSourceDocumentOutput> UploadSourceDocument(UploadSourceDocumentInput input)
    {
        // Store the file
        var filePath = await _documentStorageService.StoreFileAsync(input.File, input.SubjectName, input.GradeLevel);

        // Create source document entity
        var sourceDocument = new CurriculumSourceDocument
        {
            SubjectName = input.SubjectName,
            GradeLevel = input.GradeLevel,
            DocumentType = input.DocumentType,
            FilePath = filePath,
            OriginalFileName = input.File.FileName,
            FileSize = input.File.Length,
            ContentType = input.File.ContentType
        };

        var savedDocument = await _sourceDocumentRepository.InsertAsync(sourceDocument);
        await CurrentUnitOfWork.SaveChangesAsync();

        return new UploadSourceDocumentOutput
        {
            Id = savedDocument.Id,
            SubjectName = savedDocument.SubjectName,
            GradeLevel = savedDocument.GradeLevel,
            FilePath = savedDocument.FilePath,
            OriginalFileName = savedDocument.OriginalFileName,
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
            StartedAt = Clock.Now
        };

        var savedJob = await _extractionJobRepository.InsertAsync(job);
        await CurrentUnitOfWork.SaveChangesAsync();

        // Run extraction synchronously for now
        await PerformExtractionAsync(savedJob.Id, sourceDocument);

        return savedJob.Id;
    }

    private async Task PerformExtractionAsync(long jobId, CurriculumSourceDocument sourceDocument)
    {
        try
        {
            // Extract text
            var textContent = await _textExtractor.ExtractTextAsync(sourceDocument.FilePath);

            // Classify layout
            var layoutFamily = await _layoutClassifier.ClassifyLayoutAsync(textContent);

            // Parse structure
            var parser = _structureParsers.FirstOrDefault(p => p.SupportedLayoutFamily == layoutFamily);
            if (parser == null)
            {
                throw new System.Exception($"No parser found for layout family {layoutFamily}");
            }

            var parsedNodes = await parser.ParseStructureAsync(textContent, jobId);

            // Save parsed nodes
            foreach (var node in parsedNodes)
            {
                await _parsedStructureNodeRepository.InsertAsync(node);
            }

            // Update job
            var job = await _extractionJobRepository.GetAsync(jobId);
            job.Status = ExtractionJobStatus.Completed;
            job.CompletedAt = Clock.Now;
            job.DetectedLayoutFamily = layoutFamily;
            await _extractionJobRepository.UpdateAsync(job);
        }
        catch (System.Exception ex)
        {
            var job = await _extractionJobRepository.GetAsync(jobId);
            job.Status = ExtractionJobStatus.Failed;
            job.CompletedAt = Clock.Now;
            job.ErrorMessage = ex.Message;
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
        await _curriculumNormalizer.NormalizeAsync(nodes, extractionJobId);
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
        // For now, just mark drafts as approved. In real implementation, copy to final entities.
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
}