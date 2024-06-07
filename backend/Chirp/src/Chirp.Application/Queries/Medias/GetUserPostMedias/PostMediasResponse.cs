namespace Chirp.Application.Queries.Medias.GetUserPostMedias
{
    public class PostMediasResponse
    {
        public int PostId { get; set; }
        public IList<MediaDto> Medias { get; set; }
    }
}
