using Abp.Authorization;
using Abp.Localization;
using Abp.MultiTenancy;

namespace Team3.Authorization;

public class Team3AuthorizationProvider : AuthorizationProvider
{
    public override void SetPermissions(IPermissionDefinitionContext context)
    {
        context.CreatePermission(PermissionNames.Pages_Users, L("Users"));
        context.CreatePermission(PermissionNames.Pages_Users_Activation, L("UsersActivation"));
        context.CreatePermission(PermissionNames.Pages_Roles, L("Roles"));
        context.CreatePermission(PermissionNames.Pages_Tenants, L("Tenants"), multiTenancySides: MultiTenancySides.Host);
        context.CreatePermission(PermissionNames.Pages_Admin_Dashboard, L("Administration"));
        context.CreatePermission(PermissionNames.Pages_Admin_Curriculum, L("Curriculum"));
        context.CreatePermission(PermissionNames.Pages_Admin_Prompts, L("AIConfiguration"));
        context.CreatePermission(PermissionNames.Pages_Student_Learning, L("Dashboard"));
        context.CreatePermission(PermissionNames.Pages_Student_Diagnostics, L("Quizzes"));
        context.CreatePermission(PermissionNames.Pages_Student_Progress, L("Progress"));
    }

    private static ILocalizableString L(string name)
    {
        return new LocalizableString(name, Team3Consts.LocalizationSourceName);
    }
}
