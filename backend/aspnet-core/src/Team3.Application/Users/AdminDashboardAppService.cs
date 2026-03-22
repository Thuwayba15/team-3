using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using Team3.Authorization;
using Team3.Authorization.Roles;
using Team3.Authorization.Users;
using Team3.Configuration;
using Team3.Users.Dto;

namespace Team3.Users;

[AbpAuthorize(PermissionNames.Pages_Users)]
public class AdminDashboardAppService : Team3AppServiceBase, IAdminDashboardAppService
{
    private static readonly string[] ROLE_PRIORITY = [UserRoleNames.Admin, UserRoleNames.Tutor, UserRoleNames.Parent, UserRoleNames.Student];

    private readonly IRepository<User, long> _userRepository;
    private readonly IRepository<Role> _roleRepository;
    private readonly IRepository<Language, Guid> _languageRepository;

    public AdminDashboardAppService(
        IRepository<User, long> userRepository,
        IRepository<Role> roleRepository,
        IRepository<Language, Guid> languageRepository)
    {
        _userRepository = userRepository;
        _roleRepository = roleRepository;
        _languageRepository = languageRepository;
    }

    public async Task<AdminDashboardSummaryDto> GetSummaryAsync()
    {
        var totalUsers = await _userRepository.GetAll()
            .AsNoTracking()
            .CountAsync();

        var activeUsers = await _userRepository.GetAll()
            .AsNoTracking()
            .CountAsync(user => user.IsActive);

        var userRoles = await _userRepository.GetAll()
            .AsNoTracking()
            .SelectMany(user => user.Roles.Select(role => new
            {
                user.Id,
                role.RoleId,
            }))
            .ToListAsync();

        var roles = await _roleRepository.GetAll()
            .AsNoTracking()
            .Select(role => new
            {
                role.Id,
                role.Name,
                role.NormalizedName,
            })
            .ToListAsync();

        var supportedLanguages = await _languageRepository.GetAll()
            .AsNoTracking()
            .CountAsync(language => !language.IsDeleted);

        var roleNameById = roles.ToDictionary(
            role => role.Id,
            role => !string.IsNullOrWhiteSpace(role.Name) ? role.Name : role.NormalizedName);

        var distributionCounts = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);

        foreach (var userGroup in userRoles.GroupBy(userRole => userRole.Id))
        {
            var roleNames = userGroup
                .Select(userRole => userRole.RoleId)
                .Select(roleId => roleNameById.GetValueOrDefault(roleId))
                .Where(roleName => !string.IsNullOrWhiteSpace(roleName))
                .ToList();

            var primaryRole = ResolvePrimaryRole(roleNames);
            distributionCounts[primaryRole] = distributionCounts.GetValueOrDefault(primaryRole) + 1;
        }

        var assignedUsers = userRoles
            .Select(userRole => userRole.Id)
            .Distinct()
            .Count();

        var unassignedUsers = totalUsers - assignedUsers;
        if (unassignedUsers > 0)
        {
            distributionCounts["Unassigned"] = distributionCounts.GetValueOrDefault("Unassigned") + unassignedUsers;
        }

        return new AdminDashboardSummaryDto
        {
            TotalUsers = totalUsers,
            ActiveUsers = activeUsers,
            SupportedLanguages = supportedLanguages,
            RoleDistribution = distributionCounts
                .OrderByDescending(entry => entry.Value)
                .Select(entry => new AdminRoleDistributionDto
                {
                    RoleName = entry.Key,
                    Count = entry.Value,
                    Percent = totalUsers == 0 ? 0 : (int)Math.Round((double)entry.Value * 100 / totalUsers, MidpointRounding.AwayFromZero),
                })
                .ToList(),
        };
    }

    private static string ResolvePrimaryRole(IEnumerable<string> roleNames)
    {
        var normalizedNames = roleNames
            .Select(roleName => roleName.Trim())
            .Where(roleName => roleName.Length > 0)
            .ToList();

        foreach (var supportedRole in ROLE_PRIORITY)
        {
            var matchedRole = normalizedNames.FirstOrDefault(roleName => string.Equals(roleName, supportedRole, StringComparison.OrdinalIgnoreCase));
            if (!string.IsNullOrWhiteSpace(matchedRole))
            {
                return matchedRole;
            }
        }

        return normalizedNames.FirstOrDefault() ?? "Unassigned";
    }
}
