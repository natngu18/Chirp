using Microsoft.AspNetCore.Http;

namespace Chirp.Application.Common.Interfaces
{
    public interface IFirebaseService
    {
        Task<string?> UploadFile(IFormFile file, string token);
        Task DeleteFile(string fileName, string token);
        bool IsFirebaseStorageUrl(string url);
    }
}
