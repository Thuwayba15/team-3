using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Runtime.Session;
using global::Team3.Domain.Students.Team3.Students;
using global::Team3.Domain.Subjects;
using global::Team3.Services.Subjects.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Team3.Services.Subjects
{
    public class SubjectAppService : Team3AppServiceBase, ISubjectAppService
    {
        private readonly IRepository<Subject, Guid> _subjectRepository;
        private readonly IRepository<StudentSubject, Guid> _studentSubjectRepository;

        public SubjectAppService(
            IRepository<Subject, Guid> subjectRepository,
            IRepository<StudentSubject, Guid> studentSubjectRepository)
        {
            _subjectRepository = subjectRepository;
            _studentSubjectRepository = studentSubjectRepository;
        }

        // Get all subjects
        public async Task<ListResultDto<SubjectDto>> GetAllAsync()
        {
            // Ensure .Include is present!
            var subjects = await _subjectRepository.GetAll()
                .Include(s => s.Translations)
                .ToListAsync();

            return new ListResultDto<SubjectDto>(
                ObjectMapper.Map<List<SubjectDto>>(subjects)
            );
        }

        // Enrol in a single subject
        public async Task EnrollInSubjectAsync(Guid subjectId)
        {
            var userId = AbpSession.UserId.Value;

            // Check if already enrolled
            var exists = await _studentSubjectRepository.FirstOrDefaultAsync(
                s => s.UserId == userId && s.SubjectId == subjectId
            );

            if (exists == null)
            {
                await _studentSubjectRepository.InsertAsync(
                    new StudentSubject(userId, subjectId)
                );
            }
        }

        // Get enrolled subjects
        public async Task<ListResultDto<SubjectDto>> GetMySubjectsAsync()
        {
            var userId = AbpSession.GetUserId();

            // Get IDs of subjects the student is enrolled in
            var enrolledSubjectIds = await _studentSubjectRepository.GetAll()
                .Where(ss => ss.UserId == userId)
                .Select(ss => ss.SubjectId)
                .ToListAsync();

            // Fetch the actual subject details for those IDs
            var subjects = await _subjectRepository.GetAll()
                .Include(s => s.Translations)
                .Where(s => enrolledSubjectIds.Contains(s.Id))
                .ToListAsync();

            return new ListResultDto<SubjectDto>(
                ObjectMapper.Map<List<SubjectDto>>(subjects)
            );
        }

        // Enroll in multiple subjects
        public async Task BulkEnrollAsync(List<Guid> subjectIds)
        {
            var userId = AbpSession.GetUserId();

            // Find what they are already enrolled in to avoid duplicates
            var existingEnrollments = await _studentSubjectRepository.GetAll()
                .Where(ss => ss.UserId == userId && subjectIds.Contains(ss.Id))
                .Select(ss => ss.SubjectId)
                .ToListAsync();

            var newSubjectIds = subjectIds.Except(existingEnrollments);

            foreach (var subjectId in newSubjectIds)
            {
                await _studentSubjectRepository.InsertAsync(
                    new StudentSubject(userId, subjectId)
                );
            }
        }

        // Get progress for a subject
        public async Task<double> GetSubjectProgressAsync(Guid subjectId)
        {
            var userId = AbpSession.GetUserId();

            var enrollment = await _studentSubjectRepository.FirstOrDefaultAsync(
                ss => ss.UserId == userId && ss.SubjectId == subjectId
            );

            // Return the progress stored in the StudentSubject entity (default 0)
            return enrollment?.Progress ?? 0;
        }
    }
}