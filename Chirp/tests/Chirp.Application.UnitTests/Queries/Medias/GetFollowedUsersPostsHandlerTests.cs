using AutoMapper;
using Chirp.Application.Common;
using Chirp.Application.Common.Interfaces;
using Chirp.Application.Queries.Medias;
using Chirp.Application.Queries.Posts.GetFollowedUsersPosts;
using Chirp.Application.Queries.Users;
using Chirp.Domain.Entities;
using FluentAssertions;
using MockQueryable.NSubstitute;
using NSubstitute;
using System.Reflection;

namespace Chirp.Application.UnitTests.Queries.Medias
{
    public class GetPostAndParentsQueryHandlerTests
    {
        private readonly IMapper _mapper;
        private readonly IAppDbContext _dbContext;
        private readonly ICurrentUser _currentUser;
        private readonly GetPostAndParentsQueryHandler _handler;

        public GetPostAndParentsQueryHandlerTests()
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddMaps(Assembly.GetAssembly(typeof(MediaDto)));
                cfg.AddMaps(Assembly.GetAssembly(typeof(BaseUserDto)));

            });
            _mapper = config.CreateMapper();
            _dbContext = Substitute.For<IAppDbContext>();
            _currentUser = Substitute.For<ICurrentUser>();
            _handler = new GetPostAndParentsQueryHandler(_mapper, _dbContext, _currentUser);
        }

        [Fact]
        public async Task Handle_ShouldReturnPostBriefResponse_WhenValidQueryIsProvided()
        {
            // Arrange
            var query = new GetFollowedUsersPostsQuery { PageNumber = 1, PageSize = 10 };
            var post = new Post { Id = 123, Author = new User { Username = "testuser" } };
            var mockPosts = new List<Post> { post }.AsQueryable().BuildMockDbSet();
            _dbContext.Posts.Returns(mockPosts);
            _currentUser.Id.Returns("123");
            var follow = new Follow { FollowerId = _currentUser.Id, Followed = new User { Posts = new List<Post> { post } } };
            var mockFollows = new List<Follow> { follow }.AsQueryable().BuildMockDbSet();
            _dbContext.Follows.Returns(mockFollows);
            // Act
            var response = await _handler.Handle(query, CancellationToken.None);

            // Assert
            response.Items.Should().ContainSingle();
            response.Items.Single().Id.Should().Be(post.Id);
        }
    }
}
