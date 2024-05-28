using Chirp.Domain.Enums;

namespace Chirp.Domain.Entities
{
    public class Media : BaseEntity<int>
    {
        public string Url { get; set; }
        public MediaType Type { get; set; }
    }
}
