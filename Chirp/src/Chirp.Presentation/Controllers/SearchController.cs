using Chirp.Application.Queries.Search.GetSearchSuggestions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Chirp.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly ISender _mediator;
        public SearchController(ISender sender)
        {
            _mediator = sender;
        }

        [HttpGet("suggestions")]
        public async Task<ActionResult<SearchSuggestionsResponse>> GetSearchSuggestions([FromQuery] GetSearchSuggestionsQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

    }
}
