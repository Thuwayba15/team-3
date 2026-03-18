using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Team3.Domain.Subjects
{
    /// <summary>
    /// Stores the localized content for a Lesson.
    /// Supports English, isiZulu, Sesotho, and Afrikaans.
    /// </summary>
    public class LessonTranslation : Entity<Guid>, IEntityTranslation<Lesson, Guid>
    {
        /// <summary>
        /// The translated title of the lesson (e.g., "Introduction to Fractions").
        /// </summary>
        public string Title { get; set; } = default!;

        /// <summary>
        /// The main instructional text or body content for this lesson.
        /// This is the primary context for the AI Tutor.
        /// </summary>
        public string Content { get; set; } = default!;

        /// <summary>
        /// The culture code (e.g., "en", "zu", "st", "af").
        /// </summary>
        public string Language { get; set; } = default!;

        /// <summary>
        /// Reference to the parent Lesson entity.
        /// </summary>
        public virtual Lesson Core { get; set; } = default!;
        public Guid CoreId { get; set; }
    }
}
