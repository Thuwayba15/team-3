using System.Threading.Tasks;
using Abp.Dependency;
using Team3.Curriculum.Services.Interfaces;

namespace Team3.Curriculum.Services.Implementations;

/// <summary>
/// Stub implementation for text extraction. Replace with actual PDF parsing library.
/// </summary>
public class StubDocumentTextExtractor : IDocumentTextExtractor, ITransientDependency
{
    public async Task<string> ExtractTextAsync(string filePath)
    {
        // TODO: Integrate a PDF parsing library like iTextSharp or PdfPig here
        // For now, return dummy text based on file path for testing
        await Task.Delay(100); // Simulate processing time

        return $@"
IT Practical Textbook Sample Content

Term 1: Introduction to Programming

Chapter 1: Basics of Programming
Unit 1.1: What is Programming?
Example: Hello World program in C#.
Guided Activity: Write your first program.
Activity: Modify the program to print your name.
Consolidation Activity: Create a simple calculator.

Chapter 2: Data Types
Unit 2.1: Variables and Constants
Example: Declaring variables.
Activity: Practice variable declarations.

Annexure A: ASCII Table
Glossary: Key terms and definitions.
";
    }
}