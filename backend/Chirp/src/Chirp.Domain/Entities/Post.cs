namespace Chirp.Domain.Entities
{
    public class Post : BaseEntity<int>, ISoftDeletable
    {
        //public int? OriginalPostId { get; set; }
        //public Post? OriginalPost { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime? DeletedAt { get; set; }
        public string AuthorId { get; set; }
        public User Author { get; set; }
        public IList<Media> Medias { get; set; } = new List<Media>();
        //public int? ParentPostId { get; set; }
        public Post? ParentPost { get; set; }
        public ICollection<Post> ChildPosts { get; set; } = new List<Post>();
        public string Text { get; set; }
        public ICollection<Like> Likes { get; set; } = new List<Like>();


    }
}
