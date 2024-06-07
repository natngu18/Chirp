using Chirp.Application.Common;
using Chirp.Application.Common.Exceptions;
using Chirp.Domain.Entities;
using FirebaseAdmin.Auth;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Chirp.Application.Commands.Users.CreateUser
{
    public record CreateUserCommand : IRequest<string>
    {
        public string Id { get; init; } // ID from auth provider
    };

    public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, string>
    {
        private readonly IAppDbContext _dbContext;
        private readonly string _defaultAvatarUrl;

        public CreateUserCommandHandler(IAppDbContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _defaultAvatarUrl = configuration["DefaultAvatar:Url"];
        }

        public async Task<string> Handle(CreateUserCommand request, CancellationToken cancellationToken)
        {

            UserRecord userRecord;
            // Check if user exists in Firebase
            try { userRecord = await FirebaseAuth.DefaultInstance.GetUserAsync(request.Id); }
            catch
            {
                throw new NotFoundException(nameof(User), request.Id);
            }

            // This is always called when user authenticates w/ Firebase to ensure user exists in external DB, so we don't want to return error.
            var existingUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == request.Id);
            if (existingUser != null)
            {
                return existingUser.Username;
            }

            // Generate a unique username based on email
            var baseUsername = userRecord.Email.Split('@')[0]; // Could remove underscores, dots, etc. and also trailing numbers
            var username = baseUsername;
            var guidLength = 4;
            while (await _dbContext.Users.AnyAsync(u => u.Username == username))
            {
                var guid = Guid.NewGuid().ToString("N").Substring(0, guidLength);
                username = $"{baseUsername}{guid}";

                if (guidLength < 32) // Maximum length of a GUID
                {
                    guidLength += 2; // Add 2 to guid length to try to make it unique
                }
            }
            var avatar = userRecord.PhotoUrl != null
                    // Profile picture from Firebase
                    ? new Media { Url = userRecord.PhotoUrl, UserId = request.Id, IsAvatar = true, Type = Domain.Enums.MediaType.Image }
                    // Default profile picture
                    : new Media { Url = _defaultAvatarUrl, UserId = request.Id, IsAvatar = true, Type = Domain.Enums.MediaType.Image };
            var user = new User
            {
                Id = request.Id, // ID from Firebase
                Username = username,
                DisplayName = userRecord.DisplayName ?? username,
                Medias = new List<Media>() { avatar },
            };

            await _dbContext.Users.AddAsync(user, cancellationToken);
            await _dbContext.SaveChangesAsync(cancellationToken);
            return user.Username;
        }
    }
}
