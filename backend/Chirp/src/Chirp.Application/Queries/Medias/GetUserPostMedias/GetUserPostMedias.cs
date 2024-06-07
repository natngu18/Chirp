using AutoMapper;
using Chirp.Application.Common;
using Chirp.Application.Common.Interfaces;
using Chirp.Application.Common.Mapping;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Chirp.Application.Queries.Medias.GetUserPostMedias
{

    public record GetUserPostMediasQuery : PaginationParams, IRequest<PaginatedList<PostMediasResponse>>
    {
        public string Username { get; init; }
    };

    public class GetUserPostMediasQueryHandler : IRequestHandler<GetUserPostMediasQuery, PaginatedList<PostMediasResponse>>
    {
        private readonly IMapper _mapper;
        private readonly IAppDbContext _dbContext;
        private readonly ICurrentUser _currentUser;

        public GetUserPostMediasQueryHandler(IMapper mapper, IAppDbContext appDbContext, ICurrentUser currentUser)
        {
            _mapper = mapper;
            _dbContext = appDbContext;
            _currentUser = currentUser;
        }

        public async Task<PaginatedList<PostMediasResponse>> Handle(GetUserPostMediasQuery request, CancellationToken cancellationToken)
        {
            var postMedias = await _dbContext.Medias
                .Include(m => m.User)
                .Where(m => m.PostId != null && m.User.Username == request.Username)
                .OrderByDescending(m => m.CreatedAt)
                .GroupBy(m => m.PostId)
                .Select(g => new PostMediasResponse
                {
                    PostId = g.Key.Value,
                    Medias = g.Select(m => _mapper.Map<MediaDto>(m)).ToList()
                })
                .PaginatedListAsync(request.PageNumber, request.PageSize);

            return postMedias;
        }
    }
}
