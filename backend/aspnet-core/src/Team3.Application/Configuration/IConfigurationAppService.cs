using Team3.Configuration.Dto;
using System.Threading.Tasks;

namespace Team3.Configuration;

public interface IConfigurationAppService
{
    Task ChangeUiTheme(ChangeUiThemeInput input);
}
