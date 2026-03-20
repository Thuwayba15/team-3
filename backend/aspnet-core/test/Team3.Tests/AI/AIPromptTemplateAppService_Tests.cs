using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using Shouldly;
using System;
using System.Threading.Tasks;
using Team3.AI;
using Team3.AI.Dto;
using Xunit;

namespace Team3.Tests.AI;

public class AIPromptTemplateAppService_Tests : Team3TestBase
{
    private readonly IAIPromptTemplateAppService _aiPromptTemplateAppService;

    public AIPromptTemplateAppService_Tests()
    {
        _aiPromptTemplateAppService = Resolve<IAIPromptTemplateAppService>();
    }

    [Fact]
    public async Task GetAllAsync_Should_Return_All_Templates()
    {
        // Arrange
        await CreateTestTemplateAsync("Test Template 1", "Test purpose 1");
        await CreateTestTemplateAsync("Test Template 2", "Test purpose 2");

        // Act
        var result = await _aiPromptTemplateAppService.GetAllAsync();

        // Assert
        result.ShouldNotBeNull();
        result.Count.ShouldBeGreaterThanOrEqualTo(2);
        result.ShouldContain(t => t.Name == "Test Template 1");
        result.ShouldContain(t => t.Name == "Test Template 2");
    }

    [Fact]
    public async Task GetAsync_Should_Return_Template_By_Id()
    {
        // Arrange
        var templateId = await CreateTestTemplateAsync("Test Template", "Test purpose");

        // Act
        var result = await _aiPromptTemplateAppService.GetAsync(templateId);

        // Assert
        result.ShouldNotBeNull();
        result.Id.ShouldBe(templateId);
        result.Name.ShouldBe("Test Template");
        result.Purpose.ShouldBe("Test purpose");
    }

    [Fact]
    public async Task GetAsync_Should_Fail_With_Invalid_Id()
    {
        // Arrange
        var invalidId = Guid.NewGuid();

        // Act & Assert
        await Should.ThrowAsync<UserFriendlyException>(async () =>
        {
            await _aiPromptTemplateAppService.GetAsync(invalidId);
        });
    }

    [Fact]
    public async Task CreateAsync_Should_Create_New_Template()
    {
        // Arrange
        var input = new CreateAIPromptTemplateRequest
        {
            Name = "New Test Template",
            Purpose = "Test purpose for new template",
            TemplateText = "This is a test template with {placeholder}",
            Temperature = 0.7
        };

        // Act
        var result = await _aiPromptTemplateAppService.CreateAsync(input);

        // Assert
        result.ShouldNotBeNull();
        result.Id.ShouldNotBe(Guid.Empty);
        result.Name.ShouldBe("New Test Template");
        result.Purpose.ShouldBe("Test purpose for new template");
        result.TemplateText.ShouldBe("This is a test template with {placeholder}");
        result.Temperature.ShouldBe((double)0.7m);

        // Verify template was created in database
        await UsingDbContextAsync(async context =>
        {
            var template = await context.AIPromptTemplates.FirstOrDefaultAsync(t => t.Id == result.Id);
            template.ShouldNotBeNull();
            template.Name.ShouldBe("New Test Template");
        });
    }

    [Fact]
    public async Task UpdateAsync_Should_Modify_Existing_Template()
    {
        // Arrange
        var templateId = await CreateTestTemplateAsync("Original Name", "Original purpose");
        var updateInput = new UpdateAIPromptTemplateRequest
        {
            Name = "Updated Name",
            Purpose = "Updated purpose",
            TemplateText = "Updated template text",
            Temperature = (double)0.8m
        };

        // Act
        var result = await _aiPromptTemplateAppService.UpdateAsync(templateId, updateInput);

        // Assert
        result.ShouldNotBeNull();
        result.Id.ShouldBe(templateId);
        result.Name.ShouldBe("Updated Name");
        result.Purpose.ShouldBe("Updated purpose");
        result.TemplateText.ShouldBe("Updated template text");
        result.Temperature.ShouldBe((double)0.8m);

        // Verify template was updated in database
        await UsingDbContextAsync(async context =>
        {
            var template = await context.AIPromptTemplates.FirstOrDefaultAsync(t => t.Id == templateId);
            template.ShouldNotBeNull();
            template.Name.ShouldBe("Updated Name");
        });
    }

    [Fact]
    public async Task UpdateAsync_Should_Fail_With_Invalid_Id()
    {
        // Arrange
        var invalidId = Guid.NewGuid();
        var updateInput = new UpdateAIPromptTemplateRequest
        {
            Name = "Updated Name",
            Purpose = "Updated purpose",
            TemplateText = "Updated template text",
            Temperature = (double)0.8m
        };

        // Act & Assert
        await Should.ThrowAsync<UserFriendlyException>(async () =>
        {
            await _aiPromptTemplateAppService.UpdateAsync(invalidId, updateInput);
        });
    }

    [Fact]
    public async Task DeleteAsync_Should_Remove_Template()
    {
        // Arrange
        var templateId = await CreateTestTemplateAsync("Template to Delete", "Purpose for deletion");

        // Act
        await _aiPromptTemplateAppService.DeleteAsync(templateId);

        // Assert
        await UsingDbContextAsync(async context =>
        {
            var template = await context.AIPromptTemplates.FirstOrDefaultAsync(t => t.Id == templateId);
            template.ShouldBeNull();
        });
    }

    [Fact]
    public async Task DeleteAsync_Should_Fail_With_Invalid_Id()
    {
        // Arrange
        var invalidId = Guid.NewGuid();

        // Act & Assert
        await Should.ThrowAsync<UserFriendlyException>(async () =>
        {
            await _aiPromptTemplateAppService.DeleteAsync(invalidId);
        });
    }

    private async Task<Guid> CreateTestTemplateAsync(string name, string purpose)
    {
        return await UsingDbContextAsync(async context =>
        {
            var template = new AIPromptTemplate(
                Guid.NewGuid(),
                name,
                purpose,
                "Test template text with {placeholder}",
                0.5
            );
            context.AIPromptTemplates.Add(template);
            await context.SaveChangesAsync();
            return template.Id;
        });
    }
}
