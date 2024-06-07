using Chirp.Application.Common.Validators;
using Chirp.Application.Queries.Posts.GetPostParents;
using FluentValidation;

namespace Chirp.Application.Queries.Posts.GetPostAndParents
{

    public class GetPostAndParentsValidator : AbstractValidator<GetPostAndParentsQuery>
    {
        public GetPostAndParentsValidator()
        {
            RuleFor(x => x.PostId)
                .Must(x => x > 0).WithMessage($"{nameof(GetPostAndParentsQuery.PostId)} must be greater than 0");
            Include(new PaginationValidator());
        }
    }
}
