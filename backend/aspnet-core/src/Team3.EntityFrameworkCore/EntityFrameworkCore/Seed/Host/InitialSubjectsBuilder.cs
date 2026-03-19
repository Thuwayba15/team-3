using System;
using System.Collections.Generic;
using System.Linq;
using Team3.Academic;
using Team3.Enums;

namespace Team3.EntityFrameworkCore.Seed.Host;

/// <summary>
/// Seeds baseline Grade 12 curriculum subjects and topics.
/// </summary>
public class InitialSubjectsBuilder
{
    private const string DefaultGradeLevel = "Grade 12";

    private readonly Team3DbContext _context;

    private static readonly IReadOnlyList<(string SubjectName, IReadOnlyList<string> Topics)> InitialSubjects =
    [
        ("Life Sciences", ["Nucleic Acids", "Meiosis", "Reproduction", "Genetics", "Nervous System", "Endocrine System", "Plant Response", "Evolution"]),
        ("Physical Sciences", ["Mechanics: Force and Newton’s Laws", "Momentum and Impulse", "Vertical projectile motion in one dimension", "Work, Energy and Power", "Doppler Effect", "Electrostatics", "Electric Circuits", "Electrodynamics", "Optical phenomena and properties of materials", "Organic Chemistry", "Rate and Extent of Reaction", "Chemical Equilibrium", "Acids and Bases", "Electrochemistry"]),
        ("Business Studies", ["Legislation", "Human Resources Function", "Ethics and Professionalism", "Creative Thinking and Problem-Solving", "Macro Environment; Business Strategies", "CSR and CSI", "Human Rights, Inclusivity and Environmental Issues", "Team Performance Assessment and Conflict Resolution", "Business Sectors and Their Environments", "Management and Leadership", "Quality of Performance", "Investment; Securities", "Investment; Insurance", "Forms of Ownership", "Presentation and Data Response"]),
        ("Mathematics", ["Exponents and Surds", "Algebra", "Number Patterns, Sequences and Series", "Functions", "Trig Functions", "Finance Growth and Decay", "Calculus", "Probability", "Analytical Geometry", "Trigonometry; Sine, Cosine and Area Rules", "Euclidean Geometry", "Statistics"]),
        ("Mathematical Literacy", ["Finance", "Measurements", "Maps", "Data Handling", "Probability"]),
        ("Dramatic Arts", ["Section A: 20th Century Movements", "Section B: South African Theatre Pre-1994", "Section C: South African Theatre Post-1994", "Section D: The History of Theatre, Practical Concepts, Content and Skills"]),
        ("Tourism", ["Map Work and Tour Planning", "Foreign Exchange", "Tourism Attractions", "Cultural and Heritage Tourism", "Marketing", "Tourism Sectors", "Sustainable and Responsible Tourism", "Domestic, Regional and International Tourism", "Communication and Customer Care"]),
        ("History", ["The Cold War", "Independent Africa", "Civil society protests from the 1950s to the 1970s", "Civil Resistance, 1970s to 1980s: South Africa", "The coming of democracy to South Africa and coming to terms with the past", "The end of the Cold War and a new order 1989 to the present"]),
        ("Geography", ["Climate and weather", "Geomorphology", "Rural settlement and urban settlement", "Economic Geography of South Africa", "Mapwork"]),
        ("Accounting", ["Basic Accounting concepts", "Companies", "Manufacturing", "Budgets", "Reconciliations", "Inventories", "Value Added Tax (VAT)", "Fixed assets"]),
        ("Agricultural Sciences", ["Animal Nutrition", "Animal Production, Protection and Control", "Reproduction", "Agricultural Management and Marketing", "Production factors", "Basic Agricultural Genetics"]),
        ("Economics", ["The circular flow model, national account aggregates and the multiplier", "Business cycles and forecasting", "The role of the public sector", "The foreign exchange market and the balance of payments accounts", "Protectionism and free trade", "The dynamics of perfect markets", "Dynamics of imperfect markets", "The reasons for and consequences of market failures", "Economic growth and development", "South Africa's industrial policies and their suitability in terms of international best practice", "South African economic and social indicators", "Inflation", "Tourism", "Environmental sustainability"]),
        ("Computer Applications Technology", ["Software", "Word processing", "Spreadsheets", "Databases", "Web Development", "General", "Systems Technologies", "Internet and Network Technologies", "Information Management", "Social Implications", "Solution Development"]),
        ("Information Technology", ["Databases", "Object-oriented programming (OOP)", "Graphical user interface (GUI)", "Algorithms", "Systems Technologies", "Communications and Network Technologies", "Data and Information Management", "Solution Development"]),
        ("Engineering Graphics & Design", ["Civil drawing", "Solid geometry", "Perspective drawings", "Mechanical drawings", "Loci of a cam", "Isometric drawing"])
    ];

    public InitialSubjectsBuilder(Team3DbContext context)
    {
        _context = context;
    }

    public void Create()
    {
        foreach (var (subjectName, topics) in InitialSubjects)
        {
            var subject = _context.Subjects.FirstOrDefault(x => x.Name == subjectName);

            if (subject is null)
            {
                subject = new Subject(
                    Guid.NewGuid(),
                    subjectName,
                    DefaultGradeLevel,
                    description: null,
                    isActive: true);

                _context.Subjects.Add(subject);
            }
            else
            {
                subject.UpdateDetails(subjectName, DefaultGradeLevel, subject.Description, isActive: true);
                _context.Subjects.Update(subject);
            }

            SeedTopicsForSubject(subject, topics);
        }

        _context.SaveChanges();
    }

    private void SeedTopicsForSubject(Subject subject, IReadOnlyList<string> topicNames)
    {
        var existingTopics = _context.Topics
            .Where(x => x.SubjectId == subject.Id)
            .ToList();

        for (var i = 0; i < topicNames.Count; i++)
        {
            var topicName = topicNames[i];
            var sequenceOrder = i + 1;

            var existing = existingTopics.FirstOrDefault(x => x.Name == topicName);
            if (existing is null)
            {
                var topic = new Topic(
                    Guid.NewGuid(),
                    subject.Id,
                    topicName,
                    DifficultyLevel.Medium,
                    description: null,
                    sequenceOrder: sequenceOrder,
                    isActive: true,
                    masteryThreshold: 0.70m,
                    generatedByAI: false);

                _context.Topics.Add(topic);
                continue;
            }

            existing.UpdateDetails(
                topicName,
                existing.DifficultyLevel,
                existing.Description,
                sequenceOrder,
                isActive: true,
                masteryThreshold: existing.MasteryThreshold);

            _context.Topics.Update(existing);
        }
    }
}