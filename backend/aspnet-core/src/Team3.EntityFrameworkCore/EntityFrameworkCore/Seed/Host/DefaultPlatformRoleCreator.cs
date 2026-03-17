using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Team3.Authorization.Roles;
using Team3.Authorization.Users;

namespace Team3.EntityFrameworkCore.Seed.Host
{
    /// <summary>
    /// Creates UbuntuLearn platform roles if they do not already exist.
    /// </summary>
    public class DefaultPlatformRoleCreator
    {
        private readonly Team3DbContext _context;

        public DefaultPlatformRoleCreator(Team3DbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Creates any missing platform roles.
        /// </summary>
        public void Create()
        {
            CreateRoleIfNotExists(UserRoleNames.Student, isDefault: true);
            CreateRoleIfNotExists(UserRoleNames.Tutor);
            CreateRoleIfNotExists(UserRoleNames.Parent);
            CreateRoleIfNotExists(UserRoleNames.Admin);
        }

        private void CreateRoleIfNotExists(string roleName, bool isDefault = false)
        {
            var existingRole = _context.Roles.FirstOrDefault(r => r.Name == roleName);
            if (existingRole != null)
            {
                return;
            }

            var role = new Role(null, roleName, roleName)
            {
                IsStatic = true,
                IsDefault = isDefault
            };

            _context.Roles.Add(role);
            _context.SaveChanges();
        }
    }
}
