using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Runtime.Session;
using Abp.Runtime.Validation;
using Abp.UI;
using Ardalis.GuardClauses;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Team3.Authorization.Roles;
using Team3.Authorization.Users;
using Team3.Users.Dto;

namespace Team3.Users
{
    /// <summary>
    /// Handles user registration and role-specific profile operations.
    /// </summary>
    public class UserProfileAppService : Team3AppServiceBase, IUserProfileAppService
    {
        private readonly UserManager _userManager;
        private readonly RoleManager _roleManager;
        private readonly IRepository<User, long> _userRepository;
        private readonly IRepository<StudentProfile, long> _studentProfileRepository;
        private readonly IRepository<TutorProfile, long> _tutorProfileRepository;
        private readonly IRepository<ParentProfile, long> _parentProfileRepository;
        private readonly IRepository<AdminProfile, long> _adminProfileRepository;
        private readonly IValidator<RegisterUserInput> _registerValidator;
        private readonly IValidator<UpdateMyProfileInput> _updateValidator;

        public UserProfileAppService(
            UserManager userManager,
            RoleManager roleManager,
            IRepository<User, long> userRepository,
            IRepository<StudentProfile, long> studentProfileRepository,
            IRepository<TutorProfile, long> tutorProfileRepository,
            IRepository<ParentProfile, long> parentProfileRepository,
            IRepository<AdminProfile, long> adminProfileRepository,
            IValidator<RegisterUserInput> registerValidator,
            IValidator<UpdateMyProfileInput> updateValidator)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _userRepository = userRepository;
            _studentProfileRepository = studentProfileRepository;
            _tutorProfileRepository = tutorProfileRepository;
            _parentProfileRepository = parentProfileRepository;
            _adminProfileRepository = adminProfileRepository;
            _registerValidator = registerValidator;
            _updateValidator = updateValidator;
        }

        /// <summary>
        /// Registers a new user and creates the matching role-specific profile.
        /// </summary>
        [AbpAllowAnonymous]
        public async Task<RegisterUserOutput> RegisterAsync(RegisterUserInput input)
        {
            Guard.Against.Null(input);
            await ValidateAsync(_registerValidator, input);

            await EnsureRoleExistsAsync(input.Role);
            await EnsureEmailIsUniqueAsync(input.EmailAddress);

            await _userManager.InitializeOptionsAsync(AbpSession.TenantId);

            var user = new User
            {
                TenantId = AbpSession.TenantId,
                Name = input.Name.Trim(),
                Surname = input.Surname.Trim(),
                UserName = input.EmailAddress.Trim(),
                EmailAddress = input.EmailAddress.Trim(),
                IsActive = true,
                IsEmailConfirmed = true
            };

            CheckErrors(await _userManager.CreateAsync(user, input.Password));
            CheckErrors(await _userManager.AddToRoleAsync(user, input.Role));

            await CreateRoleSpecificProfileAsync(user.Id, input);

            return await BuildRegisterOutputAsync(user, input.Role);
        }

        /// <summary>
        /// Returns the current authenticated user's profile.
        /// </summary>
        [AbpAuthorize]
        public async Task<GetMyProfileOutput> GetMyProfileAsync()
        {
            var userId = AbpSession.GetUserId();
            var user = await _userRepository.GetAsync(userId);
            var role = await GetPrimaryRoleAsync(user);

            return await BuildProfileOutputAsync(user, role);
        }

        /// <summary>
        /// Updates the current authenticated user's profile.
        /// </summary>
        [AbpAuthorize]
        public async Task<GetMyProfileOutput> UpdateMyProfileAsync(UpdateMyProfileInput input)
        {
            Guard.Against.Null(input);
            await ValidateAsync(_updateValidator, input);

            var userId = AbpSession.GetUserId();
            var user = await _userRepository.GetAsync(userId);
            var role = await GetPrimaryRoleAsync(user);

            user.Name = input.Name.Trim();
            user.Surname = input.Surname.Trim();

            CheckErrors(await _userManager.UpdateAsync(user));

            await UpdateRoleSpecificProfileAsync(user.Id, role, input);

            return await BuildProfileOutputAsync(user, role);
        }

        /// <summary>
        /// Returns a profile for a specific user id. Admin only.
        /// </summary>
        [AbpAuthorize]
        public async Task<GetMyProfileOutput> GetProfileByUserIdAsync(long userId)
        {
            Guard.Against.NegativeOrZero(userId);

            await EnsureCurrentUserIsAdminAsync();

            var user = await _userRepository.GetAsync(userId);
            var role = await GetPrimaryRoleAsync(user);

            return await BuildProfileOutputAsync(user, role);
        }

        /// <summary>
        /// Validates input using FluentValidation and returns a readable error message when invalid.
        /// </summary>
        private static async Task ValidateAsync<T>(IValidator<T> validator, T input)
        {
            var result = await validator.ValidateAsync(input);
            if (result.IsValid)
            {
                return;
            }

            var errorMessage = string.Join("; ", result.Errors.Select(e => e.ErrorMessage));
            throw new UserFriendlyException(errorMessage);
        }

        /// <summary>
        /// Ensures the requested role exists in the system.
        /// </summary>
        private async Task EnsureRoleExistsAsync(string roleName)
        {
            var role = await _roleManager.FindByNameAsync(roleName);
            if (role == null)
            {
                throw new UserFriendlyException($"Role '{roleName}' does not exist.");
            }
        }

        /// <summary>
        /// Ensures that no existing user already uses the provided email address.
        /// </summary>
        private async Task EnsureEmailIsUniqueAsync(string emailAddress)
        {
            var existingUser = await _userManager.FindByEmailAsync(emailAddress.Trim());
            if (existingUser != null)
            {
                throw new UserFriendlyException("A user with this email address already exists.");
            }
        }

        /// <summary>
        /// Ensures that the current user is an administrator.
        /// </summary>
        private async Task EnsureCurrentUserIsAdminAsync()
        {
            var currentUser = await _userRepository.GetAsync(AbpSession.GetUserId());
            var isAdmin = await _userManager.IsInRoleAsync(currentUser, UserRoleNames.Admin);

            if (!isAdmin)
            {
                throw new AbpAuthorizationException("Only admins can perform this action.");
            }
        }

        /// <summary>
        /// Returns the primary supported platform role for the given user.
        /// </summary>
        private async Task<string> GetPrimaryRoleAsync(User user)
        {
            var roles = await _userManager.GetRolesAsync(user);
            var matchedRole = roles.FirstOrDefault(UserRoleNames.All.Contains);

            if (string.IsNullOrWhiteSpace(matchedRole))
            {
                throw new UserFriendlyException("The user does not have a supported platform role.");
            }

            return matchedRole;
        }

        /// <summary>
        /// Creates the correct role-specific profile after a user is registered.
        /// </summary>
        private async Task CreateRoleSpecificProfileAsync(long userId, RegisterUserInput input)
        {
            switch (input.Role)
            {
                case UserRoleNames.Student:
                    await _studentProfileRepository.InsertAsync(new StudentProfile(
                        userId,
                        input.PreferredLanguage,
                        input.GradeLevel!,
                        input.ProgressLevel,
                        input.SubjectInterests));
                    break;

                case UserRoleNames.Tutor:
                    await _tutorProfileRepository.InsertAsync(new TutorProfile(
                        userId,
                        input.PreferredLanguage,
                        input.Specialization,
                        input.Bio,
                        input.SubjectInterests));
                    break;

                case UserRoleNames.Parent:
                    await _parentProfileRepository.InsertAsync(new ParentProfile(
                        userId,
                        input.PreferredLanguage,
                        input.RelationshipNotes));
                    break;

                case UserRoleNames.Admin:
                    await _adminProfileRepository.InsertAsync(new AdminProfile(
                        userId,
                        input.PreferredLanguage,
                        input.Department));
                    break;

                default:
                    throw new UserFriendlyException("Unsupported role.");
            }
        }

        /// <summary>
        /// Updates the correct role-specific profile for the current user.
        /// </summary>
        private async Task UpdateRoleSpecificProfileAsync(long userId, string role, UpdateMyProfileInput input)
        {
            switch (role)
            {
                case UserRoleNames.Student:
                    var studentProfile = await _studentProfileRepository.FirstOrDefaultAsync(x => x.UserId == userId)
                        ?? throw new UserFriendlyException("Student profile not found.");

                    studentProfile.UpdateProfile(
                        input.PreferredLanguage,
                        input.GradeLevel ?? studentProfile.GradeLevel,
                        input.ProgressLevel,
                        input.SubjectInterests);

                    await _studentProfileRepository.UpdateAsync(studentProfile);
                    break;

                case UserRoleNames.Tutor:
                    var tutorProfile = await _tutorProfileRepository.FirstOrDefaultAsync(x => x.UserId == userId)
                        ?? throw new UserFriendlyException("Tutor profile not found.");

                    tutorProfile.UpdateProfile(
                        input.PreferredLanguage,
                        input.Specialization,
                        input.Bio,
                        input.SubjectInterests);

                    await _tutorProfileRepository.UpdateAsync(tutorProfile);
                    break;

                case UserRoleNames.Parent:
                    var parentProfile = await _parentProfileRepository.FirstOrDefaultAsync(x => x.UserId == userId)
                        ?? throw new UserFriendlyException("Parent profile not found.");

                    parentProfile.UpdateProfile(
                        input.PreferredLanguage,
                        input.RelationshipNotes);

                    await _parentProfileRepository.UpdateAsync(parentProfile);
                    break;

                case UserRoleNames.Admin:
                    var adminProfile = await _adminProfileRepository.FirstOrDefaultAsync(x => x.UserId == userId)
                        ?? throw new UserFriendlyException("Admin profile not found.");

                    adminProfile.UpdateProfile(
                        input.PreferredLanguage,
                        input.Department);

                    await _adminProfileRepository.UpdateAsync(adminProfile);
                    break;

                default:
                    throw new UserFriendlyException("Unsupported role.");
            }
        }

        /// <summary>
        /// Builds the registration response from the stored user and profile data.
        /// </summary>
        private async Task<RegisterUserOutput> BuildRegisterOutputAsync(User user, string role)
        {
            var profile = await BuildProfileOutputAsync(user, role);

            return new RegisterUserOutput
            {
                UserId = profile.UserId,
                Name = profile.Name,
                Surname = profile.Surname,
                EmailAddress = profile.EmailAddress,
                Role = profile.Role,
                PreferredLanguage = profile.PreferredLanguage,
                GradeLevel = profile.GradeLevel,
                ProgressLevel = profile.ProgressLevel,
                SubjectInterests = profile.SubjectInterests,
                Specialization = profile.Specialization,
                Bio = profile.Bio,
                RelationshipNotes = profile.RelationshipNotes,
                Department = profile.Department
            };
        }

        /// <summary>
        /// Builds a unified profile response regardless of the user's role.
        /// </summary>
        private async Task<GetMyProfileOutput> BuildProfileOutputAsync(User user, string role)
        {
            var output = new GetMyProfileOutput
            {
                UserId = user.Id,
                Name = user.Name,
                Surname = user.Surname,
                EmailAddress = user.EmailAddress,
                Role = role
            };

            switch (role)
            {
                case UserRoleNames.Student:
                    var studentProfile = await _studentProfileRepository.FirstOrDefaultAsync(x => x.UserId == user.Id)
                        ?? throw new UserFriendlyException("Student profile not found.");

                    output.PreferredLanguage = studentProfile.PreferredLanguage;
                    output.GradeLevel = studentProfile.GradeLevel;
                    output.ProgressLevel = studentProfile.ProgressLevel;
                    output.SubjectInterests = studentProfile.SubjectInterests;
                    break;

                case UserRoleNames.Tutor:
                    var tutorProfile = await _tutorProfileRepository.FirstOrDefaultAsync(x => x.UserId == user.Id)
                        ?? throw new UserFriendlyException("Tutor profile not found.");

                    output.PreferredLanguage = tutorProfile.PreferredLanguage;
                    output.Specialization = tutorProfile.Specialization;
                    output.Bio = tutorProfile.Bio;
                    output.SubjectInterests = tutorProfile.SubjectInterests;
                    break;

                case UserRoleNames.Parent:
                    var parentProfile = await _parentProfileRepository.FirstOrDefaultAsync(x => x.UserId == user.Id)
                        ?? throw new UserFriendlyException("Parent profile not found.");

                    output.PreferredLanguage = parentProfile.PreferredLanguage;
                    output.RelationshipNotes = parentProfile.RelationshipNotes;
                    break;

                case UserRoleNames.Admin:
                    var adminProfile = await _adminProfileRepository.FirstOrDefaultAsync(x => x.UserId == user.Id)
                        ?? throw new UserFriendlyException("Admin profile not found.");

                    output.PreferredLanguage = adminProfile.PreferredLanguage;
                    output.Department = adminProfile.Department;
                    break;

                default:
                    throw new UserFriendlyException("Unsupported role.");
            }

            return output;
        }
    }
}
