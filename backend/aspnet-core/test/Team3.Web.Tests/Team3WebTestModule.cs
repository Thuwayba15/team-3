using Abp.AspNetCore;
using Abp.AspNetCore.TestBase;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Team3.EntityFrameworkCore;
using Team3.Web.Startup;
using Microsoft.AspNetCore.Mvc.ApplicationParts;

namespace Team3.Web.Tests;

[DependsOn(
    typeof(Team3WebMvcModule),
    typeof(AbpAspNetCoreTestBaseModule)
)]
public class Team3WebTestModule : AbpModule
{
    public Team3WebTestModule(Team3EntityFrameworkModule abpProjectNameEntityFrameworkModule)
    {
        abpProjectNameEntityFrameworkModule.SkipDbContextRegistration = true;
    }

    public override void PreInitialize()
    {
        Configuration.UnitOfWork.IsTransactional = false; //EF Core InMemory DB does not support transactions.
    }

    public override void Initialize()
    {
        IocManager.RegisterAssemblyByConvention(typeof(Team3WebTestModule).GetAssembly());
    }

    public override void PostInitialize()
    {
        IocManager.Resolve<ApplicationPartManager>()
            .AddApplicationPartsIfNotAddedBefore(typeof(Team3WebMvcModule).Assembly);
    }
}