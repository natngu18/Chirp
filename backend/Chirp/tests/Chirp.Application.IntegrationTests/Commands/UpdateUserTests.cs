using Bogus;
using Chirp.Application.Commands.Users.UpdateUser;
using Chirp.Domain.Entities;
using Meziantou.Extensions.Logging.Xunit;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Net.Http.Headers;
using Xunit.Abstractions;

namespace Chirp.Application.IntegrationTests.Commands
{
    [Collection(nameof(DockerWebAppFactory))]

    public class UpdateUserTests : IAsyncLifetime
    {
        private readonly DockerWebAppFactory _factory;
        private readonly ITestOutputHelper _output;
        private readonly HttpClient _client;
        private readonly Faker<User> _userFaker = new Faker<User>()
            .RuleFor(u => u.DisplayName, f => f.Name.FullName());
        public UpdateUserTests(DockerWebAppFactory factory, ITestOutputHelper output)
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
        public async Task UpdateUserDisplayName_ShouldUpdateUserDisplayNameInElasticsearch()
        {
            var user = _userFaker.Generate();
            var updateUserCommand = new UpdateUserCommand
            {
                DisplayName = user.DisplayName,
                DeleteBackgroundImage = false
            };

            await ElasticsearchHelper.WaitForUserIndexingInElasticSearch(_factory.DefaultUserId);
            // Act
            var formData = new MultipartFormDataContent();
            formData.Add(new StringContent(user.DisplayName), "DisplayName");
            var updateUserResponse = await _client.PatchAsync($"/api/users/{_factory.DefaultUsername}", formData);

            // Assert
            await ElasticsearchHelper.WaitForElasticSearchUserModification(_factory.DefaultUserId, new User { Id = _factory.DefaultUserId, DisplayName = user.DisplayName });
        }
    }
}

