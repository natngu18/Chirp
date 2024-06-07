using Chirp.Application.Common.Validators;
using Chirp.Domain.Entities;
using FluentValidation;

namespace Chirp.Application.Commands.Posts.CreatePost
{
    public class CreatePostCommandValidator : AbstractValidator<CreatePostCommand>
    {
        public CreatePostCommandValidator()
        {
            RuleFor(x => x.Text)
                .NotEmpty().WithMessage($"{nameof(Post.Text)} cannot be empty")
                .MaximumLength(200).WithMessage($"{nameof(Post.Text)} maximum length is 200 characters");
            RuleForEach(x => x.Medias).SetValidator(new FormFileValidator());
            RuleFor(x => x.ParentPostId)
                .Must(x => x is null or > 0).WithMessage($"{nameof(CreatePostCommand.ParentPostId)} must be empty or greater than 0");
        }

    }


}
