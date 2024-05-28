using AutoMapper;
using Chirp.Application.Queries.Users;
using Chirp.Domain.Entities;

namespace Chirp.Application.Queries.Posts
{
    public class PostBriefResponse
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        //public bool IsDeleted { get; set; }
        //public DateTime? DeletedAt { get; set; }
        public BaseUserDto Author { get; set; }
        public IList<Media> Medias { get; set; }

        // This only shows in search results...
        public string? ParentPostAuthorUsername { get; set; }
        public int ChildCount { get; set; }
        public bool IsLiked { get; set; }
        public int LikeCount { get; set; }
        public string Text { get; set; }


        private class Mapping : Profile
        {
            public Mapping()
            {

                CreateMap<Post, PostBriefResponse>()
                    //.ForMember(dest => dest.ChildCount, opt => opt.Ignore())
                    .ForMember(dest => dest.ChildCount, opt => opt.MapFrom(p => p.ChildPosts.Count))
                    .ForMember(dest => dest.IsLiked, opt => opt.Ignore())
                    //.ForMember(dest => dest.IsLiked, opt => opt.MapFrom((src, dest, destMember, context) => src.Likes.Any(l => l.UserId == (string)context.Items["CurrentUserId"])))
                    .ForMember(dest => dest.LikeCount, opt => opt.MapFrom(p => p.Likes.Count))
                    //.ForMember(dest => dest.ParentPostAuthorUsername, opt => opt.Ignore());
                    .ForMember(dest => dest.ParentPostAuthorUsername, opt => opt.MapFrom(p => p.ParentPost != null ? p.ParentPost.Author.Username : null));

            }
        }
    }
}
