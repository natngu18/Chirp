using Chirp.Domain.Entities;
using Newtonsoft.Json;
using System.Text;

namespace Chirp.Application.IntegrationTests
{
    public static class ElasticsearchHelper
    {
        public static async Task DeleteUserDocumentsFromElasticSearch()
        {
            var client = new HttpClient();
            var query = new
            {
                query = new { match_all = new { } }
            };
            var json = JsonConvert.SerializeObject(query);
            var data = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await client.PostAsync("http://localhost:9200/users/_delete_by_query", data);
            if (!response.IsSuccessStatusCode)
            {
                throw new Exception("Failed to delete all user documents from Elasticsearch.");
            }
        }

        public static async Task DeletePostDocumentsFromElasticSearch()
        {
            var client = new HttpClient();
            var query = new
            {
                query = new { match_all = new { } }
            };
            var json = JsonConvert.SerializeObject(query);
            var data = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await client.PostAsync("http://localhost:9200/posts/_delete_by_query", data);
            if (!response.IsSuccessStatusCode)
            {
                throw new Exception("Failed to delete all user documents from Elasticsearch.");
            }
        }

        public static async Task WaitForPostIndexingInElasticSearch(int postId)
        {
            var client = new HttpClient();
            var retryCount = 0;
            var maxRetryCount = 10; // Maximum number of retries
            var delay = TimeSpan.FromSeconds(3); // Delay between each retry

            while (retryCount < maxRetryCount)
            {
                var response = await client.GetAsync($"http://localhost:9200/posts/_doc/{postId}");

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var elasticSearchResponse = JsonConvert.DeserializeObject<ElasticsearchResponse<Post>>(content);

                    if (elasticSearchResponse != null && elasticSearchResponse.Found)
                    {
                        return; // Data has been indexed, exit the method
                    }
                }

                // Data has not been indexed yet, wait and retry
                await Task.Delay(delay);
                retryCount++;
            }

            throw new Exception("Data was not indexed in Elasticsearch within the expected time.");
        }
        public static async Task WaitForUserIndexingInElasticSearch(string userId)
        {
            var client = new HttpClient();
            var retryCount = 0;
            var maxRetryCount = 10; // Maximum number of retries
            var delay = TimeSpan.FromSeconds(3); // Delay between each retry

            while (retryCount < maxRetryCount)
            {
                var response = await client.GetAsync($"http://localhost:9200/users/_doc/{userId}");

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var elasticSearchResponse = JsonConvert.DeserializeObject<ElasticsearchResponse<User>>(content);


                    if (elasticSearchResponse != null && elasticSearchResponse.Found)
                    {
                        return; // Data has been indexed, exit the method
                    }
                }

                // Data has not been indexed yet, wait and retry
                await Task.Delay(delay);
                retryCount++;
            }

            throw new Exception("Data was not indexed in Elasticsearch within the expected time.");
        }

        public static async Task WaitForElasticSearchUserModification(string userId, User expectedUser)
        {
            var client = new HttpClient();
            var retryCount = 0;
            var maxRetryCount = 10; // Maximum number of retries
            var delay = TimeSpan.FromSeconds(3); // Delay between each retry

            while (retryCount < maxRetryCount)
            {
                var response = await client.GetAsync($"http://localhost:9200/users/_doc/{userId}");

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var elasticSearchResponse = JsonConvert.DeserializeObject<ElasticsearchResponse<User>>(content);

                    if (elasticSearchResponse != null && elasticSearchResponse.Found)
                    {
                        // Elasticsearch only stores modifiable field of display name
                        if (elasticSearchResponse.Source.DisplayName == expectedUser.DisplayName)
                        {
                            return; // User has been modified, exit the method
                        }
                    }
                }

                // User has not been modified yet, wait and retry
                await Task.Delay(delay);
                retryCount++;
            }

            throw new Exception("User was not modified in Elasticsearch within the expected time.");
        }

    }
}
