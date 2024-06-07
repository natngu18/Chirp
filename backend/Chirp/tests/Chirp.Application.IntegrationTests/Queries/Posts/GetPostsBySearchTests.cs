using Bogus;
using Chirp.Application.Queries.Posts;
using Chirp.Application.Queries.Posts.GetPostsBySearch;
using Chirp.Domain.Entities;
using FluentAssertions;
using Meziantou.Extensions.Logging.Xunit;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using Xunit.Abstractions;

namespace Chirp.Application.IntegrationTests.Queries.Posts
{
    [Collection(nameof(DockerWebAppFactory))]
    public class GetPostsBySearchTests : IAsyncLifetime
    {
        private readonly DockerWebAppFactory _factory;
        private readonly ITestOutputHelper _output;
        private readonly HttpClient _client;
        private readonly string _randomWord;
        private readonly Faker<Post> _postFaker;
        public GetPostsBySearchTests(DockerWebAppFactory factory, ITestOutputHelper output)
        {
            _factory = factory;
            _client = factory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "Test token");
            _randomWord = new Faker().Lorem.Word();
            _postFaker = new Faker<Post>()
                .RuleFor(p => p.Text, f => $"This is a post with a random word: {_randomWord}");
            _output = output;

            factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureLogging(logging =>
                {
                    logging.ClearProviders();
                    logging.SetMinimumLevel(LogLevel.Warning);
                    logging.Services.AddSingleton<ILoggerProvider>(new XUnitLoggerProvider(_output));
                });
            });
        }

        public async Task InitializeAsync()
        {
            await _factory.InitializeDatabase();
        }

        public async Task DisposeAsync()
        {
            await _factory.ResetDatabase();
        }

        [Fact]
        public async Task Get_ShouldReturnPosts_WhenSearchTextIsSubsetOfPostText()
        {
            // Arrange
            var post = _postFaker.Generate();
            var query = new GetPostsBySearchQuery
            {
                SearchText = _randomWord,
            };
            var formData = new MultipartFormDataContent();
            formData.Add(new StringContent(post.Text), "Text");

            var postResponse = await _client.PostAsync("/api/posts", formData);

            postResponse.EnsureSuccessStatusCode();
            var createdPostId = await postResponse.Content.ReadAsStringAsync();
            if (int.TryParse(createdPostId, out int postId))
            {
                // Wait for kafka consumer to index data in elastic search before acting
                await ElasticsearchHelper.WaitForPostIndexingInElasticSearch(postId);
                // Act
                var response = await _client.GetAsync($"/api/posts?searchText={query.SearchText}");
                var jsonResponse = await response.Content.ReadAsStringAsync();
                _output.WriteLine(jsonResponse);
                var result = JsonConvert.DeserializeObject<PaginatedList<PostBriefResponse>>(jsonResponse);
                // Assert
                response.EnsureSuccessStatusCode();
                result.Items.Should().NotBeEmpty();
                result.Items.Should().Contain(p =>
                    p.Id == postId &&
                    p.Text.Contains($"<strong>{_randomWord}</strong>") &&
                    p.Author.Id == _factory.DefaultUserId
                );
            }
            else
            {
                // createdPostId is not a valid integer
                throw new Exception("Unexpected non-integer response from create post endpoint");
            }
        }

        [Fact]
        public async Task Get_ShouldReturnEmptyPosts_WhenSearchTextIsNotIncludedInAnyPosts()
        {
            // Arrange
            var post = new Post { Text = "Hello this is test post. " };
            var query = new GetPostsBySearchQuery
            {
                SearchText = _randomWord,
            };
            var formData = new MultipartFormDataContent();
            formData.Add(new StringContent(post.Text), "Text");

            var postResponse = await _client.PostAsync("/api/posts", formData);

            postResponse.EnsureSuccessStatusCode();
            var createdPostId = await postResponse.Content.ReadAsStringAsync();
            if (int.TryParse(createdPostId, out int postId))
            {
                // Wait for kafka consumer to index data in elastic search before acting
                await ElasticsearchHelper.WaitForPostIndexingInElasticSearch(postId);
                // Act
                var response = await _client.GetAsync($"/api/posts?searchText={query.SearchText}");
                var jsonResponse = await response.Content.ReadAsStringAsync();
                _output.WriteLine(jsonResponse);
                var result = JsonConvert.DeserializeObject<PaginatedList<PostBriefResponse>>(jsonResponse);
                // Assert
                response.EnsureSuccessStatusCode();
                result.Items.Should().BeEmpty();
            }
            else
            {
                // createdPostId is not a valid integer
                throw new Exception("Unexpected non-integer response from create post endpoint");
            }

        }
    }
}
