using Chirp.Application.Common;
using Chirp.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Chirp.Application.Common.Exceptions;
using Chirp.Domain.Entities;

namespace Chirp.Application.Commands.Follows.DeleteFollow
{
    public record DeleteFollowCommand : IRequest<Unit>
    {
        public string Username { get; init; }
    };

    public class DeleteFollowCommandHandler : IRequestHandler<DeleteFollowCommand, Unit>
    {
        private readonly IAppDbContext _dbContext;
        private readonly ICurrentUser _currentUser;

        public DeleteFollowCommandHandler(IAppDbContext dbContext, ICurrentUser currentUser)
        {
            _dbContext = dbContext;
            _currentUser = currentUser;
        }

        public async Task<Unit> Handle(DeleteFollowCommand request, CancellationToken cancellationToken)
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

            // Verify that the follow exists
            var existingFollow = await _dbContext.Follows.FirstOrDefaultAsync(f => f.FollowerId == currentUserId && f.FollowedId == followedUser.Id, cancellationToken);

            if (existingFollow is null)
            {
                throw new NotFoundException("You are not following this user");
            }

            _dbContext.Follows.Remove(existingFollow);
            await _dbContext.SaveChangesAsync(cancellationToken);
            return Unit.Value;
        }
    }
}
