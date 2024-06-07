namespace Chirp.Application.IntegrationTests
{
    [CollectionDefinition(nameof(DockerWebAppFactory))]
    public class SharedFixtureCollection : ICollectionFixture<DockerWebAppFactory>
    { }
}
