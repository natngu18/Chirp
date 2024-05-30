using AutoMapper;
using Chirp.Application.Queries.Medias;
using Chirp.Domain.Entities;

namespace Chirp.Application.Queries.Users
{
    public class UserDetailedResponse : UserResponse
    {
        public int FollowersCount { get; set; }
        public int FollowingsCount { get; set; }
        public MediaDto? BackgroundImage { get; set; }
        private class Mapping : Profile
        {
            public Mapping()
            {
                CreateMap<User, UserDetailedResponse>()
                    // inherit mappings
                    .IncludeBase<User, UserResponse>()
                    .ForMember(u => u.FollowersCount, o => o.MapFrom(s => s.Followers.Count()))
                    .ForMember(u => u.FollowingsCount, o => o.MapFrom(s => s.Followings.Count()))
                    .ForMember(
                       u => u.BackgroundImage,
                       o => o.MapFrom(s => s.Medias.FirstOrDefault(m => m.IsBackground))
                   );
            }
        }
    }
}
