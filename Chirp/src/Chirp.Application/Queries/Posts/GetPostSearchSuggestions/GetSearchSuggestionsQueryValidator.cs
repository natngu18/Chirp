using FluentValidation;

namespace Chirp.Application.Queries.Posts.GetPostSearchSuggestions
{

    public class GetSearchSuggestionsQueryValidator : AbstractValidator<GetSearchSuggestionsQuery>
    {
        public GetSearchSuggestionsQueryValidator()
        {
            RuleFor(x => x.SearchText)
                .NotEmpty().WithMessage($"{nameof(GetSearchSuggestionsQuery.SearchText)} cannot be empty")
                .MaximumLength(100).WithMessage($"{nameof(GetSearchSuggestionsQuery.SearchText)} maximum length is 100 characters");
            RuleFor(x => x.UserSuggestionCount)
                .InclusiveBetween(1, 10).WithMessage($"{nameof(GetSearchSuggestionsQuery.UserSuggestionCount)} must be between 1 and 10");
        }

    }
}
