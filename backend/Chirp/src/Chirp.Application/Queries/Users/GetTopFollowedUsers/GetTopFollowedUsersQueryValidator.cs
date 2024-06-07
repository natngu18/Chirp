using FluentValidation;

namespace Chirp.Application.Queries.Users.GetTopFollowedUsers
{

    public class GetTopFollowedUsersQueryValidator : AbstractValidator<GetTopFollowedUsersQuery>
    {
        public GetTopFollowedUsersQueryValidator()
        {
            RuleFor(x => x.UserCount)
                .InclusiveBetween(1, 10).WithMessage($"{nameof(GetTopFollowedUsersQuery.UserCount)} must be between 1 and 10");
        }

    }
}
