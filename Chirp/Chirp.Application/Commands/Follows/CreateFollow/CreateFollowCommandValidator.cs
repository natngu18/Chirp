using FluentValidation;

namespace Chirp.Application.Commands.Follows.CreateFollow
{

    public class CreateFollowCommandValidator : AbstractValidator<CreateFollowCommand>
    {
        public CreateFollowCommandValidator()
        {
            RuleFor(x => x.Username)
                .NotEmpty().WithMessage($"{nameof(CreateFollowCommand.Username)} cannot be empty");
        }

    }
}
