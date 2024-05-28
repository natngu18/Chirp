using Chirp.Application.Common;
using Chirp.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Chirp.Application.Common.Exceptions;
using Chirp.Domain.Entities;

namespace Chirp.Application.Commands.Likes.CreateLike
{
    public record CreateLikeCommand : IRequest<Unit>
    {
        // The post to like
        public int PostId { get; init; }
    };

    public class CreateLikeCommandHandler : IRequestHandler<CreateLikeCommand, Unit>
    {
        private readonly IAppDbContext _dbContext;
        private readonly ICurrentUser _currentUser;

        public CreateLikeCommandHandler(IAppDbContext dbContext, ICurrentUser currentUser)
        {
            _dbContext = dbContext;
            _currentUser = currentUser;
        }

        public async Task<Unit> Handle(CreateLikeCommand request, CancellationToken cancellationToken)
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

            // Verify that the like doesn't already exist
            var existingLike = await _dbContext.Likes.FirstOrDefaultAsync(l => l.UserId == currentUserId && l.PostId == request.PostId, cancellationToken);
            if (existingLike != null)
            {
                throw new BadRequestException("You already like this post");
            }

            var like = new Like { UserId = currentUserId, PostId = request.PostId };

            _dbContext.Likes.Add(like);
            await _dbContext.SaveChangesAsync(cancellationToken);
            return Unit.Value;
        }
    }
}
