using System.Collections.Generic;

namespace Team3.Users.Dto;

public class AdminDashboardSummaryDto
{
    public int TotalUsers { get; set; }

    public int ActiveUsers { get; set; }

    public int SupportedLanguages { get; set; }

    public List<AdminRoleDistributionDto> RoleDistribution { get; set; } = [];
}

public class AdminRoleDistributionDto
{
    public string RoleName { get; set; } = string.Empty;

    public int Count { get; set; }

    public int Percent { get; set; }
}
