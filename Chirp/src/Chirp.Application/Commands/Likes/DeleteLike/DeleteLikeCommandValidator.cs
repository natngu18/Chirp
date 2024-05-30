using FluentValidation;

namespace Chirp.Application.Commands.Likes.DeleteLike
{

    public class DeleteLikeCommandValidator : AbstractValidator<DeleteLikeCommand>
    {
        public DeleteLikeCommandValidator()
        {
            RuleFor(x => x.PostId)
                .NotEmpty().WithMessage($"{nameof(DeleteLikeCommand.PostId)} cannot be empty");
        }

    }
}
