using Abp.AspNetCore.Mvc.Authorization;
using Team3.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace Team3.Web.Controllers;

[AbpMvcAuthorize]
public class AboutController : Team3ControllerBase
{
    public ActionResult Index()
    {
        return View();
    }
}
