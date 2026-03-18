using System;
using Abp.Domain.Entities.Auditing;
using Ardalis.GuardClauses;

namespace Team3.Domain.Parents;

/// <summary>
/// Links a parent user to their child (student) user.
/// One parent can have multiple children; one student can have multiple parents/guardians.
/// </summary>
public class ParentStudentLink : FullAuditedEntity<long>
{
    public long ParentUserId  { get; private set; }
    public long StudentUserId { get; private set; }

    /// <summary>Relationship label, e.g. "Parent", "Guardian", "Caregiver".</summary>
    public string RelationshipType { get; private set; } = default!;

    protected ParentStudentLink() { }

    public ParentStudentLink(long parentUserId, long studentUserId, string relationshipType = "Parent")
    {
        ParentUserId      = Guard.Against.NegativeOrZero(parentUserId,  nameof(parentUserId));
        StudentUserId     = Guard.Against.NegativeOrZero(studentUserId, nameof(studentUserId));
        RelationshipType  = Guard.Against.NullOrWhiteSpace(relationshipType).Trim();
    }
}
