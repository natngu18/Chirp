using Chirp.Application.Common;
using Chirp.Application.Common.Exceptions;
using Chirp.Application.Common.Interfaces;
using Chirp.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Chirp.Application.Commands.Users.UpdateUser
{
    public record UpdateUserCommand : IRequest<Unit>
    {
        [FromRoute]
        public string Username { get; set; }
        public string? Location { get; set; }
        public string? Bio { get; set; }
        public string? DisplayName { get; set; }
        public IFormFile? Avatar { get; set; }
        public IFormFile? BackgroundImage { get; set; }
        public bool DeleteBackgroundImage { get; set; }
    };

    public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, Unit>
    {
        private readonly IAppDbContext _dbContext;
        private readonly IFirebaseService _firebaseService;
        private readonly ICurrentUser _currentUser;
        private readonly string _defaultAvatarUrl;


        public UpdateUserCommandHandler(IAppDbContext dbContext, IFirebaseService firebaseService, ICurrentUser currentUser,
            IConfiguration configuration)
        {
            _dbContext = dbContext;
            _firebaseService = firebaseService;
            _currentUser = currentUser;
            _defaultAvatarUrl = configuration["DefaultAvatar:Url"];

        }

        public async Task<Unit> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
        {
            var user = await _dbContext.Users
                .Include(u => u.Medias.Where(m => m.IsAvatar || m.IsBackground))
                .FirstOrDefaultAsync(u => u.Username == request.Username, cancellationToken);
            if (user is null)
            {
                throw new NotFoundException(nameof(User), request.Username);
            }

            if (user.Id != _currentUser.Id)
            {
                throw new UnauthorizedException("You are not authorized to update this user");
            }
            var existingBackground = user.Medias.FirstOrDefault(m => m.IsBackground);
            // Avatar should never be null
            var existingAvatar = user.Medias.FirstOrDefault(m => m.IsAvatar);
            // if new avatar provided, replace existing one's url
            if (request.Avatar != null)
            {
                // Delete existing avatar in cloud storage
                // DON'T DELETE IF IT'S DEFAULT AVATAR, OR not a url from APP (it could be initialized w/ google profile picture url)
                if (existingAvatar.Url != _defaultAvatarUrl && _firebaseService.IsFirebaseStorageUrl(existingAvatar.Url))
                {
                    await _firebaseService.DeleteFile(existingAvatar.Url, _currentUser.AccessToken);
                }
                var avatarUrl = await _firebaseService.UploadFile(request.Avatar, _currentUser.AccessToken);
                existingAvatar.Url = avatarUrl;
            }
            // Deleting background image
            // request.BackgroundImage must be null when delete is true...
            if (request.DeleteBackgroundImage && existingBackground != null)
            {
                await _firebaseService.DeleteFile(existingBackground.Url, _currentUser.AccessToken);
                _dbContext.Medias.Remove(user.Medias.FirstOrDefault(m => m.IsBackground));
            }
            else if (request.BackgroundImage != null) // delete bg image shouldn't be true here
            {
                var backgroundImageUrl = await _firebaseService.UploadFile(request.BackgroundImage, _currentUser.AccessToken);
                // if background exists, delete it from cloud, set new image url.
                if (existingBackground != null)
                {
                    await _firebaseService.DeleteFile(existingBackground.Url, _currentUser.AccessToken);
                    existingBackground.Url = backgroundImageUrl;
                }
                else
                {
                    user.Medias.Add(new Media { Url = backgroundImageUrl, UserId = user.Id, IsBackground = true });
                }
            }

            user.Location = request.Location ?? user.Location;
            user.Bio = request.Bio ?? user.Bio;
            user.DisplayName = request.DisplayName ?? user.DisplayName;
            await _dbContext.SaveChangesAsync(cancellationToken);
            return Unit.Value;
        }
    }
}
