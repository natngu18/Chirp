using Chirp.Application.Common;
using Chirp.Domain.Entities;
using FluentValidation;

namespace Chirp.Application.Commands.Users.CreateUser
{
    public class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
    {
        private readonly IAppDbContext _dbContext;
        // We don't want to return error for existing ID, since endpoint is always called when user authenticates (to ensure user from firebase exists in backend).
        public CreateUserCommandValidator(IAppDbContext dbContext)
        {
            _dbContext = dbContext;

            RuleFor(x => x.Id)
                .NotEmpty()
                    .WithMessage($"{nameof(User.Id)} cannot be empty");

        }

    }
}
