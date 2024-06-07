using Chirp.Application.Common.Errors;

namespace Chirp.Application.Common.Exceptions;

public class CustomValidationException : Exception
{
    public CustomValidationException(List<ValidationError> validationErrors)
    {
        ValidationErrors = validationErrors;
    }

    public List<ValidationError> ValidationErrors { get; set; }
}