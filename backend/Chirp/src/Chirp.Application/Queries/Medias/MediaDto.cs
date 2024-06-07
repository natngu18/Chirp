using AutoMapper;
using Chirp.Domain.Entities;
using Chirp.Domain.Enums;

namespace Chirp.Application.Queries.Medias
{
    public class MediaDto
    {
        public string Url { get; set; }
        public MediaType Type { get; set; }

        private class Mapping : Profile
        {
            public Mapping()
            {
                CreateMap<Media, MediaDto>();
            }
        }
    }
}
