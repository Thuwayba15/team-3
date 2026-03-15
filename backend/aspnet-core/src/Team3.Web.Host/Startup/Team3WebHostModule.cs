using Abp.Modules;
using Abp.Reflection.Extensions;
using Team3.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace Team3.Web.Host.Startup
{
    [DependsOn(
       typeof(Team3WebCoreModule))]
    public class Team3WebHostModule : AbpModule
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public Team3WebHostModule(IWebHostEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(Team3WebHostModule).GetAssembly());
        }
    }
}
