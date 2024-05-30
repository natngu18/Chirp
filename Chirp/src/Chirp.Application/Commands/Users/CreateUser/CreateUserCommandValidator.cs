using Chirp.Domain.Entities;
using FluentValidation;

namespace Chirp.Application.Commands.Users.CreateUser
{
    public class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
    {
        // We don't want to return error for existing ID, since endpoint is always called when user authenticates (to ensure user from firebase exists in backend).
        public CreateUserCommandValidator()
        {

            RuleFor(x => x.Id)
                .NotEmpty()
                    .WithMessage($"{nameof(User.Id)} cannot be empty");
        }

    }
}
