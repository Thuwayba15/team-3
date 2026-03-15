using Microsoft.EntityFrameworkCore;
using System.Data.Common;

namespace Team3.EntityFrameworkCore;

public static class Team3DbContextConfigurer
{
    public static void Configure(DbContextOptionsBuilder<Team3DbContext> builder, string connectionString)
    {
        builder.UseSqlServer(connectionString);
    }

    public static void Configure(DbContextOptionsBuilder<Team3DbContext> builder, DbConnection connection)
    {
        builder.UseSqlServer(connection);
    }
}
