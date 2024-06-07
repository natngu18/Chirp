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

namespace Chirp.Application.Queries.Posts.GetUserReplies
{
    public record GetUserRepliesQuery : PaginationParams, IRequest<PaginatedList<PostBriefResponse>>
    {
        public string Username { get; init; }

    };

    public class GetUserRepliesQueryHandler : IRequestHandler<GetUserRepliesQuery, PaginatedList<PostBriefResponse>>
    {
        private readonly IMapper _mapper;
        private readonly IAppDbContext _dbContext;
        private readonly ICurrentUser _currentUser;

        public GetUserRepliesQueryHandler(IMapper mapper, IAppDbContext appDbContext, ICurrentUser currentUser)
        {
            _mapper = mapper;
            _dbContext = appDbContext;
            _currentUser = currentUser;
        }

        public async Task<PaginatedList<PostBriefResponse>> Handle(GetUserRepliesQuery request, CancellationToken cancellationToken)
        {
            var user = await _dbContext.Users
                .Where(u => u.Username == request.Username)
                .Include(u => u.Medias.Where(m => m.IsAvatar == true))
                .FirstOrDefaultAsync(cancellationToken);

            if (user is null)
            {
                throw new NotFoundException(nameof(User), request.Username);
            }
            var query = _dbContext.Posts;


            var posts = await _dbContext.Posts
                .Where(p => p.AuthorId == user.Id && p.ParentPost != null)
                .Include(p => p.ParentPost)
                    //TODO: not necessary?
                    .ThenInclude(pp => pp.Author)
                        .ThenInclude(u => u.Medias.Where(m => m.IsAvatar == true))
                .Select(p => new PostBriefResponse
                {
                    Author = _mapper.Map<BaseUserDto>(user),
                    Id = p.Id,
                    Medias = _mapper.Map<IList<MediaDto>>(p.Medias.ToList()),
                    IsLiked = p.Likes.Any(l => l.UserId == _currentUser.Id),
                    LikeCount = p.Likes.Count,
                    CreatedAt = p.CreatedAt,
                    Text = p.Text,
                    ChildCount = p.ChildPosts.Count,
                    ParentPostAuthorUsername = p.ParentPost.Author.Username,
                })
                .PaginatedListAsync(request.PageNumber, request.PageSize);

            return posts;
        }
    }
}
