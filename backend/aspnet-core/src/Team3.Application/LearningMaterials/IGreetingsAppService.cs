using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Team3.LearningMaterials.Dto;

namespace Team3.LearningMaterials
{
    public interface IGreetingsAppService
    {
        Task<string> GreetAsync(UploadTextLearningMaterialInput input);
    }
}
