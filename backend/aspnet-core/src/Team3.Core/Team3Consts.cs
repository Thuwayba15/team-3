using Team3.Debugging;

namespace Team3;

public class Team3Consts
{
    public const string LocalizationSourceName = "Team3";

    public const string ConnectionStringName = "Default";

    public const bool MultiTenancyEnabled = true;


    /// <summary>
    /// Default pass phrase for SimpleStringCipher decrypt/encrypt operations
    /// </summary>
    public static readonly string DefaultPassPhrase =
        DebugHelper.IsDebug ? "gsKxGZ012HLL3MI5" : "1cee07fae65845ecaa198b073e432154";
}
