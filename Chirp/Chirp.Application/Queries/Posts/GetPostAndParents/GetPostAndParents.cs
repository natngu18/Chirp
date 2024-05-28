using AutoMapper;
using Chirp.Application.Common;
using Chirp.Application.Common.Interfaces;
using Chirp.Application.Queries.Users;
using Chirp.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Chirp.Application.Queries.Posts.GetPostParents
{

    public record GetPostAndParentsQuery : PaginationParams, IRequest<PaginatedList<PostBriefResponse>>
    {
        public int PostId { get; init; }
    };

    public class GetPostAndParentsQueryHandler : IRequestHandler<GetPostAndParentsQuery, PaginatedList<PostBriefResponse>>
    {
        private readonly IMapper _mapper;
        private readonly IAppDbContext _dbContext;
        private readonly ICurrentUser _currentUser;

        public GetPostAndParentsQueryHandler(IMapper mapper, IAppDbContext appDbContext, ICurrentUser currentUser)
        {
            _mapper = mapper;
            _dbContext = appDbContext;
            _currentUser = currentUser;
        }

        public async Task<PaginatedList<PostBriefResponse>> Handle(GetPostAndParentsQuery request, CancellationToken cancellationToken)
        {
            string sql = @"
                WITH RECURSIVE post_hierarchy AS (
                  SELECT * FROM public.""Posts"" WHERE ""Id"" = @postId
                  UNION ALL
                  SELECT public.""Posts"".* FROM public.""Posts""
                  JOIN post_hierarchy ON public.""Posts"".""Id"" = post_hierarchy.""ParentPostId""
                )
                SELECT * FROM post_hierarchy 
            ";
            var parameters = new SqlParameter[]
            {
                    new SqlParameter("@postId", request.PostId),
                //new SqlParameter("@limit", request.PageSize),
                //new SqlParameter("@offset", (request.PageNumber - 1) * request.PageSize)
            };
            // execute query and get paginated posts.
            // post items start with the post itself, then its parent, then its parent's parent, etc.
            var paginatedPosts = await _dbContext.ExecuteQueryAsync<Post>(sql, request.PageNumber, request.PageSize, parameters);
            List<int> postIds = paginatedPosts.Items.Select(p => p.Id).ToList();
            // Load related data and entities (should load them in initial query for better performance)
            var loadedPosts = await _dbContext.Posts
                .Where(p => postIds.Contains(p.Id))
                .Include(p => p.Author)
                    .ThenInclude(u => u.Avatar)
                .Include(p => p.Medias)
                .Include(p => p.Likes)
                .Include(p => p.ChildPosts)
                .ToListAsync();

            // Sort loadedPosts based on the order of IDs in postIds (maintain order of posts)
            var loadedPostResponses = loadedPosts
                .OrderBy(p => postIds.IndexOf(p.Id))
                .Select(p => new PostBriefResponse
                {
                    Author = _mapper.Map<BaseUserDto>(p.Author),
                    Id = p.Id,
                    Medias = p.Medias.ToList(),
                    IsLiked = p.Likes.Any(l => l.UserId == _currentUser.Id),
                    LikeCount = p.Likes.Count,
                    CreatedAt = p.CreatedAt,
                    Text = p.Text,
                    ChildCount = p.ChildPosts.Count,
                })
                .ToList();

            // Reverse to make parent posts appear first
            loadedPostResponses.Reverse();
            // Create a new PaginatedList<PostBriefResponse> with the mapped items
            var result = new PaginatedList<PostBriefResponse>(loadedPostResponses, paginatedPosts.TotalCount, request.PageNumber, request.PageSize);
            return result;
        }
    }
}
