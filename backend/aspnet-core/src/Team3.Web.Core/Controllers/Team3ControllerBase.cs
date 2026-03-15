using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace Team3.Controllers
{
    public abstract class Team3ControllerBase : AbpController
    {
        protected Team3ControllerBase()
        {
            LocalizationSourceName = Team3Consts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
