using Abp.AspNetCore.Mvc.ViewComponents;

namespace Team3.Web.Views;

public abstract class Team3ViewComponent : AbpViewComponent
{
    protected Team3ViewComponent()
    {
        LocalizationSourceName = Team3Consts.LocalizationSourceName;
    }
}
