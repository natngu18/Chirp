using Microsoft.AspNetCore.Http;

namespace Chirp.Application.Common.Interfaces
{
    public interface IFirebaseService
    {
        Task<string?> UploadFile(IFormFile file, string token);
        // Other methods as needed...
    }
}
