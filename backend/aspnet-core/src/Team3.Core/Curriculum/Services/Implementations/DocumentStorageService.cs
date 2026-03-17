using System;
using System.IO;
using System.Threading.Tasks;
using Abp.Dependency;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Team3.Curriculum.Services.Interfaces;

namespace Team3.Curriculum.Services.Implementations;

/// <summary>
/// Handles storage of uploaded curriculum documents.
/// </summary>
public class DocumentStorageService : IDocumentStorageService, ITransientDependency
{
    private readonly IHostingEnvironment _hostingEnvironment;

    public DocumentStorageService(IHostingEnvironment hostingEnvironment)
    {
        _hostingEnvironment = hostingEnvironment;
    }

    public async Task<string> StoreFileAsync(IFormFile file, string subjectName, string gradeLevel)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("File is required");

        // Create safe directory structure
        var uploadsDir = Path.Combine(_hostingEnvironment.WebRootPath ?? _hostingEnvironment.ContentRootPath, "App_Data", "Uploads", "Curriculum");
        Directory.CreateDirectory(uploadsDir);

        // Generate safe filename
        var safeSubject = SanitizeFileName(subjectName);
        var safeGrade = SanitizeFileName(gradeLevel);
        var extension = Path.GetExtension(file.FileName);
        var fileName = $"{safeSubject}_{safeGrade}_{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsDir, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Return relative path
        return Path.Combine("App_Data", "Uploads", "Curriculum", fileName).Replace("\\", "/");
    }

    private string SanitizeFileName(string name)
    {
        return string.Join("_", name.Split(Path.GetInvalidFileNameChars(), StringSplitOptions.RemoveEmptyEntries));
    }
}