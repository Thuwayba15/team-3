using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Runtime.Session;
using Abp.Domain.Repositories;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using Team3.Domain.Parents;
using Team3.Services.Parents.Dto;

namespace Team3.Services.Parents;

public class ParentAlertsAppService : Team3AppServiceBase, IParentAlertsAppService
{
    private readonly IRepository<ParentStudentLink, long> _linkRepo;
    private readonly IRepository<StudentAlert,      long> _alertRepo;

    public ParentAlertsAppService(
        IRepository<ParentStudentLink, long> linkRepo,
        IRepository<StudentAlert,      long> alertRepo)
    {
        _linkRepo  = linkRepo;
        _alertRepo = alertRepo;
    }

    public async Task<ListResultDto<AlertDto>> GetAlertsAsync(string? category = null)
    {
        var parentUserId = AbpSession.GetUserId();

        var link = await _linkRepo.FirstOrDefaultAsync(l => l.ParentUserId == parentUserId)
            ?? throw new UserFriendlyException("No linked student found for this parent account.");

        var query = _alertRepo.GetAll()
            .Where(a => a.StudentUserId == link.StudentUserId && !a.IsDismissed);

        if (!string.IsNullOrWhiteSpace(category) &&
            Enum.TryParse<AlertCategory>(category, ignoreCase: true, out var parsed))
        {
            query = query.Where(a => a.Category == parsed);
        }

        var alerts = await query
            .OrderByDescending(a => a.CreationTime)
            .ToListAsync();

        return new ListResultDto<AlertDto>(alerts.Select(MapToDto).ToList());
    }

    public async Task DismissAlertAsync(long alertId)
    {
        var parentUserId = AbpSession.GetUserId();

        var link = await _linkRepo.FirstOrDefaultAsync(l => l.ParentUserId == parentUserId)
            ?? throw new UserFriendlyException("No linked student found for this parent account.");

        var alert = await _alertRepo.GetAsync(alertId);

        if (alert.StudentUserId != link.StudentUserId)
            throw new UserFriendlyException("Alert not found.");

        alert.Dismiss();
        await _alertRepo.UpdateAsync(alert);
    }

    private static AlertDto MapToDto(StudentAlert a) => new()
    {
        Id          = a.Id,
        Type        = a.Type.ToString().ToLower(),
        Category    = a.Category.ToString().ToLower(),
        Title       = a.Title,
        Description = a.Description,
        When        = ParentDashboardAppService.FormatWhen(a.CreationTime),
        IsDismissed = a.IsDismissed,
        Actions     = BuildActions(a),
    };

    private static List<string> BuildActions(StudentAlert a)
    {
        var actions = new List<string>();
        if (a.Type == AlertType.Warning) actions.Add("view");
        actions.Add("dismiss");
        return actions;
    }
}
