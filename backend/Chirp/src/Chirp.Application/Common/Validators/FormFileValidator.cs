using FluentValidation;
using Microsoft.AspNetCore.Http;

namespace Chirp.Application.Common.Validators
{
    public class FormFileValidator : AbstractValidator<IFormFile>
    {
        public FormFileValidator()
        {
            RuleFor(x => x.FileName)
                .Must(HaveAllowedExtension).WithMessage("Only .jpg and .png files are allowed")
                .MaximumLength(100).WithMessage("File name is too long, maximum of 100 characters");

            RuleFor(x => x.Length)
                .Must(BeAValidSize).WithMessage("File size is too large, maximum of 4 MB");
        }

        private bool HaveAllowedExtension(string fileName)
        {
            var extension = Path.GetExtension(fileName);
            return extension == ".jpg" || extension == ".png";
        }

        private bool BeAValidSize(long size)
        {
            return size <= 4_000_000; // 4 MB
        }
    }
}
