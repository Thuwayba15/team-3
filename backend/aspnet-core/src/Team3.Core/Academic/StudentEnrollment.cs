using Abp.Domain.Entities.Auditing;
using Ardalis.GuardClauses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Team3.Academic
{
    public class StudentEnrollment : CreationAuditedEntity<Guid>
    {
        public long StudentId { get; private set; }

        public Guid SubjectId { get; private set; }

        public DateTime EnrolledAt { get; private set; }

        public bool IsActive { get; private set; } = true;

        public virtual Subject Subject { get; private set; } = default!;

        protected StudentEnrollment() { }

        public StudentEnrollment(Guid id, long studentId, Guid subjectId)
        {
            Id = id == Guid.Empty ? Guid.NewGuid() : id;
            StudentId = Guard.Against.NegativeOrZero(studentId);
            SubjectId = Guard.Against.Default(subjectId);
            EnrolledAt = DateTime.UtcNow;
        }

        public void Deactivate() => IsActive = false;
        public void Activate() => IsActive = true;
    }
}