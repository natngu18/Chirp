using Chirp.Domain.Enums;

namespace Chirp.Domain.Entities
{
    public class Media : BaseEntity<int>
    {
        public string Url { get; set; }
        public MediaType Type { get; set; }
        public User User { get; set; }
        public string UserId { get; set; }
        public bool IsAvatar { get; set; }
        public bool IsBackground { get; set; }
        // All medias are associated with a user,
        // but not all medias are associated with a post. (avatar, background image)
        public Post? Post { get; set; }
        public int? PostId { get; set; }
    }
}
