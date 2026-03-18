using Team3.Curriculum.Services.Models;

namespace Team3.Curriculum.Services.Interfaces;

public interface IDocumentProfileBuilder
{
    DocumentProfile BuildProfile(string textContent);
}
