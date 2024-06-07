using AutoMapper;
using Chirp.Application.Common;
using Chirp.Application.Common.Interfaces;
using Chirp.Application.Queries.Medias;
using Chirp.Application.Queries.Users;
using Chirp.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Nest;

namespace Chirp.Application.Queries.Posts.GetPostsBySearch
{

    public record GetPostsBySearchQuery : PaginationParams, MediatR.IRequest<PaginatedList<PostBriefResponse>>
    {
        public string SearchText { get; init; }
    };

    public class GetPostsBySearchQueryHandler : IRequestHandler<GetPostsBySearchQuery, PaginatedList<PostBriefResponse>>
    {
        private readonly IElasticClient _elasticClient;
        private readonly IMapper _mapper;
        private readonly IAppDbContext _dbContext;
        private readonly ICurrentUser _currentUser;

        public GetPostsBySearchQueryHandler(IElasticClient elasticClient, IMapper mapper, IAppDbContext appDbContext, ICurrentUser currentUser)
        {
            _elasticClient = elasticClient;
            _mapper = mapper;
            _dbContext = appDbContext;
            _currentUser = currentUser;
        }

        public async Task<PaginatedList<PostBriefResponse>> Handle(GetPostsBySearchQuery request, CancellationToken cancellationToken)
        {
            var result = await _elasticClient.SearchAsync<Post>(s => s
            .Query(q => q
                .FunctionScore(fs => fs
                    .Query(fq => fq
                    .Match(m => m
                    .Field(p => p.Text)
                        .Query(request.SearchText)))
                    .Functions(fu => fu
                        // Prioritize 1 day old posts
                        .GaussDate(g => g
                            .Field(p => p.CreatedAt)
                            .Origin(DateMath.Now)
                            .Scale("1d")
                            // Can't use 1.0, must be in range of 0-1
                            .Decay(0.99))
                        // Then prioritize 7 days
                        .GaussDate(g => g
                            .Field(p => p.CreatedAt)
                            .Origin(DateMath.Now)
                            .Scale("7d")
                            .Decay(0.7))
                        // Then prioritize 1m days
                        .GaussDate(g => g
                            .Field(p => p.CreatedAt)
                            .Origin(DateMath.Now)
                            .Scale("1m")
                            .Decay(0.5)))
                    .ScoreMode(FunctionScoreMode.Max)
                    .BoostMode(FunctionBoostMode.Multiply)))
            .Highlight(h => h
                .PreTags("<strong>")
                .PostTags("</strong>")
                .Fields(f => f
                    .Field("text")
                    .FragmentSize(50)
                    .NumberOfFragments(4)
                )
            )
            .From((request.PageNumber - 1) * request.PageSize)
            .Size(request.PageSize));

            var currentUserId = _currentUser.Id;

            //// Extract the  post IDs from the search results
            var postIds = result.Documents.Select(p => p.Id).Distinct().ToList();

            // Query to get the posts with their associated media and likes
            var posts = await _dbContext.Posts
                .Where(p => postIds.Contains(p.Id))
                .Include(p => p.Medias)
                .Include(p => p.Likes)
                .Include(p => p.Author)
                    .ThenInclude(u => u.Medias.Where(m => m.IsAvatar == true))
                .Select(p => new
                {
                    p.Id,
                    p.Author,
                    Medias = p.Medias.ToList(),
                    IsLiked = p.Likes.Any(l => l.UserId == currentUserId),
                    ParentPostAuthorUsername = p.ParentPost != null ? p.ParentPost.Author.Username : null,
                    LikeCount = p.Likes.Count,
                })
                .ToDictionaryAsync(p => p.Id, cancellationToken);

            // Combine highlighted text from elasticsearch results with additional post data from primary db
            var postItems = result.Hits.Select(hit =>
            {
                var post = posts[hit.Source.Id];
                return new PostBriefResponse
                {
                    Id = hit.Source.Id,
                    Text = string.Join(" ", hit.Highlight["text"]),
                    Author = _mapper.Map<BaseUserDto>(post.Author),
                    CreatedAt = hit.Source.CreatedAt,
                    Medias = _mapper.Map<IList<MediaDto>>(post.Medias),
                    IsLiked = post.IsLiked,
                    ParentPostAuthorUsername = post.ParentPostAuthorUsername,
                    LikeCount = post.LikeCount,
                };
            }).ToList();

            var paginatedList = new PaginatedList<PostBriefResponse>(
                postItems,
                (int)result.Total,
                request.PageNumber,
                request.PageSize
                );

            return paginatedList;
        }
    }
}
