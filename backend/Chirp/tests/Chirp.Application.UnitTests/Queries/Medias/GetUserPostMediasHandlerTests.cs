using AutoMapper;
using Chirp.Application.Common;
using Chirp.Application.Common.Interfaces;
using Chirp.Application.Queries.Medias;
using Chirp.Application.Queries.Medias.GetUserPostMedias;
using Chirp.Domain.Entities;
using FluentAssertions;
using MockQueryable.NSubstitute;
using NSubstitute;
using System.Reflection;

namespace Chirp.Application.UnitTests.Queries.Medias
{

    public class GetUserPostMediasQueryHandlerTests
    {
        private readonly IMapper _mapper;
        private readonly IAppDbContext _dbContext;
        private readonly ICurrentUser _currentUser;
        private readonly GetUserPostMediasQueryHandler _handler;

        public GetUserPostMediasQueryHandlerTests()
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddMaps(Assembly.GetAssembly(typeof(MediaDto)));
            });
            _mapper = config.CreateMapper();
            _dbContext = Substitute.For<IAppDbContext>();
            _currentUser = Substitute.For<ICurrentUser>();
            _handler = new GetUserPostMediasQueryHandler(_mapper, _dbContext, _currentUser);
        }

        [Fact]
        public async Task Handle_ShouldReturnPostMedias_WhenValidQueryIsProvided()
        {
            // Arrange
            var query = new GetUserPostMediasQuery { Username = "testuser", PageNumber = 1, PageSize = 10 };
            var media = new Media { PostId = 123, User = new User { Username = "testuser" }, Url = "fakeurl.com" };
            var mockMedias = new List<Media> { media }.AsQueryable().BuildMockDbSet();
            _dbContext.Medias.Returns(mockMedias);
            var expectedMediaDto = _mapper.Map<MediaDto>(media);
            var expectedResponse = new PostMediasResponse { PostId = 123, Medias = new List<MediaDto> { expectedMediaDto } };
            // Act
            var response = await _handler.Handle(query, CancellationToken.None);
            // Assert
            response.Items.Should().ContainSingle();
            response.Items.Single().Should().BeEquivalentTo(expectedResponse);
        }
    }
}
