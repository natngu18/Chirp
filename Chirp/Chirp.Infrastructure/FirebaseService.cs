using Chirp.Application.Common.Exceptions;
using Chirp.Application.Common.Interfaces;
using Chirp.Infrastructure.Firebase;
using Firebase.Storage;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace Chirp.Infrastructure
{
    public class FirebaseService : IFirebaseService
    {
        private readonly string _bucketName;
        public FirebaseService(IConfiguration configuration)
        {
            _bucketName = configuration.GetValue<string>("FIREBASE_BUCKETNAME");
        }
        public async Task<string?> UploadFile(IFormFile file, string token)
        {
            var cancellation = new CancellationTokenSource();
            var storage = new FirebaseStorage(
                _bucketName, // bucket name
                new FirebaseStorageOptions
                {
                    AuthTokenAsyncFactory = () => Task.FromResult(token),
                    ThrowOnCancel = true // when you cancel the upload, exception is thrown. By default no exception is thrown
                });
            string? mediaUrl = null;
            try
            {
                string fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                mediaUrl = await storage
                    .Child("media")
                    .Child(fileName)
                    .PutAsync(file.OpenReadStream(), cancellation.Token);
            }
            catch (FirebaseStorageException ex)
            {
                var errorResponse = JsonConvert.DeserializeObject<FirebaseErrorResponse>(ex.ResponseData);
                if (errorResponse.Error.Code == 403)
                {
                    throw new UnauthorizedException("Unauthorized: Invalid token or insufficient permissions.");
                }
                else
                {
                    throw new Exception($"An error occurred: {ex.Message}");
                }
            }

            return mediaUrl;
        }
    }
}
