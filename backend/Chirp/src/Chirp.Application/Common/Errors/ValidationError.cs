namespace Chirp.Application.Common.Errors;

public class ValidationError
{
    public string Property { get; set; }
    public string ErrorMessage { get; set; }
}