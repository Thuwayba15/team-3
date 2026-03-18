using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Team3.Curriculum.Dto;

namespace Team3.Curriculum;

/// <summary>
/// Application service for curriculum ingestion operations.
/// </summary>
public interface ICurriculumIngestionAppService : IApplicationService
{
    Task<RegisterSourceDocumentOutput> RegisterSourceDocument(RegisterSourceDocumentInput input);
    Task<long> StartExtractionJob(StartExtractionJobInput input);
    Task<ExtractionJobDto> GetExtractionJob(long extractionJobId);
    Task<List<ParsedStructureNodeDto>> GetParsedStructure(long extractionJobId);
    Task GenerateDraftCurriculum(long extractionJobId);
    Task<List<TopicDraftDto>> GetTopicDrafts(long extractionJobId);
    Task<List<LessonDraftDto>> GetLessonDrafts(long topicDraftId);
    Task<List<QuizDraftDto>> GetQuizDrafts(long lessonDraftId);
    Task PublishCurriculum(PublishCurriculumInput input);
}
