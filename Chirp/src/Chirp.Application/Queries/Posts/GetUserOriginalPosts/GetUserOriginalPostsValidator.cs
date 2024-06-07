using Chirp.Application.Common.Validators;
using FluentValidation;

namespace Chirp.Application.Queries.Posts.GetUserOriginalPosts
{

    public class GetUserOriginalPostsValidator : AbstractValidator<GetUserOriginalPostsQuery>
    {
        public GetUserOriginalPostsValidator()
        {
            RuleFor(x => x.Username)
                .NotEmpty().WithMessage("Username is required.")
                .MaximumLength(50).WithMessage("Username must not exceed 50 characters.");
            Include(new PaginationValidator());
        }
    }
}
