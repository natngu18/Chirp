using Newtonsoft.Json;
using System.Text.Json;

namespace Chirp.Application.IntegrationTests
{

    public class ElasticsearchResponse<T>
    {
        [JsonProperty("_index")]
        public string Index { get; set; }

        [JsonProperty("_id")]
        public string Id { get; set; }

        [JsonProperty("found")]
        public bool Found { get; set; }

        [JsonProperty("_source")]
        public T Source { get; set; }
    }

}
