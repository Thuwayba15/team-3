using AutoMapper;
using Team3.Curriculum.Entities;

namespace Team3.Curriculum.Dto;

public class CurriculumMapProfile : Profile
{
    public CurriculumMapProfile()
    {
        CreateMap<CurriculumExtractionJob, ExtractionJobDto>();
        CreateMap<ParsedStructureNode, ParsedStructureNodeDto>();
        CreateMap<TopicDraft, TopicDraftDto>();
        CreateMap<LessonDraft, LessonDraftDto>();
        CreateMap<QuizDraft, QuizDraftDto>();
    }
}
