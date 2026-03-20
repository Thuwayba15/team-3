using Abp.Configuration;
using Abp.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using Abp.Zero.Configuration;
using Team3.Authorization.Accounts.Dto;
using Team3.Authorization.Users;
using System.Linq;
using System.Threading.Tasks;
using Team3.Configuration;
using Team3.Localization;
using Team3.Configuration;

namespace Team3.Authorization.Accounts;

/// <summary>
/// Handles tenant availability checks and account registration.
/// </summary>
public class AccountAppService : Team3AppServiceBase, IAccountAppService
{
    /// <summary>
    /// Password strength regex retained for compatibility with existing consumers.
    /// </summary>
    public const string PasswordRegex = "(?=^.{8,}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\\s)[0-9a-zA-Z!@#$%^&*()]*$";

    private readonly UserRegistrationManager _userRegistrationManager;
    private readonly UserManager _userManager;
    private readonly IRepository<Language, global::System.Guid> _languageRepository;
    private readonly IRepository<UserLanguagePreference, long> _userLanguagePreferenceRepository;

    /// <summary>
    /// Creates an instance of the account application service.
    /// </summary>
    public AccountAppService(
        UserRegistrationManager userRegistrationManager,
        UserManager userManager,
        IRepository<Language, global::System.Guid> languageRepository,
        IRepository<UserLanguagePreference, long> userLanguagePreferenceRepository)
    {
        _userRegistrationManager = userRegistrationManager;
        _userManager = userManager;
        _languageRepository = languageRepository;
        _userLanguagePreferenceRepository = userLanguagePreferenceRepository;
    }

    /// <summary>
    /// Checks whether a tenant is available for login.
    /// </summary>
    public async Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input)
    {
        var tenant = await TenantManager.FindByTenancyNameAsync(input.TenancyName);
        if (tenant == null)
        {
            return new IsTenantAvailableOutput(TenantAvailabilityState.NotFound);
        }

        if (!tenant.IsActive)
        {
            return new IsTenantAvailableOutput(TenantAvailabilityState.InActive);
        }

        return new IsTenantAvailableOutput(TenantAvailabilityState.Available, tenant.Id);
    }

    /// <summary>
    /// Registers a new user account and initializes language preference.
    /// </summary>
    public async Task<RegisterOutput> Register(RegisterInput input)
    {
        var user = await _userRegistrationManager.RegisterAsync(
            input.Name,
            input.Surname,
            input.EmailAddress,
            input.UserName,
            input.Password,
            true // Assumed email address is always confirmed. Change this if you want to implement email confirmation.
        );

        if (input.RoleNames != null && input.RoleNames.Length > 0)
        {
            CheckErrors(await _userManager.SetRolesAsync(user, input.RoleNames));
        }

        var defaultLanguageCode = await _languageRepository.GetAll()
            .Where(language => language.IsDefault && language.IsActive && !language.IsDeleted)
            .Select(language => language.Code)
            .FirstOrDefaultAsync();

        var normalizedLanguageCode = string.IsNullOrWhiteSpace(defaultLanguageCode)
            ? "en"
            : defaultLanguageCode.Trim().ToLowerInvariant();

        await _userLanguagePreferenceRepository.InsertAsync(new UserLanguagePreference(user.Id, normalizedLanguageCode));

        var isEmailConfirmationRequiredForLogin = await SettingManager.GetSettingValueAsync<bool>(AbpZeroSettingNames.UserManagement.IsEmailConfirmationRequiredForLogin);

        return new RegisterOutput
        {
            CanLogin = user.IsActive && (user.IsEmailConfirmed || !isEmailConfirmationRequiredForLogin)
        };
    }
}