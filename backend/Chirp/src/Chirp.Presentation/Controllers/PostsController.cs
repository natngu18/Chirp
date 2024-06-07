using Chirp.Application.Commands.Likes.CreateLike;
using Chirp.Application.Commands.Likes.DeleteLike;
using Chirp.Application.Commands.Posts.CreatePost;
using Chirp.Application.Queries.Posts.GetFollowedUsersPosts;
using Chirp.Application.Queries.Posts.GetPostParents;
using Chirp.Application.Queries.Posts.GetPostReplies;
using Chirp.Application.Queries.Posts.GetPostsBySearch;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Chirp.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly ISender _mediator;
        public PostsController(ISender sender)
        {
            _mediator = sender;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreatePost(CreatePostCommand command)
        {
            var createPostResult = await _mediator.Send(command);
            return Ok(createPostResult);
        }
        [HttpPost]
        [Route("{ParentPostId}")]
        [Authorize]
        public async Task<IActionResult> CreateChildPost(CreatePostCommand command)
        {
            var createPostResult = await _mediator.Send(command);
            return Ok(createPostResult);
        }

        [HttpGet]
        public async Task<IActionResult> GetPostsBySearch([FromQuery] GetPostsBySearchQuery command)
        {
            var res = await _mediator.Send(command);
            return Ok(res);
        }

        [HttpGet]
        [Route("followings")]
        [Authorize]
        public async Task<IActionResult> GetFollowedUsersPosts([FromQuery] GetFollowedUsersPostsQuery command)
        {
            var res = await _mediator.Send(command);
            return Ok(res);
        }
        [HttpGet]
        [Route("{PostId}")]
        public async Task<IActionResult> GetParentPosts([FromRoute] GetPostAndParentsQuery command)
        {
            var res = await _mediator.Send(command);
            return Ok(res);
        }

        [HttpGet]
        [Route("{PostId}/replies")]
        public async Task<IActionResult> GetPostReplies([FromRoute] GetPostRepliesQuery command)
        {
            var res = await _mediator.Send(command);
            return Ok(res);
        }

        [HttpPost]
        [Route("{PostId}/likes")]
        [Authorize]
        public async Task<IActionResult> CreateLike([FromRoute] CreateLikeCommand command)
        {
            var res = await _mediator.Send(command);
            return Ok(res);
        }

        [HttpDelete]
        [Route("{PostId}/likes")]
        [Authorize]
        public async Task<IActionResult> DeleteLike([FromRoute] DeleteLikeCommand command)
        {
            var res = await _mediator.Send(command);
            return Ok(res);
        }
    }
}
