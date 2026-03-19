using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Team3.Authorization;

using Castle.MicroKernel.Registration;
using FluentValidation;
using Team3.LearningMaterials.Dto;
using Team3.LearningMaterials;
using Team3.Users.Dto;

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

        IocManager.IocContainer.Register(
            Component.For<IValidator<RegisterUserInput>>()
                .ImplementedBy<RegisterUserInputValidator>()
                .LifestyleTransient(),

            Component.For<IValidator<UpdateMyProfileInput>>()
                .ImplementedBy<UpdateMyProfileInputValidator>()
                .LifestyleTransient(),

            Component.For<IValidator<UploadTextLearningMaterialInput>>()
                .ImplementedBy<UploadTextLearningMaterialInputValidator>()
                .LifestyleTransient()

        );

        Configuration.Modules.AbpAutoMapper().Configurators.Add(
            cfg => cfg.AddMaps(thisAssembly)
        );
    }
}
