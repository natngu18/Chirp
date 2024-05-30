using Chirp.Application.Common;
using Chirp.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Chirp.Application.Common.Exceptions;
using Chirp.Domain.Entities;

namespace Chirp.Application.Commands.Follows.CreateFollow
{
    public record CreateFollowCommand : IRequest<Unit>
    {
        // The user to follow
        public string Username { get; init; }
    };

    public class CreateFollowCommandHandler : IRequestHandler<CreateFollowCommand, Unit>
    {
        private readonly IAppDbContext _dbContext;
        private readonly ICurrentUser _currentUser;

        public CreateFollowCommandHandler(IAppDbContext dbContext, ICurrentUser currentUser)
        {
            _dbContext = dbContext;
            _currentUser = currentUser;
        }

        public async Task<Unit> Handle(CreateFollowCommand request, CancellationToken cancellationToken)
        {
            var followedUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.Username == request.Username, cancellationToken);
            if (followedUser is null)
            {
                throw new NotFoundException(nameof(User), request.Username);
            }
            var currentUserId = _currentUser.Id;
            if (currentUserId is null)
            {
                throw new UnauthorizedException("You must be logged in to do that");
            }
            if (currentUserId == followedUser.Id)
            {
                throw new BadRequestException("You cannot follow yourself");
            }

            // Verify that the follow doesn't already exist
            var existingFollow = await _dbContext.Follows.FirstOrDefaultAsync(f => f.FollowerId == currentUserId && f.FollowedId == followedUser.Id, cancellationToken);
            if (existingFollow != null)
            {
                throw new BadRequestException("You are already following this user");
            }

            var follow = new Follow
            {
                FollowerId = currentUserId,
                FollowedId = followedUser.Id
            };

            _dbContext.Follows.Add(follow);
            await _dbContext.SaveChangesAsync(cancellationToken);
            return Unit.Value;
        }
    }
}
