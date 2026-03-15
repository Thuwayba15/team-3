using Team3.Roles.Dto;
using System.Collections.Generic;

namespace Team3.Web.Models.Common;

public interface IPermissionsEditViewModel
{
    List<FlatPermissionDto> Permissions { get; set; }
}