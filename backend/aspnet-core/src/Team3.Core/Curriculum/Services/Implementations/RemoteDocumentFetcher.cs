using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Sockets;
using System.Threading.Tasks;
using Abp.Dependency;
using Abp.UI;
using Team3.Curriculum.Services.Interfaces;

namespace Team3.Curriculum.Services.Implementations;

public class RemoteDocumentFetcher : IRemoteDocumentFetcher, ITransientDependency
{
    private static readonly HttpClient HttpClient = new(new HttpClientHandler
    {
        AllowAutoRedirect = true
    })
    {
        Timeout = TimeSpan.FromSeconds(60)
    };

    private const int MaxPdfSizeBytes = 20 * 1024 * 1024;

    public async Task<RemoteDocumentFetchResult> FetchPdfAsync(string sourceUrl)
    {
        var uri = ValidateSourceUrl(sourceUrl);
        await RejectUnsafeHostAsync(uri);

        using var response = await HttpClient.GetAsync(uri, HttpCompletionOption.ResponseHeadersRead);
        if (!response.IsSuccessStatusCode)
        {
            throw new UserFriendlyException($"Document download failed with status code {(int)response.StatusCode} ({response.StatusCode}).");
        }

        var contentType = response.Content.Headers.ContentType?.MediaType;
        if (!IsPdfContentType(contentType) && !LooksLikePdfPath(response.RequestMessage?.RequestUri))
        {
            throw new UserFriendlyException("The remote resource is not a PDF.");
        }

        var contentLength = response.Content.Headers.ContentLength;
        if (contentLength.HasValue && contentLength.Value > MaxPdfSizeBytes)
        {
            throw new UserFriendlyException($"The remote PDF exceeds the {MaxPdfSizeBytes / (1024 * 1024)} MB size limit.");
        }

        await using var responseStream = await response.Content.ReadAsStreamAsync();
        using var memoryStream = new MemoryStream();
        var buffer = new byte[81920];
        int bytesRead;
        long totalBytes = 0;

        while ((bytesRead = await responseStream.ReadAsync(buffer, 0, buffer.Length)) > 0)
        {
            totalBytes += bytesRead;
            if (totalBytes > MaxPdfSizeBytes)
            {
                throw new UserFriendlyException($"The remote PDF exceeds the {MaxPdfSizeBytes / (1024 * 1024)} MB size limit.");
            }

            await memoryStream.WriteAsync(buffer, 0, bytesRead);
        }

        var bytes = memoryStream.ToArray();
        if (bytes.Length < 5 || bytes[0] != '%' || bytes[1] != 'P' || bytes[2] != 'D' || bytes[3] != 'F' || bytes[4] != '-')
        {
            throw new UserFriendlyException("The downloaded file is not a valid PDF.");
        }

        return new RemoteDocumentFetchResult
        {
            ContentBytes = bytes,
            ContentType = contentType ?? "application/pdf",
            FileSize = bytes.LongLength,
            FileName = GetFileName(response, uri),
            FinalUrl = response.RequestMessage?.RequestUri?.ToString() ?? sourceUrl
        };
    }

    private static Uri ValidateSourceUrl(string sourceUrl)
    {
        if (!Uri.TryCreate(sourceUrl, UriKind.Absolute, out var uri))
        {
            throw new UserFriendlyException("Source URL must be an absolute URL.");
        }

        if (uri.Scheme != Uri.UriSchemeHttp && uri.Scheme != Uri.UriSchemeHttps)
        {
            throw new UserFriendlyException("Only HTTP and HTTPS source URLs are supported.");
        }

        return uri;
    }

    private static async Task RejectUnsafeHostAsync(Uri uri)
    {
        if (uri.IsLoopback)
        {
            throw new UserFriendlyException("Loopback URLs are not allowed.");
        }

        IPAddress[] addresses;
        try
        {
            addresses = await Dns.GetHostAddressesAsync(uri.DnsSafeHost);
        }
        catch (Exception ex)
        {
            throw new UserFriendlyException($"Could not resolve the source host: {ex.Message}");
        }

        if (addresses.Length == 0)
        {
            throw new UserFriendlyException("The source host could not be resolved.");
        }

        if (addresses.Any(IsPrivateOrLoopback))
        {
            throw new UserFriendlyException("Private or local network addresses are not allowed for curriculum ingestion.");
        }
    }

    private static bool IsPrivateOrLoopback(IPAddress address)
    {
        if (IPAddress.IsLoopback(address))
        {
            return true;
        }

        if (address.AddressFamily == AddressFamily.InterNetwork)
        {
            var bytes = address.GetAddressBytes();
            return bytes[0] == 10
                || (bytes[0] == 172 && bytes[1] >= 16 && bytes[1] <= 31)
                || (bytes[0] == 192 && bytes[1] == 168)
                || (bytes[0] == 169 && bytes[1] == 254)
                || bytes[0] == 127;
        }

        if (address.AddressFamily == AddressFamily.InterNetworkV6)
        {
            return address.IsIPv6LinkLocal
                || address.IsIPv6SiteLocal
                || address.Equals(IPAddress.IPv6Loopback)
                || address.Equals(IPAddress.IPv6None);
        }

        return false;
    }

    private static bool IsPdfContentType(string contentType)
    {
        return string.Equals(contentType, "application/pdf", StringComparison.OrdinalIgnoreCase);
    }

    private static bool LooksLikePdfPath(Uri uri)
    {
        return uri != null && uri.AbsolutePath.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase);
    }

    private static string GetFileName(HttpResponseMessage response, Uri originalUri)
    {
        var headerFileName = response.Content.Headers.ContentDisposition?.FileNameStar
            ?? response.Content.Headers.ContentDisposition?.FileName;

        var candidate = string.IsNullOrWhiteSpace(headerFileName)
            ? Path.GetFileName(response.RequestMessage?.RequestUri?.AbsolutePath ?? originalUri.AbsolutePath)
            : headerFileName.Trim('"');

        return string.IsNullOrWhiteSpace(candidate) ? "document.pdf" : candidate;
    }
}
