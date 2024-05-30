using Chirp.Domain.Entities;
using Chirp.Infrastructure.Debezium;
using Confluent.Kafka;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Nest;
using Newtonsoft.Json;

namespace Chirp.Infrastructure
{
    public class KafkaConsumerService : BackgroundService
    {
        private readonly IElasticClient _elasticClient;
        private readonly IConfiguration _configuration;
        public KafkaConsumerService(IElasticClient elasticClient, IConfiguration configuration)
        {
            _elasticClient = elasticClient;
            _configuration = configuration;
        }

        // TODO: implement retry
        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            return Task.Run(async () =>
            {
                var consumerConfig = new ConsumerConfig
                {
                    BootstrapServers = _configuration["Kafka:BootstrapServers"],
                    ClientId = "my-consumer",
                    GroupId = "debezium-group",
                    AutoOffsetReset = AutoOffsetReset.Earliest,
                    EnableAutoCommit = true,
                    StatisticsIntervalMs = 5000,
                    SessionTimeoutMs = 6000,
                    HeartbeatIntervalMs = 2000,
                    EnablePartitionEof = true,
                };

                using (var consumerBuilder = new ConsumerBuilder<string, string>(consumerConfig).Build())
                {

                    consumerBuilder.Subscribe(new List<string> { "postgres.public.Posts", "postgres.public.Users" });
                    while (!stoppingToken.IsCancellationRequested)
                    {
                        var consumerData = consumerBuilder.Consume(TimeSpan.FromSeconds(3));
                        if (consumerData != null && consumerData?.Message != null)
                        {
                            System.Diagnostics.Debug.WriteLine($"Consumed message '{consumerData.Message.Value}' at: '{consumerData.TopicPartitionOffset}'");
                            var debeziumEvent = JsonConvert.DeserializeObject<DebeziumPayload>(consumerData.Message.Value);

                            if (debeziumEvent == null)
                            {
                                continue;
                            }

                            var tableSource = debeziumEvent.Payload.Source.Table;
                            var op = debeziumEvent.Payload.Op;

                            if (tableSource == "Posts")
                            {
                                Post before = null;
                                Post after = null;

                                if (debeziumEvent.Payload.Before != null)
                                {
                                    before = debeziumEvent.Payload.Before.ToObject<Post>();
                                }

                                if (debeziumEvent.Payload.After != null)
                                {
                                    after = debeziumEvent.Payload.After.ToObject<Post>();
                                }
                                // Created record in primary DB
                                if (op == "c")
                                {
                                    var response = await _elasticClient.IndexDocumentAsync<Post>(after);
                                }
                                // Updated record in primary DB
                                else if (op == "u")
                                {
                                    await _elasticClient.UpdateAsync<Post>(after.Id, u => u.Doc(after));
                                }
                                // Deleted record in primary DB
                                else if (op == "d")
                                {

                                    await _elasticClient.DeleteAsync<Post>(before.Id);
                                }
                            }
                            else if (tableSource == "Users")
                            {
                                User before = null;
                                User after = null;

                                if (debeziumEvent.Payload.Before != null)
                                {
                                    before = debeziumEvent.Payload.Before.ToObject<User>();
                                }

                                if (debeziumEvent.Payload.After != null)
                                {
                                    after = debeziumEvent.Payload.After.ToObject<User>();
                                }
                                // Created record in primary DB
                                if (op == "c")
                                {
                                    await _elasticClient.IndexDocumentAsync<User>(after);
                                }
                                // Updated record in primary DB
                                else if (op == "u")
                                {
                                    await _elasticClient.UpdateAsync<User>(after.Id, u => u.Doc(after));
                                }
                                // Deleted record in primary DB
                                else if (op == "d")
                                {
                                    await _elasticClient.DeleteAsync<User>(before.Id);
                                }
                            }


                        }
                    }

                };
            }, stoppingToken);
        }

    }

}
