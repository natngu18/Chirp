using AutoMapper;
using Chirp.Application.Common;
using Chirp.Application.Common.Interfaces;
using Chirp.Application.Queries.Users;
using Chirp.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Nest;

namespace Chirp.Application.Queries.Search.GetSearchSuggestions
{
    // This only suggests users matching the search text currently
    public record GetSearchSuggestionsQuery : MediatR.IRequest<SearchSuggestionsResponse>
    {
        public string SearchText { get; init; }
        public int UserSuggestionCount { get; init; } = 5;
    };

    public class GetSearchSuggestionsQueryHandler : IRequestHandler<GetSearchSuggestionsQuery, SearchSuggestionsResponse>
    {
        private readonly IElasticClient _elasticClient;
        private readonly IMapper _mapper;
        private readonly IAppDbContext _dbContext;
        private readonly ICurrentUser _currentUser;

        public GetSearchSuggestionsQueryHandler(IElasticClient elasticClient, IMapper mapper, IAppDbContext appDbContext, ICurrentUser currentUser)
        {
            _elasticClient = elasticClient;
            _mapper = mapper;
            _dbContext = appDbContext;
            _currentUser = currentUser;
        }

        public async Task<SearchSuggestionsResponse> Handle(GetSearchSuggestionsQuery request, CancellationToken cancellationToken)
        {
            //var searchResponse = _elasticClient.Search<User>(s => s
            //.Query(q => q
            //    .Match(m => m
            //        .Field(f => f.Username.Suffix("ngram"))
            //        .Query(request.SearchText)
            //    ))
            //    .Size(request.UserSuggestionCount)
            //);
            var searchResponse = _elasticClient.Search<User>(s => s
                .Query(q => q
                    .MultiMatch(m => m
                        .Fields(f => f
                            .Field(ff => ff.Username.Suffix("ngram"))
                            .Field(ff => ff.DisplayName.Suffix("ngram"))
                        )
                        .Query(request.SearchText)
                    )
                )
                .Size(request.UserSuggestionCount)
            );

            if (searchResponse.IsValid)
            {
                var userSuggestionIds = searchResponse.Documents.Select(u => u.Id).ToList();
                var userEntities = await _dbContext.Users.Where(u => userSuggestionIds.Contains(u.Id)).Include(u => u.Medias.Where(m => m.IsAvatar == true)).ToListAsync();
                // Order user entities based on original Elasticsearch query (which orders based on score)
                var orderedUserEntities = userSuggestionIds
                    .Select(id => userEntities.FirstOrDefault(u => u.Id == id))
                    .Where(user => user != null)
                    .ToList();
                var userRes = _mapper.Map<List<UserBriefResponse>>(orderedUserEntities);
                // Check if current user is following each user
                var currentUserId = _currentUser.Id;
                foreach (var user in userRes)
                {
                    user.IsFollowing = await _dbContext.Follows.AnyAsync(f => f.FollowerId == _currentUser.Id && f.FollowedId == user.Id);
                }
                var res = new SearchSuggestionsResponse
                {
                    Users = userRes
                };
                return res;
            }
            else
            {
                throw new Exception("Failed to get user suggestions");
            }

        }
    }
}
