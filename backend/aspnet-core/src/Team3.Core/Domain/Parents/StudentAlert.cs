using System;
using Abp.Domain.Entities.Auditing;
using Ardalis.GuardClauses;

namespace Team3.Domain.Parents;

/// <summary>
/// An alert generated for a parent about their child's academic or activity status.
/// </summary>
public class StudentAlert : FullAuditedEntity<long>
{
    public long          StudentUserId { get; private set; }
    public long          ParentUserId  { get; private set; }
    public AlertCategory Category      { get; private set; }
    public AlertType     Type          { get; private set; }
    public string        Title         { get; private set; } = default!;
    public string        Description   { get; private set; } = default!;
    public bool          IsDismissed   { get; private set; }

    protected StudentAlert() { }

    public StudentAlert(
        long          studentUserId,
        long          parentUserId,
        AlertCategory category,
        AlertType     type,
        string        title,
        string        description)
    {
        StudentUserId = Guard.Against.NegativeOrZero(studentUserId, nameof(studentUserId));
        ParentUserId  = Guard.Against.NegativeOrZero(parentUserId,  nameof(parentUserId));
        Category      = category;
        Type          = type;
        Title         = Guard.Against.NullOrWhiteSpace(title).Trim();
        Description   = Guard.Against.NullOrWhiteSpace(description).Trim();
        IsDismissed   = false;
    }

    /// <summary>Parent dismisses this alert so it no longer appears in their feed.</summary>
    public void Dismiss() => IsDismissed = true;
}
