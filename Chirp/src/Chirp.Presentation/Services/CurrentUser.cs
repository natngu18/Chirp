using Chirp.Application.Common.Interfaces;
using System.Security.Claims;

namespace Chirp.Presentation.Services
{
    public class CurrentUser : ICurrentUser
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUser(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string? Id => _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        public string? AccessToken => _httpContextAccessor.HttpContext?.Request?.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

    }
}
