using Abp.Application.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Team3.Users.Dto;

namespace Team3.Users
{
    /// <summary>
    /// Handles UbuntuLearn user registration and profile management.
    /// </summary>
    public interface IUserProfileAppService : IApplicationService
    {
        /// <summary>
        /// Registers a new user and creates the matching role-specific profile.
        /// </summary>
        Task<RegisterUserOutput> RegisterAsync(RegisterUserInput input);

        /// <summary>
        /// Returns the current authenticated user's profile.
        /// </summary>
        Task<GetMyProfileOutput> GetMyProfileAsync();

        /// <summary>
        /// Updates the current authenticated user's profile.
        /// </summary>
        Task<GetMyProfileOutput> UpdateMyProfileAsync(UpdateMyProfileInput input);

        /// <summary>
        /// Returns a profile for a specific user id.
        /// </summary>
        Task<GetMyProfileOutput> GetProfileByUserIdAsync(long userId);
    }
}
