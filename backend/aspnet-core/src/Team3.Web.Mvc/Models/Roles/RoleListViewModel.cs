using Team3.Roles.Dto;
using System.Collections.Generic;

namespace Team3.Web.Models.Roles;

public class RoleListViewModel
{
    public IReadOnlyList<PermissionDto> Permissions { get; set; }
}
