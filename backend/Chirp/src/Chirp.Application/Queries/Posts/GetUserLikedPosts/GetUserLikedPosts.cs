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

namespace Chirp.Application.Queries.Posts.GetUserLikedPosts
{

    public record GetUserLikedPostsQuery : PaginationParams, IRequest<PaginatedList<PostBriefResponse>>
    {
        public string Username { get; init; }
    }

    public class GetUserLikedPostsQueryHandler : IRequestHandler<GetUserLikedPostsQuery, PaginatedList<PostBriefResponse>>
    {
        private readonly IAppDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly ICurrentUser _currentUser;
        public GetUserLikedPostsQueryHandler(IAppDbContext dbContext, IMapper mapper, ICurrentUser currentUser)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _currentUser = currentUser;
        }

        public async Task<PaginatedList<PostBriefResponse>> Handle(GetUserLikedPostsQuery request, CancellationToken cancellationToken)
        {
            var user = await _dbContext.Users
               .Where(u => u.Username == request.Username)
               .FirstOrDefaultAsync(cancellationToken);
            if (user is null)
            {
                throw new NotFoundException(nameof(User), request.Username);
            }

            var posts = await _dbContext.Posts
                .Include(p => p.Medias)
                .Include(p => p.Likes)
                .Include(p => p.ChildPosts)
                .Include(p => p.Author)
                    .ThenInclude(u => u.Medias.Where(m => m.IsAvatar))
                .Where(p => p.Likes.Any(l => l.UserId == user.Id))
                .Select(p => new PostBriefResponse
                {
                    Id = p.Id,
                    Author = _mapper.Map<BaseUserDto>(p.Author),
                    Medias = _mapper.Map<IList<MediaDto>>(p.Medias.ToList()),
                    IsLiked = p.Likes.Any(l => l.UserId == _currentUser.Id),
                    LikeCount = p.Likes.Count,
                    CreatedAt = p.CreatedAt,
                    Text = p.Text,
                    ChildCount = p.ChildPosts.Count,
                    ParentPostAuthorUsername = p.ParentPost != null ? p.ParentPost.Author.Username : null
                })
            .PaginatedListAsync(request.PageNumber, request.PageSize);
            return posts;
        }
    }
}
