using Abp.Authorization;
using Abp.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using Team3.Academic;
using Team3.Authorization;
using Team3.Authorization.Users;
using Team3.Configuration;
using Team3.LearningMaterials.Dto;
using Team3.Users;

namespace Team3.LearningMaterials;

[AbpAuthorize(PermissionNames.Pages_Admin_Dashboard)]
public class AdminDashboardAppService : Team3AppServiceBase
{
    private readonly IRepository<User, long> _userRepository;
    private readonly IRepository<StudentProfile, long> _studentProfileRepository;
    private readonly IRepository<AdminProfile, long> _adminProfileRepository;
    private readonly IRepository<Subject, Guid> _subjectRepository;
    private readonly IRepository<Topic, Guid> _topicRepository;
    private readonly IRepository<Lesson, Guid> _lessonRepository;

    public AdminDashboardAppService(
        IRepository<User, long> userRepository,
        IRepository<StudentProfile, long> studentProfileRepository,
        IRepository<AdminProfile, long> adminProfileRepository,
        IRepository<Subject, Guid> subjectRepository,
        IRepository<Topic, Guid> topicRepository,
        IRepository<Lesson, Guid> lessonRepository)
    {
        _userRepository = userRepository;
        _studentProfileRepository = studentProfileRepository;
        _adminProfileRepository = adminProfileRepository;
        _subjectRepository = subjectRepository;
        _topicRepository = topicRepository;
        _lessonRepository = lessonRepository;
    }

    public async Task<AdminDashboardSummaryDto> GetSummaryAsync()
    {
        var lifeSciences = await _subjectRepository.FirstOrDefaultAsync(x => x.Name == "Life Sciences" && x.IsActive);
        var promptConfiguration = await SettingManager.GetSettingValueAsync(AppSettingNames.AiTutorGeneralPrompt);
        var tenantId = AbpSession.TenantId;

        var adminCount = await _adminProfileRepository.GetAll()
            .Join(_userRepository.GetAll(), profile => profile.UserId, user => user.Id, (profile, user) => user)
            .Where(x => x.TenantId == tenantId && x.IsActive && !x.IsDeleted)
            .CountAsync();

        var studentCount = await _studentProfileRepository.GetAll()
            .Join(_userRepository.GetAll(), profile => profile.UserId, user => user.Id, (profile, user) => user)
            .Where(x => x.TenantId == tenantId && x.IsActive && !x.IsDeleted)
            .CountAsync();

        var topicCount = 0;
        var lessonCount = 0;

        if (lifeSciences != null)
        {
            topicCount = await _topicRepository.GetAll().Where(x => x.SubjectId == lifeSciences.Id && x.IsActive).CountAsync();
            lessonCount = await _lessonRepository.GetAll()
                .Join(_topicRepository.GetAll(), lesson => lesson.TopicId, topic => topic.Id, (lesson, topic) => new { lesson, topic })
                .Where(x => x.topic.SubjectId == lifeSciences.Id)
                .CountAsync();
        }

        return new AdminDashboardSummaryDto
        {
            AdminCount = adminCount,
            StudentCount = studentCount,
            LifeSciencesTopicCount = topicCount,
            LifeSciencesLessonCount = lessonCount,
            PromptConfigurationReady = !string.IsNullOrWhiteSpace(promptConfiguration)
        };
    }
}
