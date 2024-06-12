using Chirp.Application.Common.Exceptions;
using Chirp.Application.Common.Interfaces;
using Chirp.Infrastructure.Firebase;
using Firebase.Storage;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using System.Text.RegularExpressions;

namespace Chirp.Infrastructure
{

    public class FirebaseService : IFirebaseService
    {
        private readonly string _bucketName;
        private readonly string _firebaseStorageBaseUrl;
        private readonly IWebHostEnvironment _env;

        public FirebaseService(IConfiguration configuration, IWebHostEnvironment env)
        {
            _env = env;
            _bucketName = configuration.GetValue<string>("FIREBASE_BUCKETNAME");

            if (env.IsDevelopment())
            {
                _firebaseStorageBaseUrl = configuration.GetValue<string>("FIREBASE_DEV_STORAGE_BASEURL") + _bucketName;

            }
            else if (env.IsProduction())
            {
                _firebaseStorageBaseUrl = configuration.GetValue<string>("FIREBASE_STORAGE_BASEURL") + _bucketName;
            }
            else
            {
                throw new Exception("Environment not set");
            }
        }
        public bool IsFirebaseStorageUrl(string url)
        {
            return url.StartsWith(_firebaseStorageBaseUrl);
        }
        public async Task DeleteFile(string url, string token)
        {
            var storage = new FirebaseStorage(
                _bucketName, // bucket name
                new FirebaseStorageOptions
                {
                    AuthTokenAsyncFactory = () => Task.FromResult(token),
                    ThrowOnCancel = true // when you cancel the delete operation, exception is thrown. By default no exception is thrown
                });
            string fileName;
            // Regex to extract filename from REAL firebase storage URL and emulater
            Regex regex = new Regex(@".+(\/|%2F)(.+)\?.+");
            Match match = regex.Match(url);
            if (match.Success)
            {
                fileName = match.Groups[2].Value;
            }
            else
            {
                throw new Exception("Invalid firebase storage URL");
            }

            try
            {
                if (_env.IsDevelopment())
                {
                    string downloadUrl = _firebaseStorageBaseUrl + "/o/" + Uri.EscapeDataString(string.Join("/", ["media", fileName]));
                    string resultContent = "N/A";
                    try
                    {
                        using HttpClient http = await storage.Options.CreateHttpClientAsync().ConfigureAwait(continueOnCapturedContext: false);
                        HttpResponseMessage result = await http.DeleteAsync(downloadUrl).ConfigureAwait(continueOnCapturedContext: false);
                        resultContent = await result.Content.ReadAsStringAsync().ConfigureAwait(continueOnCapturedContext: false);
                        result.EnsureSuccessStatusCode();
                    }
                    catch (Exception innerException)
                    {
                        throw new FirebaseStorageException(downloadUrl, resultContent, innerException);
                    }
                }
                else
                {
                    await storage
                       .Child("media")
                       .Child(fileName)
                       .DeleteAsync();
                }

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
                if (_env.IsDevelopment())
                {
                    string targetUrl = _firebaseStorageBaseUrl + "/o?name=" + Uri.EscapeDataString(string.Join("/", ["media", fileName]));
                    string downloadUrl = _firebaseStorageBaseUrl + "/o/" + Uri.EscapeDataString(string.Join("/", ["media", fileName])) + "?alt=media&token=";
                    mediaUrl = await new FirebaseStorageTask(storage.Options, targetUrl, downloadUrl, file.OpenReadStream(), cancellation.Token, null);

                }
                else
                {
                    mediaUrl = await storage
                        .Child("media")
                        .Child(fileName)
                    .PutAsync(file.OpenReadStream(), cancellation.Token);
                }


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
