namespace Team3.Curriculum.Services.Interfaces;

public class RemoteDocumentFetchResult
{
    public byte[] ContentBytes { get; set; }
    public string ContentType { get; set; }
    public long FileSize { get; set; }
    public string FileName { get; set; }
    public string FinalUrl { get; set; }
}
