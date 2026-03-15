using Abp.Events.Bus;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Team3.Configuration;
using Team3.EntityFrameworkCore;
using Team3.Migrator.DependencyInjection;
using Castle.MicroKernel.Registration;
using Microsoft.Extensions.Configuration;

namespace Team3.Migrator;

[DependsOn(typeof(Team3EntityFrameworkModule))]
public class Team3MigratorModule : AbpModule
{
    private readonly IConfigurationRoot _appConfiguration;

    public Team3MigratorModule(Team3EntityFrameworkModule abpProjectNameEntityFrameworkModule)
    {
        abpProjectNameEntityFrameworkModule.SkipDbSeed = true;

        _appConfiguration = AppConfigurations.Get(
            typeof(Team3MigratorModule).GetAssembly().GetDirectoryPathOrNull()
        );
    }

    public override void PreInitialize()
    {
        Configuration.DefaultNameOrConnectionString = _appConfiguration.GetConnectionString(
            Team3Consts.ConnectionStringName
        );

        Configuration.BackgroundJobs.IsJobExecutionEnabled = false;
        Configuration.ReplaceService(
            typeof(IEventBus),
            () => IocManager.IocContainer.Register(
                Component.For<IEventBus>().Instance(NullEventBus.Instance)
            )
        );
    }

    public override void Initialize()
    {
        IocManager.RegisterAssemblyByConvention(typeof(Team3MigratorModule).GetAssembly());
        ServiceCollectionRegistrar.Register(IocManager);
    }
}
