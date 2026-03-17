using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Abp.Domain.Repositories;
using Abp.UI;
using Abp.Domain.Uow;
using Team3.Authorization;
using Team3.Curriculum.Entities;
using Team3.Curriculum.Services.Interfaces;
using Team3.Curriculum.Enums;
using Abp.Authorization;
using System;

namespace Team3.Web.Host.Controllers
{
    [Route("api/curriculum")]
    [ApiController]
    [AbpAuthorize(PermissionNames.Pages_Curriculum)]
    public class CurriculumController : ControllerBase
    {
        private readonly IDocumentStorageService _documentStorageService;
        private readonly IRepository<CurriculumSourceDocument, long> _sourceDocumentRepository;
        private readonly IUnitOfWorkManager _unitOfWorkManager;

        public CurriculumController(
            IDocumentStorageService documentStorageService,
            IRepository<CurriculumSourceDocument, long> sourceDocumentRepository,
            IUnitOfWorkManager unitOfWorkManager)
        {
            _documentStorageService = documentStorageService;
            _sourceDocumentRepository = sourceDocumentRepository;
            _unitOfWorkManager = unitOfWorkManager;
        }

        [HttpPost("upload")]
        [Consumes("multipart/form-data")]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> UploadSourceDocument(
            [FromForm] string subjectName,
            [FromForm] string gradeLevel,
            [FromForm] string documentType,
            [FromForm] Microsoft.AspNetCore.Http.IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new UserFriendlyException("No file uploaded.");
            }

            if (!Enum.TryParse<SourceDocumentType>(documentType, true, out var docType))
            {
                throw new UserFriendlyException("Invalid document type.");
            }

            // Store the file
            var filePath = await _documentStorageService.StoreFileAsync(file, subjectName, gradeLevel);

            // Create source document entity
            var sourceDocument = new CurriculumSourceDocument
            {
                SubjectName = subjectName,
                GradeLevel = gradeLevel,
                DocumentType = docType,
                FilePath = filePath,
                OriginalFileName = file.FileName,
                FileSize = file.Length,
                ContentType = file.ContentType
            };

            var savedDocument = await _sourceDocumentRepository.InsertAsync(sourceDocument);
            await _unitOfWorkManager.Current.SaveChangesAsync();

            return Ok(new
            {
                Id = savedDocument.Id,
                SubjectName = savedDocument.SubjectName,
                GradeLevel = savedDocument.GradeLevel,
                FilePath = savedDocument.FilePath,
                OriginalFileName = savedDocument.OriginalFileName,
                FileSize = savedDocument.FileSize
            });
        }
    }
}