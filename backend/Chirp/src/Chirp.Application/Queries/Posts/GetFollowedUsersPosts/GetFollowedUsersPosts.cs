using AutoMapper;
using Chirp.Application.Common;
using Chirp.Application.Common.Interfaces;
using Chirp.Application.Common.Mapping;
using Chirp.Application.Queries.Medias;
using Chirp.Application.Queries.Users;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Chirp.Application.Queries.Posts.GetFollowedUsersPosts
{
    public record GetFollowedUsersPostsQuery : PaginationParams, IRequest<PaginatedList<PostBriefResponse>>
    {
    };

    public class GetPostAndParentsQueryHandler : IRequestHandler<GetFollowedUsersPostsQuery, PaginatedList<PostBriefResponse>>
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

        public async Task<PaginatedList<PostBriefResponse>> Handle(GetFollowedUsersPostsQuery request, CancellationToken cancellationToken)
        {
            var posts = await _dbContext.Follows
                .Where(f => f.FollowerId == _currentUser.Id)
                .SelectMany(f => f.Followed.Posts)
                .Include(p => p.Author)
                    .ThenInclude(u => u.Medias.Where(m => m.IsAvatar))
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new PostBriefResponse
                {
                    Author = _mapper.Map<BaseUserDto>(p.Author),
                    Id = p.Id,
                    Text = p.Text,
                    CreatedAt = p.CreatedAt,
                    Medias = _mapper.Map<IList<MediaDto>>(p.Medias.ToList()),
                    LikeCount = p.Likes.Count,
                    IsLiked = p.Likes.Any(l => l.UserId == _currentUser.Id),
                    ChildCount = p.ChildPosts.Count,
                    ParentPostAuthorUsername = p.ParentPost != null ? p.ParentPost.Author.Username : null,
                })
                .PaginatedListAsync(request.PageNumber, request.PageSize);

            return posts;
        }
    }
}

