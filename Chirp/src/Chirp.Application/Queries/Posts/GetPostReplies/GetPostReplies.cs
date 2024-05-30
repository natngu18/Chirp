using AutoMapper;
using Chirp.Application.Common;
using Chirp.Application.Common.Exceptions;
using Chirp.Application.Common.Interfaces;
using Chirp.Application.Common.Mapping;
using Chirp.Application.Queries.Medias;
using Chirp.Application.Queries.Users;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Chirp.Application.Queries.Posts.GetPostReplies
{

    public record GetPostRepliesQuery : PaginationParams, IRequest<PaginatedList<PostBriefResponse>>
    {
        public int PostId { get; init; }
    };

    public class GetPostRepliesQueryHandler : IRequestHandler<GetPostRepliesQuery, PaginatedList<PostBriefResponse>>
    {
        private readonly IMapper _mapper;
        private readonly IAppDbContext _dbContext;
        private readonly ICurrentUser _currentUser;

        public GetPostRepliesQueryHandler(IMapper mapper, IAppDbContext appDbContext, ICurrentUser currentUser)
        {
            _mapper = mapper;
            _dbContext = appDbContext;
            _currentUser = currentUser;
        }

        public async Task<PaginatedList<PostBriefResponse>> Handle(GetPostRepliesQuery request, CancellationToken cancellationToken)
        {
            var post = await _dbContext.Posts
                .FirstOrDefaultAsync(p => p.Id == request.PostId, cancellationToken);
            if (post == null)
            {
                throw new NotFoundException("Post", request.PostId);
            }

            var replies = await _dbContext.Posts
                .Where(p => p.ParentPost != null && p.ParentPost.Id == request.PostId)
                .Include(p => p.Author)
                    .ThenInclude(u => u.Medias.Where(m => m.IsAvatar == true))
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
                })
                .PaginatedListAsync(request.PageNumber, request.PageSize);

            return replies;
        }
    }
}
