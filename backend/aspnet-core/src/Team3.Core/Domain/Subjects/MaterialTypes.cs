using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Team3.Domain.Subjects.Enums
{
    namespace Team3.Domain.Subjects
    {
        public enum MaterialType
        {
            /// <summary>
            /// Raw HTML or Markdown text content.
            /// </summary>
            Text = 1,

            /// <summary>
            /// External video link (YouTube, Vimeo, or S3).
            /// </summary>
            Video = 2,

            /// <summary>
            /// Downloadable PDF documents or study guides.
            /// </summary>
            Document = 3,

            /// <summary>
            /// Interactive quiz or assessment.
            /// </summary>
            Quiz = 4,

            /// <summary>
            /// Audio files (useful for language pronunciation).
            /// </summary>
            Audio = 5,

            /// <summary>
            /// External resource link or website.
            /// </summary>
            ExternalLink = 6
        }
    }
}
