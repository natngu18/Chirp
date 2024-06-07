using Chirp.Application.Commands.Follows.CreateFollow;
using Chirp.Application.Commands.Follows.DeleteFollow;
using Chirp.Application.Commands.Users.CreateUser;
using Chirp.Application.Commands.Users.UpdateUser;
using Chirp.Application.Queries.Medias.GetUserPostMedias;
using Chirp.Application.Queries.Posts.GetUserLikedPosts;
using Chirp.Application.Queries.Posts.GetUserOriginalPosts;
using Chirp.Application.Queries.Posts.GetUserReplies;
using Chirp.Application.Queries.Users.GetTopFollowedUsers;
using Chirp.Application.Queries.Users.GetUserById;
using Chirp.Application.Queries.Users.GetUserByUsername;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Chirp.Presentation.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ISender _mediator;
        public UsersController(ISender sender)
        {
            _mediator = sender;
        }

        [HttpPost]
        //[Authorize]
        public async Task<IActionResult> CreateUser(CreateUserCommand command)
        {
            var res = await _mediator.Send(command);
            return Ok(res);
        }

        [HttpGet]
        public async Task<IActionResult> GetUserByUsername([FromQuery] GetUserByUsernameQuery command)
        {
            var res = await _mediator.Send(command);
            return Ok(res);
        }

        // TODO: This isn't necessary...
        [HttpGet("{UserId}")]
        public async Task<IActionResult> GetUserById([FromRoute] GetUserByIdQuery command)
        {
            var res = await _mediator.Send(command);
            return Ok(res);
        }

        [HttpPatch]
        [Route("{Username}")]
        [Authorize]
        public async Task<IActionResult> UpdateUser([FromForm] UpdateUserCommand command)
        {
            var res = await _mediator.Send(command);
            return Ok(res);
        }

        [HttpGet]
        [Route("{Username}/posts")]
        public async Task<IActionResult> GetUserOriginalPosts([FromRoute] GetUserOriginalPostsQuery command)
        {
            var res = await _mediator.Send(command);
            return Ok(res);
        }


        [HttpGet]
        [Route("{Username}/replies")]
        public async Task<IActionResult> GetUserReplies([FromRoute] GetUserRepliesQuery command)
        {
            var res = await _mediator.Send(command);
            return Ok(res);
        }

        [HttpGet]
        [Route("{Username}/posts/likes")]
        public async Task<IActionResult> GetUserLikedPosts([FromRoute] GetUserLikedPostsQuery command)
        {
            var res = await _mediator.Send(command);
            return Ok(res);
        }

        [HttpGet]
        [Route("{Username}/posts/medias")]
        public async Task<IActionResult> GetUserPostMedias([FromRoute] GetUserPostMediasQuery command)
        {
            var res = await _mediator.Send(command);
            return Ok(res);
        }


        [HttpPost]
        [Route("{Username}/followers")]
        [Authorize]
        public async Task<IActionResult> CreateFollow([FromRoute] CreateFollowCommand command)
        {
            var res = await _mediator.Send(command);
            return Ok(res);
        }

        [HttpDelete]
        [Route("{Username}/followers")]
        [Authorize]
        public async Task<IActionResult> DeleteFollow([FromRoute] DeleteFollowCommand command)
        {
            var res = await _mediator.Send(command);
            return Ok(res);
        }

        [HttpGet]
        [Route("top-followed")]
        public async Task<IActionResult> GetTopFollowedUsers([FromQuery] GetTopFollowedUsersQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }
    }
}
