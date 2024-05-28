using AutoMapper;
using Chirp.Domain.Entities;

namespace Chirp.Application.Queries.Users
{
    public class UserBriefResponse : BaseUserDto
    {
        public bool IsFollowing { get; set; }
        private class Mapping : Profile
        {
            public Mapping()
            {
                CreateMap<User, UserBriefResponse>()
                    .ForMember(u => u.IsFollowing, opt => opt.Ignore());
            }
        }
    }
}
