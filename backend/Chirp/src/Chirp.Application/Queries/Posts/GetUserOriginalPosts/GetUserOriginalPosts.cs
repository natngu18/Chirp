using AutoMapper;
using Chirp.Application.Common;
using Chirp.Application.Common.Exceptions;
using Chirp.Application.Common.Interfaces;
using Chirp.Application.Common.Mapping;
using Chirp.Application.Queries.Medias;
using Chirp.Application.Queries.Users;
using Chirp.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Chirp.Application.Queries.Posts.GetUserOriginalPosts
{
    // Original posts refer to non-reply posts
    public record GetUserOriginalPostsQuery : PaginationParams, IRequest<PaginatedList<PostBriefResponse>>
    {
        public string Username { get; init; }
    }

    public class GetUserOriginalPostsQueryHandler : IRequestHandler<GetUserOriginalPostsQuery, PaginatedList<PostBriefResponse>>
    {
        private readonly IAppDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly ICurrentUser _currentUser;
        public GetUserOriginalPostsQueryHandler(IAppDbContext dbContext, IMapper mapper, ICurrentUser currentUser)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _currentUser = currentUser;
        }

        public async Task<PaginatedList<PostBriefResponse>> Handle(GetUserOriginalPostsQuery request, CancellationToken cancellationToken)
        {
            var user = await _dbContext.Users
                .Where(u => u.Username == request.Username)
                    .Include(u => u.Medias.Where(m => m.IsAvatar == true))
                .FirstOrDefaultAsync(cancellationToken);
            if (user is null)
            {
                throw new NotFoundException(nameof(User), request.Username);
            }

            var posts = await _dbContext.Posts
              // Get original posts
              .Where(p => p.AuthorId == user.Id && p.ParentPost == null)
              .Include(p => p.Medias)
              .Include(p => p.Likes)
              .Include(p => p.ChildPosts)
              .OrderByDescending(p => p.CreatedAt)
            .Select(p => new PostBriefResponse
            {
                Id = p.Id,
                Author = _mapper.Map<BaseUserDto>(user),
                Medias = _mapper.Map<IList<MediaDto>>(p.Medias.ToList()),
                IsLiked = p.Likes.Any(l => l.UserId == _currentUser.Id),
                LikeCount = p.Likes.Count,
                CreatedAt = p.CreatedAt,
                Text = p.Text,
                ChildCount = p.ChildPosts.Count,
                ParentPostAuthorUsername = null
            })
            .PaginatedListAsync(request.PageNumber, request.PageSize);

            return posts;
        }
    }
}
