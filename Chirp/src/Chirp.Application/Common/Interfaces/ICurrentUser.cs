namespace Chirp.Application.Common.Interfaces
{
    public interface ICurrentUser
    {
        string? Id { get; }
        string? AccessToken { get; }
    }
}
