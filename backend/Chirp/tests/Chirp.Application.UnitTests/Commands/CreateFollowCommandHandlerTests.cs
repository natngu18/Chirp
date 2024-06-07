using Chirp.Application.Commands.Follows.CreateFollow;
using Chirp.Application.Common;
using Chirp.Application.Common.Exceptions;
using Chirp.Application.Common.Interfaces;
using Chirp.Domain.Entities;
using FluentAssertions;
using MediatR;
using MockQueryable.NSubstitute;
using NSubstitute;

namespace Application.UnitTests.Commands
{
    public class CreateFollowCommandHandlerTests
    {
        private IAppDbContext _dbContext;
        private ICurrentUser _currentUser;
        private CreateFollowCommandHandler _handler;
        private User _testUser;
        private string _currentUserId;

        public CreateFollowCommandHandlerTests()
        {
            SetupTest(new User { Id = "testid", Username = "testuser" }, "currentuserid");
        }
        private void SetupTest(User user, string currentUserId)
        {
            _dbContext = Substitute.For<IAppDbContext>();
            _currentUser = Substitute.For<ICurrentUser>();
            _testUser = user;
            var data = new List<User> { user };
            var mockUsers = data.AsQueryable().BuildMockDbSet();
            _dbContext.Users.Returns(mockUsers);
            var followData = new List<Follow>();
            var mockFollows = followData.AsQueryable().BuildMockDbSet();
            _dbContext.Follows.Returns(mockFollows);
            _currentUserId = currentUserId;
            _currentUser.Id.Returns(_currentUserId);

            _handler = new CreateFollowCommandHandler(_dbContext, _currentUser);
        }
        private void SetupTest(User user, string currentUserId, Follow follow)
        {
            _dbContext = Substitute.For<IAppDbContext>();
            _currentUser = Substitute.For<ICurrentUser>();
            _testUser = user;
            var data = new List<User> { user };
            var mockUsers = data.AsQueryable().BuildMockDbSet();
            _dbContext.Users.Returns(mockUsers);
            var followData = new List<Follow>() { follow };
            var mockFollows = followData.AsQueryable().BuildMockDbSet();
            _dbContext.Follows.Returns(mockFollows);
            _currentUserId = currentUserId;
            _currentUser.Id.Returns(_currentUserId);
            _handler = new CreateFollowCommandHandler(_dbContext, _currentUser);
        }

        [Fact]
        public async Task Handle_ShouldSucceed_WhenCurrentUserIdIsNotUsernameUserId()
        {
            // Arrange
            var command = new CreateFollowCommand { Username = _testUser.Username };

            // Act
            var result = await _handler.Handle(command, CancellationToken.None);

            // Assert
            result.Should().Be(Unit.Value);
            _dbContext.Follows.Received(1).Add(Arg.Any<Follow>());
        }


        [Fact]
        public async Task Handle_ShouldThrowBadRequestException_WhenCurrentUserIdIsSameAsUsernameUserId()
        {
            // Arrange
            SetupTest(new User { Id = "sameuserid", Username = "test" }, "sameuserid");
            var command = new CreateFollowCommand { Username = _testUser.Username };

            // Act
            var exception = await Record.ExceptionAsync(() => _handler.Handle(command, CancellationToken.None));

            //assert
            exception.Should().BeOfType<BadRequestException>();
            exception.Message.Should().Be("You cannot follow yourself");
        }
        [Fact]
        public async Task Handle_ShouldThrowBadRequestException_WhenCurrentUserAlreadyFollowsUser()
        {
            // Arrange
            SetupTest(
                new User { Username = "test", Id = "userid1" },
                "currentUserid2",
                new Follow { FollowerId = "currentUserid2", FollowedId = "userid1" });
            var command = new CreateFollowCommand { Username = _testUser.Username };

            // Act
            var exception = await Record.ExceptionAsync(() => _handler.Handle(command, CancellationToken.None));

            //assert
            exception.Should().BeOfType<BadRequestException>();
            exception.Message.Should().Be("You are already following this user");
        }
    }
}
