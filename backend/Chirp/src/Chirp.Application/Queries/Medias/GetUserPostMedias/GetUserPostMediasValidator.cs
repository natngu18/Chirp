using Chirp.Application.Common.Validators;
using FluentValidation;

namespace Chirp.Application.Queries.Medias.GetUserPostMedias
{

    public class GetUserPostMediasValidator : AbstractValidator<GetUserPostMediasQuery>
    {
        public GetUserPostMediasValidator()
        {
            RuleFor(x => x.Username)
                .NotEmpty().WithMessage("Username is required.")
                .MaximumLength(50).WithMessage("Username must not exceed 50 characters.");
            Include(new PaginationValidator());

            // Additional rule for PageSize
            RuleFor(x => x.PageSize)
                .Must(x => x % 3 == 0).WithMessage("PageSize must be a multiple of 3");

        }
    }
}
