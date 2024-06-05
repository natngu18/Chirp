using Chirp.Application.Commands.Users.CreateUser;
using Chirp.Infrastructure;
using Chirp.Presentation;
using DotNet.Testcontainers.Builders;
using DotNet.Testcontainers.Containers;
using DotNet.Testcontainers.Networks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Npgsql;
using Respawn;
using System.Data.Common;
using System.Net.Http.Json;
using System.Text;
using System.Text.RegularExpressions;
using Testcontainers.Elasticsearch;
using Testcontainers.PostgreSql;

namespace Chirp.Application.IntegrationTests
{
    public partial class DockerWebAppFactory : WebApplicationFactory<IApiMarker>, IAsyncLifetime
    {
        private readonly IContainer _zookeeper;
        private readonly IContainer _broker;
        private readonly IContainer _debezium;
        private readonly PostgreSqlContainer _postgreSqlContainer;
        private readonly INetwork _networkBuilder;
        private readonly ElasticsearchContainer _elasticsearch;
        public string DefaultUsername { get; private set; }
        //// Should be firebase UID, and exist in project
        public readonly string DefaultUserId = "Or3ZeuJhVTaqxSIeN2Ku7zKhMwk2";
        private Respawner _respawner;
        private DbConnection _connection;

        public DockerWebAppFactory()
        {
            _networkBuilder = new NetworkBuilder()
                .Build();

            _postgreSqlContainer = new PostgreSqlBuilder()
                .WithImage("postgres:latest")
                .WithExposedPort(5432)
                .WithDatabase("chirp_db")
                .WithUsername("postgres")
                .WithPassword("postgres")
                .WithNetwork(_networkBuilder)
                .WithNetworkAliases("postgres")
                .WithEnvironment("POSTGRES_INITDB_ARGS", "-c wal_level=logical")
                //.WithCommand("postgres", "-c", "wal_level=logical")
                .Build();
            _zookeeper = new ContainerBuilder()
                .WithImage("confluentinc/cp-zookeeper")
                .WithPortBinding(2181, 2181)
                .WithEnvironment("ZOOKEEPER_CLIENT_PORT", "2181")
                .WithEnvironment("ZOOKEEPER_TICK_TIME", "2000")
                .WithNetwork(_networkBuilder)
                .WithNetworkAliases("zookeeper")
                .Build();

            _broker = new ContainerBuilder()
                .WithImage("confluentinc/cp-kafka")
                .WithPortBinding(29092, 29092)
                .WithPortBinding(9092, 9092)
                .WithPortBinding(9101, 9101)
                .WithEnvironment("KAFKA_BROKER_ID", "1")
                .WithEnvironment("KAFKA_ZOOKEEPER_CONNECT", "zookeeper:2181")
                .WithEnvironment("KAFKA_LISTENER_SECURITY_PROTOCOL_MAP", "PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT")
                .WithEnvironment("KAFKA_ADVERTISED_LISTENERS", "PLAINTEXT://broker:29092,PLAINTEXT_HOST://localhost:9092")
                .WithEnvironment("KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR", "1")
                .WithEnvironment("KAFKA_TRANSACTION_STATE_LOG_MIN_ISR", "1")
                .WithEnvironment("KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR", "1")
                .WithEnvironment("KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS", "0")
                .WithEnvironment("KAFKA_AUTO_CREATE_TOPICS_ENABLE", "true")
                .WithEnvironment("KAFKA_JMX_PORT", "9101")
                .WithEnvironment("KAFKA_JMX_HOSTNAME", "localhost")
                .WithNetwork(_networkBuilder)
                .WithNetworkAliases("broker")
                .DependsOn(_zookeeper)
                .Build();

            _debezium = new ContainerBuilder()
                .WithImage("debezium/connect:latest")
                .WithPortBinding(8083, 8083)
                .WithEnvironment("BOOTSTRAP_SERVERS", "broker:29092")
                .WithEnvironment("GROUP_ID", "1")
                .WithEnvironment("CONFIG_STORAGE_TOPIC", "connect_configs")
                .WithEnvironment("STATUS_STORAGE_TOPIC", "connect_statuses")
                .WithEnvironment("OFFSET_STORAGE_TOPIC", "connect_offsets")
                .WithEnvironment("KEY_CONVERTER", "org.apache.kafka.connect.json.JsonConverter")
                .WithEnvironment("VALUE_CONVERTER", "org.apache.kafka.connect.json.JsonConverter")
                .DependsOn(_broker)
                .DependsOn(_postgreSqlContainer)
                .WithNetwork(_networkBuilder)
                .WithNetworkAliases("debezium")
                .Build();


            _elasticsearch = new ElasticsearchBuilder()
                .WithImage("docker.elastic.co/elasticsearch/elasticsearch:8.13.4")
                .WithPortBinding(9200, 9200)
                .WithEnvironment("CLI_JAVA_OPTS", "-Xms2g -Xmx2g")
                .WithEnvironment("bootstrap.memory_lock", "true")
                .WithEnvironment("discovery.type", "single-node")
                .WithEnvironment("xpack.security.enabled", "false")
                .WithEnvironment("xpack.security.enrollment.enabled", "false")
                .Build();
        }
        override protected void ConfigureWebHost(IWebHostBuilder builder)
        {

            builder.ConfigureTestServices(services =>
            {
                services.RemoveAll(typeof(DbContextOptions<AppDbContext>));
                services.RemoveAll(typeof(AppDbContext));
                services.AddDbContext<AppDbContext>(options =>
                {
                    options.UseNpgsql(_postgreSqlContainer.GetConnectionString());
                });
                services.AddAuthentication("Test")
                  .AddScheme<AuthenticationSchemeOptions, MockAuthHandler>(
                      "Test", options => { });
            });
        }

        // Create Default User
        public async Task InitializeDatabase()
        {
            var client = this.CreateClient();
            var userResponse = await client.PostAsJsonAsync("/api/users", new CreateUserCommand { Id = DefaultUserId });
            userResponse.EnsureSuccessStatusCode();
            var username = await userResponse.Content.ReadAsStringAsync();
            DefaultUsername = username;
            await ElasticsearchHelper.WaitForUserIndexingInElasticSearch(DefaultUserId);
        }

        public async Task ResetDatabase()
        {
            await _respawner.ResetAsync(_connection);
            // Debezium does not capture deletes from Respawner, so we have to manually delete the documents
            // (because Respawner truncates the tables (?))
            await ElasticsearchHelper.DeletePostDocumentsFromElasticSearch();
            await ElasticsearchHelper.DeleteUserDocumentsFromElasticSearch();
        }

        public async Task InitializeAsync()
        {
            await _postgreSqlContainer.StartAsync();
            await _debezium.StartAsync();
            await _zookeeper.StartAsync();
            await _broker.StartAsync();
            await _elasticsearch.StartAsync();
            // Connectors don't seem to create topic, have to do it manually
            await _broker.ExecAsync(new List<string> { "kafka-topics", "--create", "--bootstrap-server", "localhost:9092", "--replication-factor", "1", "--partitions", "1", "--topic", "postgres.public.Posts" });
            await _broker.ExecAsync(new List<string> { "kafka-topics", "--create", "--bootstrap-server", "localhost:9092", "--replication-factor", "1", "--partitions", "1", "--topic", "postgres.public.Users" });
            await AddConnectorToDebezium("C:\\Users\\srvth\\source\\repos\\Chirp\\user-connector.json");
            await AddConnectorToDebezium("C:\\Users\\srvth\\source\\repos\\Chirp\\connector.json");

            // Ensure tables are created (migration w/ entity framework)
            using var scope = Services.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            await dbContext.Database.EnsureCreatedAsync();

            // Configure Respawner after tables are created
            var respawnerOptions = new RespawnerOptions
            {
                SchemasToInclude = new[]
                   {
                        "public"
                    },
                DbAdapter = DbAdapter.Postgres
            };
            _connection = new NpgsqlConnection(_postgreSqlContainer.GetConnectionString());
            await _connection.OpenAsync();
            _respawner = await Respawner.CreateAsync(_connection, respawnerOptions);
        }

        async Task IAsyncLifetime.DisposeAsync()
        {
            await _zookeeper.DisposeAsync();
            await _broker.DisposeAsync();
            await _debezium.DisposeAsync();
            await _postgreSqlContainer.DisposeAsync();
            await _elasticsearch.DisposeAsync();
            await _networkBuilder.DisposeAsync();
        }

        private async Task AddConnectorToDebezium(string filePath)
        {
            var client = new HttpClient();

            var connectorJson = await File.ReadAllTextAsync(filePath);
            var content = new StringContent(connectorJson, Encoding.UTF8, "application/json");
            await Task.Delay(TimeSpan.FromSeconds(1)); // Wait for 1 second to avoid precision issues with DateTime.now
            var dateSince = DateTime.Now; // moment to start reading logs from debezium container
            var response = await client.PostAsync("http://localhost:8083/connectors", content);
            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception($"Failed to add connector to Debezium: {error}");
            }

            // Wait for the connector to succesfully be applied
            (string stdout, string stderr) logs = await _debezium.GetLogsAsync(since: dateSince);
            Regex pattern = new Regex(".*Searching for WAL resume position.*");
            while (!pattern.IsMatch(logs.stdout))
            {
                await Task.Delay(TimeSpan.FromSeconds(1));
                logs = await _debezium.GetLogsAsync(since: dateSince);
            }

        }

    }
}
