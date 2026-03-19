using Abp.Authorization;
using Abp.Authorization.Users;
using Abp.Configuration;
using Abp.Configuration.Startup;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Zero.Configuration;
using Team3.Authorization.Roles;
using Team3.Authorization.Users;
using Team3.MultiTenancy;
using Microsoft.AspNetCore.Identity;

namespace Team3.Authorization;

public class LogInManager : AbpLogInManager<Tenant, Role, User>
{
    public LogInManager(
        UserManager userManager,
        IMultiTenancyConfig multiTenancyConfig,
        IRepository<Tenant> tenantRepository,
        IUnitOfWorkManager unitOfWorkManager,
        ISettingManager settingManager,
        IRepository<UserLoginAttempt, long> userLoginAttemptRepository,
        IUserManagementConfig userManagementConfig,
        IIocResolver iocResolver,
        IPasswordHasher<User> passwordHasher,
        RoleManager roleManager,
        UserClaimsPrincipalFactory claimsPrincipalFactory)
        : base(
              userManager,
              multiTenancyConfig,
              tenantRepository,
              unitOfWorkManager,
              settingManager,
              userLoginAttemptRepository,
              userManagementConfig,
              iocResolver,
              passwordHasher,
              roleManager,
              claimsPrincipalFactory)
    {
    }
}
