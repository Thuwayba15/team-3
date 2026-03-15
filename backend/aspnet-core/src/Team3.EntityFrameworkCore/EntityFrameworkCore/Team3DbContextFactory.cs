using Team3.Configuration;
using Team3.Web;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Team3.EntityFrameworkCore;

/* This class is needed to run "dotnet ef ..." commands from command line on development. Not used anywhere else */
public class Team3DbContextFactory : IDesignTimeDbContextFactory<Team3DbContext>
{
    public Team3DbContext CreateDbContext(string[] args)
    {
        var builder = new DbContextOptionsBuilder<Team3DbContext>();

        /*
         You can provide an environmentName parameter to the AppConfigurations.Get method. 
         In this case, AppConfigurations will try to read appsettings.{environmentName}.json.
         Use Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") method or from string[] args to get environment if necessary.
         https://docs.microsoft.com/en-us/ef/core/cli/dbcontext-creation?tabs=dotnet-core-cli#args
         */
        var configuration = AppConfigurations.Get(WebContentDirectoryFinder.CalculateContentRootFolder());

        Team3DbContextConfigurer.Configure(builder, configuration.GetConnectionString(Team3Consts.ConnectionStringName));

        return new Team3DbContext(builder.Options);
    }
}
