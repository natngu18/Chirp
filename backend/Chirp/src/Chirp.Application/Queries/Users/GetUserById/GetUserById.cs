using AutoMapper;
using AutoMapper.QueryableExtensions;
using Chirp.Application.Common;
using Chirp.Application.Common.Exceptions;
using Chirp.Application.Common.Interfaces;
using Chirp.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Chirp.Application.Queries.Users.GetUserById
{
    public record GetUserByIdQuery : IRequest<UserResponse>
    {
        public string UserId { get; init; }
    }

    public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, UserResponse>
    {
        private readonly IAppDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly ICurrentUser _currentUser;
        public GetUserByIdQueryHandler(IAppDbContext dbContext, IMapper mapper, ICurrentUser currentUser)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _currentUser = currentUser;
        }

        public async Task<UserResponse> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
        {
            var user = await _dbContext.Users
                .ProjectTo<UserResponse>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(u => u.Id == request.UserId);


            if (user is null)
                throw new NotFoundException(nameof(User), request.UserId);
            var currentUserId = _currentUser.Id;
            user.IsFollowing = await _dbContext.Follows.AnyAsync(f => f.FollowerId == currentUserId && f.FollowedId == request.UserId);
            return user;
        }
    }
}
