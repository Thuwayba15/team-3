using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.UI;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Team3.AI.Dto;

namespace Team3.AI;

[AbpAllowAnonymous]
public class AIPromptTemplateAppService : Team3AppServiceBase, IAIPromptTemplateAppService
{
    // Property injection — ABP resolves these automatically
    public IRepository<AIPromptTemplate, Guid> PromptTemplateRepository { get; set; }

    /// <summary>Returns all prompt templates.</summary>
    public async Task<List<AIPromptTemplateResponse>> GetAllAsync()
    {
        var templates = await PromptTemplateRepository.GetAllListAsync();
        return templates.ConvertAll(MapToResponse);
    }

    /// <summary>Returns a single prompt template by ID.</summary>
    public async Task<AIPromptTemplateResponse> GetAsync(Guid id)
    {
        var template = await PromptTemplateRepository.FirstOrDefaultAsync(id)
            ?? throw new UserFriendlyException("Prompt template not found.");

        return MapToResponse(template);
    }

    /// <summary>Creates a new prompt template.</summary>
    public async Task<AIPromptTemplateResponse> CreateAsync(CreateAIPromptTemplateRequest input)
    {
        var template = new AIPromptTemplate(
            Guid.NewGuid(),
            input.Name,
            input.Purpose,
            input.TemplateText,
            input.Temperature);

        await PromptTemplateRepository.InsertAsync(template);
        await CurrentUnitOfWork.SaveChangesAsync();

        return MapToResponse(template);
    }

    /// <summary>Updates an existing prompt template.</summary>
    public async Task<AIPromptTemplateResponse> UpdateAsync(Guid id, UpdateAIPromptTemplateRequest input)
    {
        var template = await PromptTemplateRepository.FirstOrDefaultAsync(id)
            ?? throw new UserFriendlyException("Prompt template not found.");

        template.Update(input.Name, input.Purpose, input.TemplateText, input.Temperature);

        await PromptTemplateRepository.UpdateAsync(template);
        await CurrentUnitOfWork.SaveChangesAsync();

        return MapToResponse(template);
    }

    /// <summary>Deletes a prompt template by ID.</summary>
    public async Task DeleteAsync(Guid id)
    {
        var template = await PromptTemplateRepository.FirstOrDefaultAsync(id)
            ?? throw new UserFriendlyException("Prompt template not found.");

        await PromptTemplateRepository.DeleteAsync(template);
    }

    private static AIPromptTemplateResponse MapToResponse(AIPromptTemplate template) =>
        new()
        {
            Id = template.Id,
            Name = template.Name,
            Purpose = template.Purpose,
            TemplateText = template.TemplateText,
            Temperature = template.Temperature
        };
}
