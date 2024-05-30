using Chirp.Application.Common;
using Chirp.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Chirp.Application.Common.Exceptions;
using Chirp.Domain.Entities;

namespace Chirp.Application.Commands.Likes.DeleteLike
{
    public record DeleteLikeCommand : IRequest<Unit>
    {
        public int PostId { get; init; }
    };

    public class DeleteLikeCommandHandler : IRequestHandler<DeleteLikeCommand, Unit>
    {
        private readonly IAppDbContext _dbContext;
        private readonly ICurrentUser _currentUser;

        public DeleteLikeCommandHandler(IAppDbContext dbContext, ICurrentUser currentUser)
        {
            _dbContext = dbContext;
            _currentUser = currentUser;
        }

        public async Task<Unit> Handle(DeleteLikeCommand request, CancellationToken cancellationToken)
        {
            var post = await _dbContext.Posts.FirstOrDefaultAsync(p => p.Id == request.PostId, cancellationToken);
            if (post is null)
            {
                throw new NotFoundException(nameof(Post), request.PostId);
            }
            var currentUserId = _currentUser.Id;
            if (currentUserId is null)
            {
                throw new UnauthorizedException("You must be logged in to do that");
            }

            // Verify that the like exists
            var existingLike = await _dbContext.Likes.FirstOrDefaultAsync(l => l.UserId == currentUserId && l.PostId == request.PostId, cancellationToken);
            if (existingLike is null)
            {
                throw new BadRequestException("You haven't liked this post");
            }


            _dbContext.Likes.Remove(existingLike);
            await _dbContext.SaveChangesAsync(cancellationToken);
            return Unit.Value;
        }
    }
}
