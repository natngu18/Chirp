using Chirp.Application.Common.Validators;
using FluentValidation;

namespace Chirp.Application.Commands.Users.UpdateUser
{

    public class UpdateUserCommandValidator : AbstractValidator<UpdateUserCommand>
    {
        public UpdateUserCommandValidator()
        {

            RuleFor(x => x.Username)
                 .NotEmpty().WithMessage("Username is required.")
                 .MaximumLength(50).WithMessage("Username must not exceed 50 characters.");
            RuleFor(x => x.Location)
                .MaximumLength(30).WithMessage("Location must not exceed 30 characters.");

            RuleFor(x => x.Bio)
                .MaximumLength(160).WithMessage("Bio must not exceed 160 characters.");

            RuleFor(x => x.DisplayName)
                .MaximumLength(30).WithMessage("Display name must not exceed 30 characters.");

            RuleFor(x => x)
                .Must(x => !(x.DeleteBackgroundImage && x.BackgroundImage != null))
                .WithMessage("Cannot delete and update background image at the same time.");

            RuleFor(x => x.Avatar).SetValidator(new FormFileValidator()).When(x => x.Avatar != null);
            RuleFor(x => x.BackgroundImage).SetValidator(new FormFileValidator()).When(x => x.BackgroundImage != null);
        }

    }
}
