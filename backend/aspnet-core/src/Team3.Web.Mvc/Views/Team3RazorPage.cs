using Abp.AspNetCore.Mvc.Views;
using Abp.Runtime.Session;
using Microsoft.AspNetCore.Mvc.Razor.Internal;

namespace Team3.Web.Views;

public abstract class Team3RazorPage<TModel> : AbpRazorPage<TModel>
{
    [RazorInject]
    public IAbpSession AbpSession { get; set; }

    protected Team3RazorPage()
    {
        LocalizationSourceName = Team3Consts.LocalizationSourceName;
    }
}
