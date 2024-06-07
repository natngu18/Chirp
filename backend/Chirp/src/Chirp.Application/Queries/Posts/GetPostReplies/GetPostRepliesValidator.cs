using Chirp.Application.Common.Validators;
using FluentValidation;

namespace Chirp.Application.Queries.Posts.GetPostReplies
{

    public class GetPostRepliesValidator : AbstractValidator<GetPostRepliesQuery>
    {
        public GetPostRepliesValidator()
        {
            RuleFor(x => x.PostId)
                .Must(x => x > 0).WithMessage($"{nameof(GetPostRepliesQuery.PostId)} must be greater than 0");
            Include(new PaginationValidator());
        }
    }
}
