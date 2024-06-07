using Bogus;
using Chirp.Application.Commands.Users.UpdateUser;
using Chirp.Application.Queries.Search.GetSearchSuggestions;
using Chirp.Domain.Entities;
using FluentAssertions;
using Meziantou.Extensions.Logging.Xunit;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using Xunit.Abstractions;

namespace Chirp.Application.IntegrationTests.Queries.Search
{
    [Collection(nameof(DockerWebAppFactory))]
    public class GetSearchSuggestionsTests : IAsyncLifetime
    {
        private readonly DockerWebAppFactory _factory;
        private readonly ITestOutputHelper _output;
        private readonly HttpClient _client;
        private readonly Faker<User> _userFaker = new Faker<User>()
           .RuleFor(u => u.DisplayName, f => f.Name.FullName());
        public GetSearchSuggestionsTests(DockerWebAppFactory factory, ITestOutputHelper output)
        {
            _factory = factory;
            _client = factory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "Test token");

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
        public async Task Get_ShouldReturnDefaultUser_WhenSearchTextIsSubsetOfDefaultUsername()
        {
            // Arrange
            var query = new GetSearchSuggestionsQuery
            {
                SearchText = _factory.DefaultUsername.Substring(0, 3),
            };

            // Act
            var response = await _client.GetAsync($"/api/search/suggestions?searchText={query.SearchText}");

            var jsonResponse = await response.Content.ReadAsStringAsync();
            _output.WriteLine(jsonResponse);
            var result = JsonConvert.DeserializeObject<SearchSuggestionsResponse>(jsonResponse);
            // Assert
            response.EnsureSuccessStatusCode();
            result.Users.Should().NotBeEmpty();
            result.Users.Any(u => u.Username == _factory.DefaultUsername).Should().BeTrue();
        }

        [Fact]
        public async Task Get_ShouldReturnDefaultUser_WhenSearchTextIsDefaultUsername()
        {
            // Arrange
            var query = new GetSearchSuggestionsQuery
            {
                SearchText = _factory.DefaultUsername,
            };

            // Act
            var response = await _client.GetAsync($"/api/search/suggestions?searchText={query.SearchText}");

            var jsonResponse = await response.Content.ReadAsStringAsync();
            _output.WriteLine(jsonResponse);
            var result = JsonConvert.DeserializeObject<SearchSuggestionsResponse>(jsonResponse);
            // Assert
            response.EnsureSuccessStatusCode();
            result.Users.Should().NotBeEmpty();
            result.Users.Any(u => u.Username == _factory.DefaultUsername).Should().BeTrue();
        }

        [Fact]
        public async Task Get_ShouldReturnEmptyUserList_WhenSearchTextIsNotSubsetOfDefaultUsername()
        {
            // Arrange
            var query = new GetSearchSuggestionsQuery
            {
                // Should exclude characters from default username and display name
                SearchText = "zzzzzzzzzz",
            };

            // Act
            var response = await _client.GetAsync($"/api/search/suggestions?searchText={query.SearchText}");

            // Assert
            response.EnsureSuccessStatusCode();
            var jsonResponse = await response.Content.ReadAsStringAsync();
            _output.WriteLine(jsonResponse);
            var result = JsonConvert.DeserializeObject<SearchSuggestionsResponse>(jsonResponse);
            result.Users.Should().BeEmpty();
        }

        [Fact]
        public async Task Get_ShouldReturnDefaultUser_WhenSearchTextIsSubsetOfDefaultDisplayName()
        {
            // Arrange
            var user = _userFaker.Generate();
            var updateUserCommand = new UpdateUserCommand
            {
                DisplayName = user.DisplayName,
                DeleteBackgroundImage = false
            };

            var query = new GetSearchSuggestionsQuery
            {
                SearchText = updateUserCommand.DisplayName,
            };
            // Modify Default user displayname
            var formData = new MultipartFormDataContent();
            formData.Add(new StringContent(user.DisplayName), "DisplayName");
            var updateUserResponse = await _client.PatchAsync($"/api/users/{_factory.DefaultUsername}", formData);
            await ElasticsearchHelper.WaitForElasticSearchUserModification(_factory.DefaultUserId, new User { Id = _factory.DefaultUserId, DisplayName = user.DisplayName });

            // Act
            var response = await _client.GetAsync($"/api/search/suggestions?searchText={query.SearchText}");

            var jsonResponse = await response.Content.ReadAsStringAsync();
            _output.WriteLine(jsonResponse);

            var result = JsonConvert.DeserializeObject<SearchSuggestionsResponse>(jsonResponse);
            // Assert
            response.EnsureSuccessStatusCode();
            result.Users.Should().NotBeEmpty();
            result.Users.Any(u => u.Username == _factory.DefaultUsername).Should().BeTrue();
        }


    }
}
