namespace Chirp.Domain.Entities
{
    public class User : BaseEntity<string>
    {
        public string Username { get; set; }
        public string? Location { get; set; }
        public string? Bio { get; set; }

        // Must be synchronized with Firebase user
        public Media? Avatar { get; set; }
        // TODO: This may also be unecessary... we have it in firebase user
        public string DisplayName { get; set; }
        public ICollection<Post> Posts { get; set; } = new List<Post>();
        public ICollection<Follow> Followers { get; set; } = new List<Follow>();
        public ICollection<Follow> Followings { get; set; } = new List<Follow>();
        public ICollection<Like> Likes { get; set; } = new List<Like>();

    }
}
