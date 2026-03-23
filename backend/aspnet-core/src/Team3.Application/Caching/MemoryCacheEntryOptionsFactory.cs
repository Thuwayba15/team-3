using System;
using Microsoft.Extensions.Caching.Memory;

namespace Team3.Application.Caching;

internal static class MemoryCacheEntryOptionsFactory
{
    internal static MemoryCacheEntryOptions Create(TimeSpan duration)
    {
        return new MemoryCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = duration,
            Size = 1,
        };
    }
}
