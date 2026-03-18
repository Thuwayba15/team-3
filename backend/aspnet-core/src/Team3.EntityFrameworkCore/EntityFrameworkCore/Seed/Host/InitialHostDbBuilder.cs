namespace Team3.EntityFrameworkCore.Seed.Host;

public class InitialHostDbBuilder
{
    private readonly Team3DbContext _context;

    public InitialHostDbBuilder(Team3DbContext context)
    {
        _context = context;
    }

    public void Create()
    {
        new DefaultEditionCreator(_context).Create();
        new DefaultLanguagesCreator(_context).Create();
        new HostRoleAndUserCreator(_context).Create();
        new DefaultSettingsCreator(_context).Create();
        new DefaultPlatformRoleCreator(_context).Create();
        new InitialSubjectsBuilder(_context).Create();
        new InitialParentDataBuilder(_context).Create();

        _context.SaveChanges();
    }
}
