using Abp.Application.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Team3.AI.Dto;

namespace Team3.AI;

public interface IAIPromptTemplateAppService : IApplicationService
{
    /// <summary>Returns all prompt templates.</summary>
    Task<List<AIPromptTemplateResponse>> GetAllAsync();

    /// <summary>Returns a single prompt template by ID.</summary>
    Task<AIPromptTemplateResponse> GetAsync(Guid id);

    /// <summary>Creates a new prompt template.</summary>
    Task<AIPromptTemplateResponse> CreateAsync(CreateAIPromptTemplateRequest input);

    /// <summary>Updates an existing prompt template.</summary>
    Task<AIPromptTemplateResponse> UpdateAsync(Guid id, UpdateAIPromptTemplateRequest input);

    /// <summary>Deletes a prompt template using the ID its associated with.</summary>
    Task DeleteAsync(Guid id);
}
