using AutoMapper;
using AutoMapper.QueryableExtensions;
using Chirp.Application.Common;
using Chirp.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Chirp.Application.Common.Exceptions;
using Chirp.Domain.Entities;

namespace Chirp.Application.Queries.Users.GetUserByUsername
{
    public record GetUserByUsernameQuery : IRequest<UserDetailedResponse>
    {
        public string Username { get; init; }
    }

    public class GetUserByUsernameQueryHandler : IRequestHandler<GetUserByUsernameQuery, UserDetailedResponse>
    {
        private readonly IAppDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly ICurrentUser _currentUser;
        public GetUserByUsernameQueryHandler(IAppDbContext dbContext, IMapper mapper, ICurrentUser currentUser)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _currentUser = currentUser;
        }

        public async Task<UserDetailedResponse> Handle(GetUserByUsernameQuery request, CancellationToken cancellationToken)
        {
            var user = await _dbContext.Users
                .ProjectTo<UserDetailedResponse>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(u => u.Username == request.Username);

            if (user is null)
                throw new NotFoundException(nameof(User), request.Username);

            var currentUserId = _currentUser.Id;
            user.IsFollowing = await _dbContext.Follows.AnyAsync(f => f.FollowerId == currentUserId && f.FollowedId == user.Id);
            return user;
        }
    }
}
