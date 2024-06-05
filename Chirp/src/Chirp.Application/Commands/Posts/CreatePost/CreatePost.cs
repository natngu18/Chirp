using Chirp.Application.Common;
using Chirp.Application.Common.Exceptions;
using Chirp.Application.Common.Interfaces;
using Chirp.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Chirp.Application.Commands.Posts.CreatePost
{

    public record CreatePostCommand : IRequest<int>
    {
        [FromForm]
        public string Text { get; set; }
        [FromForm]
        public List<IFormFile>? Medias { get; set; }
        [FromRoute]
        public int? ParentPostId { get; init; }
    };

    public class CreatePostCommandHandler : IRequestHandler<CreatePostCommand, int>
    {
        private readonly IAppDbContext _dbContext;
        private readonly ICurrentUser _currentUser;
        private readonly IFirebaseService _firebaseService;

        public CreatePostCommandHandler(IAppDbContext dbContext, ICurrentUser currentUser, IFirebaseService firebaseService)
        {
            _dbContext = dbContext;
            _currentUser = currentUser;
            _firebaseService = firebaseService;
        }

        public async Task<int> Handle(CreatePostCommand request, CancellationToken cancellationToken)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == _currentUser.Id, cancellationToken);
            if (user is null)
            {
                throw new NotFoundException(nameof(User), _currentUser.Id ?? "No ID in token");
            }

            Post? parentPost = null;
            // Check if specified parent post exists
            if (request.ParentPostId is not null)
            {
                //parentPost = await _dbContext.Posts
                //    .Where(p => p.Id == request.ParentPostId)
                //    .FirstOrDefaultAsync(cancellationToken);
                parentPost = await _dbContext.Posts
                    .FirstOrDefaultAsync(p => p.Id == request.ParentPostId, cancellationToken);
                if (parentPost == null)
                {
                    throw new NotFoundException(nameof(Post), request.ParentPostId);
                }
            }

            var post = new Post
            {
                Text = request.Text,
                Author = user,
                ParentPost = parentPost,
            };

            // Upload each media file to Firebase Storage
            if (request.Medias is not null)
            {
                foreach (var media in request.Medias)
                {
                    var mediaUrl = await _firebaseService.UploadFile(media, _currentUser.AccessToken) ?? throw new Exception("Failed to upload media file");
                    post.Medias.Add(new Media { Url = mediaUrl, Post = post, UserId = _currentUser.Id });
                }
            }

            await _dbContext.Posts.AddAsync(post, cancellationToken);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return post.Id;
        }

    }


}
