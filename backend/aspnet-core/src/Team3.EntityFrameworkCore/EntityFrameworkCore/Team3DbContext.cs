using Abp.Zero.EntityFrameworkCore;
using Team3.Authorization.Roles;
using Team3.Authorization.Users;
using Team3.MultiTenancy;
using Microsoft.EntityFrameworkCore;

namespace Team3.EntityFrameworkCore;

public class Team3DbContext : AbpZeroDbContext<Tenant, Role, User, Team3DbContext>
{
    /* Define a DbSet for each entity of the application */

    public Team3DbContext(DbContextOptions<Team3DbContext> options)
        : base(options)
    {
    }
}
