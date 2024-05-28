using AutoMapper;
using Chirp.Domain.Entities;

namespace Chirp.Application.Queries.Users
{
    public class UserDetailedResponse : UserResponse
    {
        public int FollowersCount { get; set; }
        public int FollowingsCount { get; set; }
        private class Mapping : Profile
        {
            public Mapping()
            {
                CreateMap<User, UserDetailedResponse>()
                    .ForMember(u => u.FollowersCount, o => o.MapFrom(s => s.Followers.Count()))
                    .ForMember(u => u.FollowingsCount, o => o.MapFrom(s => s.Followings.Count()));
            }
        }
    }
}
