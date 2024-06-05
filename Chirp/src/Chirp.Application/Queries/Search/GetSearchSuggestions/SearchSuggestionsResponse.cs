using Chirp.Application.Queries.Users;

namespace Chirp.Application.Queries.Search.GetSearchSuggestions
{
    // Only provides results for users currently
    public class SearchSuggestionsResponse
    {
        public ICollection<UserBriefResponse> Users { get; set; }
    }
}
