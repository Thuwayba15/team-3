using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Team3.EntityFrameworkCore.Seed.Host
{
    using global::Team3.Academic;
    using Microsoft.EntityFrameworkCore;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    namespace Team3.EntityFrameworkCore.Seed.Host
    {
        public class InitialSubjectsBuilder
        {
            private readonly Team3DbContext _context;

            public InitialSubjectsBuilder(Team3DbContext context)
            {
                _context = context;
            }

            public void Create()
            {
                var subjectsToSeed = GetFullSouthAfricanCurriculum();

                foreach (var subjectInfo in subjectsToSeed)
                {
                    // Create a unique code (e.g., "LIFE-SCIENCES-G12")
                    string subjectCode = subjectInfo.Name.Replace(" ", "-").ToUpper() + "-G12";

                    var existingSubject = _context.Subjects.IgnoreQueryFilters()
                        .FirstOrDefault(s => s.SubjectCode == subjectCode);

                    if (existingSubject == null)
                    {
                        var newSubject = new Subject
                        {
                            SubjectCode = subjectCode,
                            Translations = new List<SubjectTranslation>
                        {
                            new SubjectTranslation
                            {
                                Language = "en",
                                Name = subjectInfo.Name,
                                Description = $"Grade 12 {subjectInfo.Name} Curriculum."
                            }
                        }
                        };

                        _context.Subjects.Add(newSubject);
                        _context.SaveChanges();

                        // Add Chapters as Topics
                        for (int i = 0; i < subjectInfo.Chapters.Count; i++)
                        {
                            var topic = new Topic(newSubject.Id, i + 1)
                            {
                                Translations = new List<TopicTranslation>
                            {
                                new TopicTranslation
                                {
                                    Language = "en",
                                    Title = subjectInfo.Chapters[i],
                                    Summary = $"Comprehensive notes for {subjectInfo.Chapters[i]}"
                                }
                            }
                            };
                            _context.Topics.Add(topic);
                        }
                        _context.SaveChanges();
                    }
                }
            }

            private List<SubjectSeedModel> GetFullSouthAfricanCurriculum()
            {
                return new List<SubjectSeedModel>
            {
                new ("Life Sciences", new() { "Nucleic Acids", "Meiosis", "Reproduction", "Genetics", "Nervous System", "Endocrine System", "Plant Response", "Evolution" }),

                new ("Physical Sciences",new() { "Mechanics: Force and Newton’s Laws", "Momentum and Impulse", "Vertical projectile motion in one dimension", "Work, Energy and Power", "Doppler Effect", "Electrostatics", "Electric Circuits", "Electrodynamics", "Optical phenomena and properties of materials", "Organic Chemistry", "Rate and Extent of Reaction", "Chemical Equilibrium", "Acids and Bases", "Electrochemistry" }),

                new ("Business Studies",  new() { "Legislation", "Human Resources Function", "Ethics and Professionalism", "Creative Thinking and Problem-Solving", "Macro Environment; Business Strategies", "CSR and CSI", "Human Rights, Inclusivity and Environmental Issues", "Team Performance Assessment and Conflict Resolution", "Business Sectors and Their Environments", "Management and Leadership", "Quality of Performance", "Investment; Securities", "Investment; Insurance", "Forms of Ownership", "Presentation and Data Response" }),

                new ("Mathematics", new() { "Exponents and Surds", "Algebra", "Number Patterns, Sequences and Series", "Functions", "Trig Functions", "Finance Growth and Decay", "Calculus", "Probability", "Analytical Geometry", "Trigonometry; Sine, Cosine and Area Rules", "Euclidean Geometry", "Statistics" }),

                new ("Mathematical Literacy", new() { "Finance", "Measurements", "Maps", "Data Handling", "Probability" }),

                new ("Dramatic Arts", new() { "Section A: 20th Century Movements", "Section B: South African Theatre Pre-1994", "Section C: South African Theatre Post-1994", "Section D: The History of Theatre, Practical Concepts, Content and Skills" }),

                new ("Tourism", new() { "Map Work and Tour Planning", "Foreign Exchange", "Tourism Attractions", "Cultural and Heritage Tourism", "Marketing", "Tourism Sectors", "Sustainable and Responsible Tourism", "Domestic, Regional and International Tourism", "Communication and Customer Care" }),

                new ("History", new() { "The Cold War", "Independent Africa", "Civil society protests from the 1950s to the 1970s", "Civil Resistance, 1970s to 1980s: South Africa", "The coming of democracy to South Africa and coming to terms with the past", "The end of the Cold War and a new order 1989 to the present" }),

                new ("Geography",  new() { "Climate and weather", "Geomorphology", "Rural settlement and urban settlement", "Economic Geography of South Africa", "Mapwork" }),

                new ("Accounting", new() { "Basic Accounting concepts", "Companies", "Manufacturing", "Budgets", "Reconciliations", "Inventories", "Value Added Tax (VAT)", "Fixed assets" }),

                new ("Agricultural Sciences",  new() { "Animal Nutrition", "Animal Production, Protection and Control", "Reproduction", "Agricultural Management and Marketing", "Production factors", "Basic Agricultural Genetics" }),

                new ("Economics",  new() { "The circular flow model, national account aggregates and the multiplier", "Business cycles and forecasting", "The role of the public sector", "The foreign exchange market and the balance of payments accounts", "Protectionism and free trade", "The dynamics of perfect markets", "Dynamics of imperfect markets", "The reasons for and consequences of market failures", "Economic growth and development", "South Africa’s industrial policies and their suitability in terms of international best practice", "South African economic and social indicators", "Inflation", "Tourism", "Environmental sustainability" }),

                new ("Computer Applications Technology", new() { "Software", "Word processing", "Spreadsheets", "Databases", "Web Development", "General", "Systems Technologies", "Internet and Network Technologies", "Information Management", "Social Implications", "Solution Development" }),

                new ("Information Technology", new() { "Databases", "Object-oriented programming (OOP)", "Graphical user interface (GUI)", "Algorithms", "Systems Technologies", "Communications and Network Technologies", "Data and Information Management", "Solution Development" }),

                new ("Engineering Graphics & Design", new() { "Civil drawing", "Solid geometry", "Perspective drawings", "Mechanical drawings", "Loci of a cam", "Isometric drawing" })
            };
            }

            private class SubjectSeedModel
            {
                public string Name { get; }
                public List<string> Chapters { get; }
                public SubjectSeedModel(string name, List<string> chapters)
                {
                    Name = name;
                    Chapters = chapters;
                }
            }
        }
    }
}
