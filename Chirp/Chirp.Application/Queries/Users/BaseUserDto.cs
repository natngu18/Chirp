using AutoMapper;
using Chirp.Domain.Entities;

namespace Chirp.Application.Queries.Users
{
    public class BaseUserDto : BaseEntity<string>
    {
        public string Username { get; set; }
        public Media? Avatar { get; set; }
        public string DisplayName { get; set; }
        private class Mapping : Profile
        {
            public Mapping()
            {
                CreateMap<User, BaseUserDto>();
            }
        }
    }
}
