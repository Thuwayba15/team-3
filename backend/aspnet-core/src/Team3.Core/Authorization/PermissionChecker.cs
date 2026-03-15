using Abp.Authorization;
using Team3.Authorization.Roles;
using Team3.Authorization.Users;

namespace Team3.Authorization;

public class PermissionChecker : PermissionChecker<Role, User>
{
    public PermissionChecker(UserManager userManager)
        : base(userManager)
    {
    }
}
