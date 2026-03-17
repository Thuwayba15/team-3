using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Team3.Services.Subjects
{
    using Abp.Application.Services.Dto;
    using Abp.Domain.Repositories;
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

            // GET: /api/services/app/Subject/GetAllAsync
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

            // POST: /api/services/app/Subject/EnrollInSubjectAsync
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
        }
    }

}
