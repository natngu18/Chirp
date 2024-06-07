namespace Chirp.Domain.Entities
{
    public class User : BaseEntity<string>
    {
        public string Username { get; set; }
        public string? Location { get; set; }
        public string? Bio { get; set; }
        public string DisplayName { get; set; }
        public ICollection<Post> Posts { get; set; } = new List<Post>();
        public ICollection<Follow> Followers { get; set; } = new List<Follow>();
        public ICollection<Follow> Followings { get; set; } = new List<Follow>();
        public ICollection<Like> Likes { get; set; } = new List<Like>();
        public ICollection<Media> Medias { get; set; } = new List<Media>();

    }
}
