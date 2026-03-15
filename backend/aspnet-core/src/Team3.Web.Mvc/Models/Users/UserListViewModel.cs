using Team3.Roles.Dto;
using System.Collections.Generic;

namespace Team3.Web.Models.Users;

public class UserListViewModel
{
    public IReadOnlyList<RoleDto> Roles { get; set; }
}
