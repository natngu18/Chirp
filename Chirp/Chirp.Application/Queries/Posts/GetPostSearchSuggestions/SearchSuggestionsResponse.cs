using Chirp.Application.Queries.Users;

namespace Chirp.Application.Queries.Posts.GetPostSearchSuggestions
{
    public class SearchSuggestionsResponse
    {
        public ICollection<UserBriefResponse> Users { get; set; }
    }
}
