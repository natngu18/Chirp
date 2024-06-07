using AutoMapper;
using Chirp.Domain.Entities;

namespace Chirp.Application.Queries.Users
{
    public class UserResponse : UserBriefResponse
    {
        public string? Location { get; set; }
        public string? Bio { get; set; }
        private class Mapping : Profile
        {
            public Mapping()
            {
                CreateMap<User, UserResponse>()
                    .IncludeBase<User, UserBriefResponse>();
            }
        }
    }

}
