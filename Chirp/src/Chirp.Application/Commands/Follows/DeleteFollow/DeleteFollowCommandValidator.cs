using FluentValidation;

namespace Chirp.Application.Commands.Follows.DeleteFollow
{

    public class DeleteFollowCommandValidator : AbstractValidator<DeleteFollowCommand>
    {
        public DeleteFollowCommandValidator()
        {
            RuleFor(x => x.Username)
                .NotEmpty().WithMessage($"{nameof(DeleteFollowCommand.Username)} cannot be empty");
        }

    }
}
