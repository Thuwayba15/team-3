using Abp.Application.Services;
using Team3.MultiTenancy.Dto;

namespace Team3.MultiTenancy;

public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>
{
}

