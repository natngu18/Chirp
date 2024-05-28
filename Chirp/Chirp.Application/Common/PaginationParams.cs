using Microsoft.AspNetCore.Mvc;

namespace Chirp.Application.Common
{
    public record PaginationParams
    {
        [FromQuery]
        public int PageNumber { get; init; } = 1;
        [FromQuery]
        public int PageSize { get; init; } = 10;
    }
}
