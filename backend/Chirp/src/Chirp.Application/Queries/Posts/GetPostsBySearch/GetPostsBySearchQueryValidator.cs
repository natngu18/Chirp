using Chirp.Application.Common.Validators;
using FluentValidation;

namespace Chirp.Application.Queries.Posts.GetPostsBySearch
{

    public class GetPostsBySearchQueryValidator : AbstractValidator<GetPostsBySearchQuery>
    {
        public GetPostsBySearchQueryValidator()
        {
            RuleFor(x => x.SearchText)
                .MaximumLength(200).WithMessage($"{nameof(GetPostsBySearchQuery.SearchText)} must not exceed 200 characters.");
            Include(new PaginationValidator());
        }
    }
}
