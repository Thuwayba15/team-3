using System.Threading.Tasks;

namespace Team3.Curriculum.Services.Interfaces;

public interface IRemoteDocumentFetcher
{
    Task<RemoteDocumentFetchResult> FetchPdfAsync(string sourceUrl);
}
