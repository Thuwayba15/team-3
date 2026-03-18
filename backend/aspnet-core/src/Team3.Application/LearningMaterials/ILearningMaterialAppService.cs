using Abp.Application.Services;
using System.Threading.Tasks;
using Team3.LearningMaterials.Dto;

namespace Team3.LearningMaterials;

public interface ILearningMaterialAppService : IApplicationService
{
    Task<UploadTextLearningMaterialOutput> UploadTextMaterialAsync(UploadTextLearningMaterialInput input);
}
