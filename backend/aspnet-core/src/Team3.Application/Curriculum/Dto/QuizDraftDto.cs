using Abp.Application.Services.Dto;
using Team3.Curriculum.Enums;

namespace Team3.Curriculum.Dto;

public class QuizDraftDto : EntityDto<long>
{
    public long LessonDraftId { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public int Order { get; set; }
    public DraftStatus Status { get; set; }
}