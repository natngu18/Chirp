using AutoMapper;
using Chirp.Application.Queries.Medias;
using Chirp.Domain.Entities;

namespace Chirp.Application.Queries.Users
{
    public class BaseUserDto : BaseEntity<string>
    {
        public string Username { get; set; }
        public MediaDto Avatar { get; set; }
        public string DisplayName { get; set; }
        private class Mapping : Profile
        {
            public Mapping()
            {
                CreateMap<User, BaseUserDto>()
                     .ForMember(
                        u => u.Avatar,
                        o => o.MapFrom(s => s.Medias.FirstOrDefault(m => m.IsAvatar))
                    );
            }
        }
    }
}
