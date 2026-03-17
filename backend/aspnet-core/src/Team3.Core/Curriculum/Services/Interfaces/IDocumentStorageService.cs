using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Team3.Curriculum.Entities;

namespace Team3.Curriculum.Services.Interfaces;

/// <summary>
/// Handles storage of uploaded curriculum documents.
/// </summary>
public interface IDocumentStorageService
{
    /// <summary>
    /// Stores the uploaded file and returns the file path.
    /// </summary>
    Task<string> StoreFileAsync(IFormFile file, string subjectName, string gradeLevel);
}