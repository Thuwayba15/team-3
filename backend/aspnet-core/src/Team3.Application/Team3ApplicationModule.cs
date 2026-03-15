using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Team3.Authorization;

namespace Team3;

[DependsOn(
    typeof(Team3CoreModule),
    typeof(AbpAutoMapperModule))]
public class Team3ApplicationModule : AbpModule
{
    public override void PreInitialize()
    {
        Configuration.Authorization.Providers.Add<Team3AuthorizationProvider>();
    }

    public override void Initialize()
    {
        var thisAssembly = typeof(Team3ApplicationModule).GetAssembly();

        IocManager.RegisterAssemblyByConvention(thisAssembly);

        Configuration.Modules.AbpAutoMapper().Configurators.Add(
            // Scan the assembly for classes which inherit from AutoMapper.Profile
            cfg => cfg.AddMaps(thisAssembly)
        );
    }
}
