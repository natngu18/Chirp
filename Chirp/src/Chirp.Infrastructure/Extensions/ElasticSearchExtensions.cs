using Chirp.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Nest;


namespace Chirp.Infrastructure.Extensions
{
    public static class ElasticSearchExtensions
    {
        public static void AddElasticsearch(
           this IServiceCollection services, IConfiguration configuration)
        {
            var url = configuration["ELKConfiguration:url"];

            var settings = new ConnectionSettings(new Uri(url)).BasicAuthentication("elastic", "changeme")
                .PrettyJson()
                .DefaultMappingFor<Post>(p => p
                    .Ignore(p => p.Author)
                    .Ignore(p => p.ParentPost)
                    .Ignore(p => p.Medias)
                    .Ignore(p => p.ChildPosts)
                    .Ignore(p => p.Likes)
                    // Don't ignore CreatedAt for time decay scoring
                    .Ignore(p => p.IsDeleted)
                    .Ignore(p => p.DeletedAt)
                    .Ignore(p => p.UpdatedAt)
                    .IdProperty(p => p.Id)
                    .IndexName("posts")
                )
                .DefaultMappingFor<User>(u => u
                    .Ignore(u => u.Medias)
                    //.Ignore(u => u.CreatedAt)
                    //.Ignore(u => u.UpdatedAt)
                    .Ignore(u => u.Followers)
                    .Ignore(u => u.Followings)
                    .Ignore(u => u.Posts)
                    .Ignore(u => u.Bio)
                    .Ignore(u => u.Location)
                    .Ignore(u => u.Likes)
                    //.Ignore(u => u.DisplayName)
                    .IdProperty(u => u.Id)
                    .IndexName("users")
                );


            var client = new ElasticClient(settings);
            services.AddSingleton<IElasticClient>(client);
            // Posts index
            client.Indices.Create("posts", index => index
                .Map<Post>(x => x.AutoMap()
                    .Properties(ps => ps
                        .SearchAsYouType(s => s
                            .Name(n => n.Text)
                            .MaxShingleSize(3)
                      ))
                ));
            // Users index
            client.Indices.Create("users", c => c
                .Settings(s => s
                    .Setting("index.max_ngram_diff", 10)
                    .Analysis(a => a
                        .Tokenizers(t => t
                            .NGram("user_ngram_tokenizer", ng => ng
                                .MinGram(1)
                                .MaxGram(10)
                            )
                        )
                        .Analyzers(an => an
                            .Custom("user_analyzer", ca => ca
                                .Tokenizer("user_ngram_tokenizer")
                                .Filters("lowercase", "asciifolding")
                            )
                        )
                    )
                )
                .Map<User>(m => m
                    .AutoMap()
                    .Properties(ps => ps
                        .Text(t => t
                            .Name(n => n.Username)
                            .Fields(f => f
                                .Text(te => te
                                    .Name("ngram")
                                    .Analyzer("user_analyzer")
                                )
                            )
                        )
                        .Text(t => t
                            .Name(n => n.DisplayName)
                            .Fields(f => f
                                .Text(te => te
                                    .Name("ngram")
                                    .Analyzer("user_analyzer")
                                )
                            )
                        )
                    )
                )
            );


        }


    }
}
