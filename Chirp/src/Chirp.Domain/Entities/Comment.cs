namespace Chirp.Domain.Entities
{
    public class Comment : BaseEntity<int>
    {
        public string Text { get; set; }

    }
}
