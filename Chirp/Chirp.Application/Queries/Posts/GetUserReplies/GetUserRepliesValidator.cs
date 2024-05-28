using Chirp.Application.Common.Validators;
using FluentValidation;

namespace Chirp.Application.Queries.Posts.GetUserReplies
{

    public class GetUserRepliesValidator : AbstractValidator<GetUserRepliesQuery>
    {
        public GetUserRepliesValidator()
        {
            RuleFor(x => x.Username)
                .NotEmpty().WithMessage("Username is required.")
                .MaximumLength(50).WithMessage("Username must not exceed 50 characters.");
            Include(new PaginationValidator());
        }
    }
}
