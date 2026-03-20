using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Team3.Academic;
using Team3.Configuration;
using Team3.LearningMaterials.Dto;

namespace Team3.LearningMaterials.Subjects
{
    [AbpAuthorize]
    public class StudentSubjectAppService : Team3AppServiceBase, IStudentSubjectAppService
    {
        public IRepository<Subject, Guid> SubjectRepository { get; set; }
        public IRepository<Topic, Guid> TopicRepository { get; set; }
        public IRepository<Lesson, Guid> LessonRepository { get; set; }
        public IRepository<LessonTranslation, Guid> LessonTranslationRepository { get; set; }
        public IRepository<StudentEnrollment, Guid> EnrollmentRepository { get; set; }
        public IRepository<StudentProgress, Guid> ProgressRepository { get; set; }
        public IRepository<Language, Guid> LanguageRepository { get; set; }

        // GET /subjects
        public async Task<List<SubjectDto>> GetAllSubjectsAsync()
        {
            try
            {
                var subjects = await SubjectRepository.GetAllListAsync(x => x.IsActive);
                return subjects.Select(MapSubjectDto).ToList();
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException($"DEBUG: {ex.GetType().Name}: {ex.Message}");
            }
        }

        // GET /my-subjects — subjects the logged-in student is enrolled in
        public async Task<List<SubjectDto>> GetMySubjectsAsync()
        {
            try
            {
                var studentId = AbpSession.UserId
                    ?? throw new UserFriendlyException("You must be logged in.");

                var enrollments = await EnrollmentRepository.GetAllListAsync(
                    x => x.StudentId == studentId && x.IsActive);

                var subjectIds = enrollments.Select(x => x.SubjectId).ToHashSet();

                var subjects = await SubjectRepository.GetAllListAsync(
                    x => subjectIds.Contains(x.Id) && x.IsActive);

                return subjects.Select(MapSubjectDto).ToList();
            }
            catch (UserFriendlyException) { throw; }
            catch (Exception ex)
            {
                throw new UserFriendlyException($"DEBUG: {ex.GetType().Name}: {ex.Message}");
            }
        }

        // POST /bulk-enroll — enroll student in multiple subjects at once
        public async Task<BulkEnrollOutput> BulkEnrollAsync(BulkEnrollInput input)
        {
            try
            {
                var studentId = AbpSession.UserId
                    ?? throw new UserFriendlyException("You must be logged in.");

                var output = new BulkEnrollOutput();

                foreach (var subjectId in input.SubjectIds)
                {
                    var subject = await SubjectRepository.FirstOrDefaultAsync(subjectId);
                    if (subject == null)
                    {
                        output.NotFoundSubjectIds.Add(subjectId);
                        continue;
                    }

                    var existing = await EnrollmentRepository.FirstOrDefaultAsync(
                        x => x.StudentId == studentId && x.SubjectId == subjectId);

                    if (existing != null)
                    {
                        if (!existing.IsActive) existing.Activate();
                        output.AlreadyEnrolledSubjectIds.Add(subjectId);
                        continue;
                    }

                    var enrollment = new StudentEnrollment(Guid.NewGuid(), studentId, subjectId);
                    await EnrollmentRepository.InsertAsync(enrollment);

                    // Create a blank progress record for this subject
                    var progress = new StudentProgress(Guid.NewGuid(), studentId, subjectId);
                    await ProgressRepository.InsertAsync(progress);

                    output.EnrolledSubjectIds.Add(subjectId);
                }

                await CurrentUnitOfWork.SaveChangesAsync();
                return output;
            }
            catch (UserFriendlyException) { throw; }
            catch (Exception ex)
            {
                throw new UserFriendlyException($"DEBUG: {ex.GetType().Name}: {ex.Message}");
            }
        }

        // GET /subject-progress/{subjectId}
        public async Task<StudentProgressDto> GetSubjectProgressAsync(Guid subjectId)
        {
            try
            {
                var studentId = AbpSession.UserId
                    ?? throw new UserFriendlyException("You must be logged in.");

                var subject = await SubjectRepository.FirstOrDefaultAsync(subjectId)
                    ?? throw new UserFriendlyException("Subject not found.");

                var progress = await ProgressRepository.FirstOrDefaultAsync(
                    x => x.StudentId == studentId && x.SubjectId == subjectId);

                if (progress == null)
                    throw new UserFriendlyException("No progress record found. Please enroll in this subject first.");

                return new StudentProgressDto
                {
                    Id = progress.Id,
                    StudentId = progress.StudentId,
                    SubjectId = progress.SubjectId,
                    SubjectName = subject.Name,
                    MasteryScore = progress.MasteryScore,
                    ProgressStatus = progress.ProgressStatus,
                    LastAssessmentScore = progress.LastAssessmentScore,
                    AttemptCount = progress.AttemptCount,
                    NeedsIntervention = progress.NeedsIntervention,
                    UpdatedAt = progress.UpdatedAt,
                    CompletedLessonCount = progress.CompletedLessonCount,
                    RevisionNeeded = progress.RevisionNeeded
                };
            }
            catch (UserFriendlyException) { throw; }
            catch (Exception ex)
            {
                throw new UserFriendlyException($"DEBUG: {ex.GetType().Name}: {ex.Message}");
            }
        }

        // GET /topics/{subjectId}
        public async Task<List<TopicDto>> GetTopicsBySubjectAsync(Guid subjectId)
        {
            try
            {
                var subject = await SubjectRepository.FirstOrDefaultAsync(subjectId)
                    ?? throw new UserFriendlyException("Subject not found.");

                var topics = await TopicRepository.GetAllListAsync(
                    x => x.SubjectId == subjectId && x.IsActive);

                return topics
                    .OrderBy(x => x.SequenceOrder)
                    .Select(t => new TopicDto
                    {
                        Id = t.Id,
                        SubjectId = t.SubjectId,
                        Name = t.Name,
                        Description = t.Description,
                        DifficultyLevel = t.DifficultyLevel,
                        SequenceOrder = t.SequenceOrder,
                        IsActive = t.IsActive
                    }).ToList();
            }
            catch (UserFriendlyException) { throw; }
            catch (Exception ex)
            {
                throw new UserFriendlyException($"DEBUG: {ex.GetType().Name}: {ex.Message}");
            }
        }

        // GET /lessons/{topicId}
        public async Task<List<LessonSummaryDto>> GetLessonsByTopicAsync(Guid topicId)
        {
            try
            {
                var topic = await TopicRepository.FirstOrDefaultAsync(topicId)
                    ?? throw new UserFriendlyException("Topic not found.");

                var lessons = await LessonRepository.GetAllListAsync(
                    x => x.TopicId == topicId && x.IsPublished);

                return lessons.Select(l => new LessonSummaryDto
                {
                    Id = l.Id,
                    TopicId = l.TopicId,
                    Title = l.Title,
                    DifficultyLevel = l.DifficultyLevel,
                    EstimatedMinutes = l.EstimatedMinutes,
                    IsPublished = l.IsPublished
                }).ToList();
            }
            catch (UserFriendlyException) { throw; }
            catch (Exception ex)
            {
                throw new UserFriendlyException($"DEBUG: {ex.GetType().Name}: {ex.Message}");
            }
        }

        // GET /lesson/{lessonId}
        public async Task<LessonDetailDto> GetLessonAsync(Guid lessonId)
        {
            try
            {
                var lesson = await LessonRepository.FirstOrDefaultAsync(lessonId)
                    ?? throw new UserFriendlyException("Lesson not found.");

                var translations = await LessonTranslationRepository.GetAllListAsync(
                    x => x.LessonId == lessonId);

                var languages = await LanguageRepository.GetAllListAsync();
                var languageMap = languages.ToDictionary(x => x.Id);

                return new LessonDetailDto
                {
                    Id = lesson.Id,
                    TopicId = lesson.TopicId,
                    Title = lesson.Title,
                    Summary = lesson.Summary,
                    LearningObjective = lesson.LearningObjective,
                    RevisionSummary = lesson.RevisionSummary,
                    DifficultyLevel = lesson.DifficultyLevel,
                    EstimatedMinutes = lesson.EstimatedMinutes,
                    IsPublished = lesson.IsPublished,
                    Translations = translations.Select(t => new LessonTranslationSummaryDto
                    {
                        LanguageCode = languageMap.TryGetValue(t.LanguageId, out var lang) ? lang.Code : t.LanguageId.ToString(),
                        LanguageName = languageMap.TryGetValue(t.LanguageId, out var lang2) ? lang2.Name : "Unknown",
                        Title = t.Title,
                        Content = t.Content,
                        Summary = t.Summary,
                        Examples = t.Examples,
                        RevisionSummary = t.RevisionSummary,
                        IsAutoTranslated = t.IsAutoTranslated
                    }).ToList()
                };
            }
            catch (UserFriendlyException) { throw; }
            catch (Exception ex)
            {
                throw new UserFriendlyException($"DEBUG: {ex.GetType().Name}: {ex.Message}");
            }
        }

        private static SubjectDto MapSubjectDto(Subject s) => new()
        {
            Id = s.Id,
            Name = s.Name,
            Description = s.Description,
            GradeLevel = s.GradeLevel,
            IsActive = s.IsActive
        };
    }
}
