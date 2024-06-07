using AutoMapper;
using Chirp.Application.Common;
using Chirp.Application.Common.Interfaces;
using Chirp.Application.Queries.Medias;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Nest;

namespace Chirp.Application.Queries.Users.GetTopFollowedUsers
{

    public record GetTopFollowedUsersQuery : MediatR.IRequest<List<UserBriefResponse>>
    {
        public int UserCount { get; init; } = 5;
    };

    public class GetTopFollowedUsersQueryHandler : IRequestHandler<GetTopFollowedUsersQuery, List<UserBriefResponse>>
    {
        private readonly IElasticClient _elasticClient;
        private readonly IMapper _mapper;
        private readonly IAppDbContext _dbContext;
        private readonly ICurrentUser _currentUser;

        public GetTopFollowedUsersQueryHandler(IElasticClient elasticClient, IMapper mapper, IAppDbContext appDbContext, ICurrentUser currentUser)
        {
            _elasticClient = elasticClient;
            _mapper = mapper;
            _dbContext = appDbContext;
            _currentUser = currentUser;
        }

        public async Task<List<UserBriefResponse>> Handle(GetTopFollowedUsersQuery request, CancellationToken cancellationToken)
        {
            var users = await _dbContext.Users
                .Include(u => u.Followers)
                .Include(u => u.Medias.Where(m => m.IsAvatar))
                .OrderByDescending(u => u.Followers.Count)
                .Select(u => new UserBriefResponse
                {
                    Id = u.Id,
                    Avatar = _mapper.Map<MediaDto>(u.Medias.FirstOrDefault(m => m.IsAvatar)),
                    DisplayName = u.DisplayName,
                    Username = u.Username,
                    IsFollowing = u.Followers.Any(f => f.FollowerId == _currentUser.Id)
                })
                .Take(request.UserCount)
                .ToListAsync();

            return users;
        }
    }
}
