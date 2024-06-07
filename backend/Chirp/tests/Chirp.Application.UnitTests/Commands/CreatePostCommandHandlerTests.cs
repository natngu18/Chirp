using Chirp.Application.Commands.Posts.CreatePost;
using Chirp.Application.Common;
using Chirp.Application.Common.Exceptions;
using Chirp.Application.Common.Interfaces;
using Chirp.Domain.Entities;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using MockQueryable.NSubstitute;
using NSubstitute;
using System.Text;

namespace Chirp.Application.UnitTests.Commands
{

    public class CreatePostCommandHandlerTests
    {
        private IAppDbContext _dbContext;
        private ICurrentUser _currentUser;
        private IFirebaseService _firebaseService;
        private CreatePostCommandHandler _handler;
        private User _testUser;

        public CreatePostCommandHandlerTests()
        {
            SetupTest(new User { Id = "testid", Username = "testuser" }, "testid");
        }

        private void SetupTest(User user, Post post, string currentUserId)
        {
            _dbContext = Substitute.For<IAppDbContext>();
            _currentUser = Substitute.For<ICurrentUser>();
            _firebaseService = Substitute.For<IFirebaseService>();
            _handler = new CreatePostCommandHandler(_dbContext, _currentUser, _firebaseService);
            _testUser = user;
            var mockUsers = new List<User> { user }.AsQueryable().BuildMockDbSet();
            _dbContext.Users.Returns(mockUsers);
            var mockPosts = new List<Post> { post }.AsQueryable().BuildMockDbSet();
            _dbContext.Posts.Returns(mockPosts);
            _currentUser.Id.Returns(currentUserId);
        }

        private void SetupTest(User user, string currentUserId)
        {
            _dbContext = Substitute.For<IAppDbContext>();
            _currentUser = Substitute.For<ICurrentUser>();
            _firebaseService = Substitute.For<IFirebaseService>();
            _handler = new CreatePostCommandHandler(_dbContext, _currentUser, _firebaseService);
            _testUser = user;
            var mockUsers = new List<User> { user }.AsQueryable().BuildMockDbSet();
            _dbContext.Users.Returns(mockUsers);
            _currentUser.Id.Returns(currentUserId);
            var mockPosts = new List<Post>().AsQueryable().BuildMockDbSet();
            _dbContext.Posts.Returns(mockPosts);
        }

        [Fact]
        public async Task Handle_ShouldCreateOriginalPost_WhenValidInputIsProvided()
        {
            // Arrange
            var command = new CreatePostCommand { Text = "Test post", ParentPostId = null };
            var mockFile = new FormFile(new MemoryStream(Encoding.UTF8.GetBytes("This is a dummy file")), 0, 0, "Data", "dummy.txt");
            command.Medias = new List<IFormFile> { mockFile };
            _firebaseService.UploadFile(Arg.Any<FormFile>(), Arg.Any<string>()).Returns("https://dummyurl.com");

            // Act
            var postId = await _handler.Handle(command, CancellationToken.None);

            // Assert
            await _dbContext.Posts.Received(1).AddAsync(Arg.Is<Post>(p => p.Text == command.Text), Arg.Any<CancellationToken>());
            await _dbContext.Received(1).SaveChangesAsync(CancellationToken.None);
        }

        [Fact]
        public async Task Handle_ShouldCreateChildPost_WhenValidInputIsProvidedAndParentPostExists()
        {
            // Arrange
            SetupTest(
                new User { Id = "testid", Username = "testuser" },
                new Post { Id = 123 },
                "testid");
            var command = new CreatePostCommand { Text = "Test post", ParentPostId = 123 };
            var mockFile = new FormFile(new MemoryStream(Encoding.UTF8.GetBytes("This is a dummy file")), 0, 0, "Data", "dummy.txt");
            command.Medias = new List<IFormFile> { mockFile };
            _firebaseService.UploadFile(Arg.Any<FormFile>(), Arg.Any<string>()).Returns("https://dummyurl.com");

            // Act
            var postId = await _handler.Handle(command, CancellationToken.None);

            // Assert
            await _dbContext.Posts.Received(1).AddAsync(Arg.Is<Post>(p => p.Text == command.Text), Arg.Any<CancellationToken>());
            await _dbContext.Received(1).SaveChangesAsync(CancellationToken.None);
        }

        [Fact]
        public async Task Handle_ShouldThrowNotFoundException_WhenParentPostDoesNotExist()
        {
            // Arrange
            var command = new CreatePostCommand { Text = "Test post", ParentPostId = 123 };
            var mockFile = new FormFile(new MemoryStream(Encoding.UTF8.GetBytes("This is a dummy file")), 0, 0, "Data", "dummy.txt");
            command.Medias = new List<IFormFile> { mockFile };
            _firebaseService.UploadFile(Arg.Any<FormFile>(), Arg.Any<string>()).Returns("https://dummyurl.com");

            // Act
            var exception = await Record.ExceptionAsync(() => _handler.Handle(command, CancellationToken.None));

            //assert
            exception.Should().BeOfType<NotFoundException>();
            exception.Message.Should().Be($"{nameof(Post)} ({command.ParentPostId}) was not found.");
        }
    }
}

