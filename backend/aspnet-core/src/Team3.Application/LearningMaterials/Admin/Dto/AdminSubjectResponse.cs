using System;

namespace Team3.LearningMaterials.Admin.Dto;

public class AdminSubjectResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string GradeLevel { get; set; }
    public string Description { get; set; }
    public bool IsActive { get; set; }
}
