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

        context.CreatePermission(PermissionNames.Pages_Curriculum, L("Curriculum"));
        context.CreatePermission(PermissionNames.Pages_Curriculum_Upload, L("CurriculumUpload"));
        context.CreatePermission(PermissionNames.Pages_Curriculum_Extract, L("CurriculumExtract"));
        context.CreatePermission(PermissionNames.Pages_Curriculum_Publish, L("CurriculumPublish"));
    }

    private static ILocalizableString L(string name)
    {
        return new LocalizableString(name, Team3Consts.LocalizationSourceName);
    }
}
