using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Castle.MicroKernel.Registration;
using FluentValidation;
using System.Linq;
using Team3.Authorization;
using Team3.Domain.Subjects;
using Team3.Services.Subjects.Dto;
using Team3.Users.Dto;
using System.Globalization;

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
                .LifestyleTransient()
        );

        Configuration.Modules.AbpAutoMapper().Configurators.Add(cfg =>
        {
            cfg.AddMaps(thisAssembly);

            cfg.CreateMap<Subject, SubjectDto>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src =>
                    // Check current culture first
                    src.Translations.Any(t => t.Language == CultureInfo.CurrentUICulture.Name)
                        ? src.Translations.First(t => t.Language == CultureInfo.CurrentUICulture.Name).Name
                        // Else try two-letter culture (e.g. "en")
                        : src.Translations.Any(t => t.Language == CultureInfo.CurrentUICulture.TwoLetterISOLanguageName)
                            ? src.Translations.First(t => t.Language == CultureInfo.CurrentUICulture.TwoLetterISOLanguageName).Name
                            // Else fallback to the first one available, or empty string if none exist
                            : src.Translations.Select(t => t.Name).FirstOrDefault() ?? string.Empty
                ))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src =>
                    src.Translations.Any(t => t.Language == CultureInfo.CurrentUICulture.Name)
                        ? src.Translations.First(t => t.Language == CultureInfo.CurrentUICulture.Name).Description
                        : src.Translations.Any(t => t.Language == CultureInfo.CurrentUICulture.TwoLetterISOLanguageName)
                            ? src.Translations.First(t => t.Language == CultureInfo.CurrentUICulture.TwoLetterISOLanguageName).Description
                            : src.Translations.Select(t => t.Description).FirstOrDefault() ?? string.Empty
                ));
        });
    }
}
