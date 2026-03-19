using Abp.Application.Services;
using Abp.Authorization;
using Abp.IdentityFramework;
using Abp.Runtime.Session;
using Microsoft.AspNetCore.Identity;
using System;
using System.Threading.Tasks;
using Team3.Authorization.Users;
using Team3.MultiTenancy;

namespace Team3;

/// <summary>
/// Derive your application services from this class.
/// </summary>
public abstract class Team3AppServiceBase : ApplicationService
{
    public TenantManager TenantManager { get; set; }

    public UserManager UserManager { get; set; }

    protected Team3AppServiceBase()
    {
        LocalizationSourceName = Team3Consts.LocalizationSourceName;
    }

    protected virtual async Task<User> GetCurrentUserAsync()
    {
        var user = await UserManager.FindByIdAsync(AbpSession.GetUserId().ToString());
        if (user == null)
        {
            throw new Exception("There is no current user!");
        }

        return user;
    }

    protected virtual Task<Tenant> GetCurrentTenantAsync()
    {
        return TenantManager.GetByIdAsync(AbpSession.GetTenantId());
    }

    protected virtual void CheckErrors(IdentityResult identityResult)
    {
        identityResult.CheckErrors(LocalizationManager);
    }

    protected virtual async Task<User> EnsureCurrentUserInRoleAsync(string roleName)
    {
        var user = await GetCurrentUserAsync();
        var isInRole = await UserManager.IsInRoleAsync(user, roleName);
        if (!isInRole)
        {
            throw new AbpAuthorizationException($"Only {roleName} users can perform this action.");
        }

        return user;
    }
}
