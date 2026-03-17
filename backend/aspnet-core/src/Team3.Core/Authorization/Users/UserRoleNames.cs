using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Team3.Authorization.Users
{
    //platform role names. These roles are used by the authorization system to identify user permissions and access levels within the application. Each role corresponds to a specific set of permissions that define what actions a user can perform and what resources they can access. By defining these role names as constants, we can ensure consistency throughout the application when referring to user roles, making it easier to manage and maintain the authorization logic.
    public static class UserRoleNames
    {
        public const string Student = "Student";
        public const string Tutor = "Tutor";
        public const string Parent = "Parent";
        public const string Admin = "Admin";

        public static readonly string[] All =
        [
            Student,
        Tutor,
        Parent,
        Admin
        ];
    }
}
