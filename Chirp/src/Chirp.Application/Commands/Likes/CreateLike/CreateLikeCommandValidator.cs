using FluentValidation;

namespace Chirp.Application.Commands.Likes.CreateLike
{

    public class CreateLikeCommandValidator : AbstractValidator<CreateLikeCommand>
    {
        public CreateLikeCommandValidator()
        {
            RuleFor(x => x.PostId)
                .NotEmpty().WithMessage($"{nameof(CreateLikeCommand.PostId)} cannot be empty");
        }

    }
}
