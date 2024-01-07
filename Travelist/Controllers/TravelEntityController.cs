using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Travelist.Data.DTO.Comments;
using Travelist.Data.DTO.TravelEntities;
using Travelist.Data.DTO.Users;
using Travelist.Models;
using Travelist.Services.TravelEntities;
using Travelist.Services.Users;

namespace Travelist.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TravelEntityController : ControllerBase
    {
        private readonly ITravelEntityService travelEntityService;
        private readonly IUserService userService;
        private readonly IValidator<CreateTravelEntityDto> createTravelEntityDtoValidator;
        private readonly IValidator<UpdateTravelEntityDto> updateTravelEntityDtoValidator;
        private readonly IValidator<CreateCommentDto> createCommentDtoValidator;
        private readonly IValidator<UpdateCommentDto> updateCommentDtoValidator;

        public TravelEntityController(
            ITravelEntityService travelEntityService, 
            IUserService userService,
            IValidator<CreateTravelEntityDto> createTravelEntityDtoValidator,
            IValidator<UpdateTravelEntityDto> updateTravelEntityDtoValidator,
            IValidator<UpdateCommentDto> updateCommentDtoValidator,
            IValidator<CreateCommentDto> createCommentDtoValidator)
        {
            this.travelEntityService = travelEntityService;
            this.userService = userService;
            this.createTravelEntityDtoValidator = createTravelEntityDtoValidator;
            this.updateTravelEntityDtoValidator = updateTravelEntityDtoValidator;
            this.updateCommentDtoValidator = updateCommentDtoValidator;
            this.createCommentDtoValidator = createCommentDtoValidator;
        }

        [HttpGet("locations")]
        [AllowAnonymous]
        public async Task<ActionResult> GetLocations()
        {
            var locations = await this.travelEntityService.GetAllLocationsAsync();
            return Ok(locations);
        }

        [HttpGet("filter")]
        [AllowAnonymous]
        public async Task<ActionResult> Filter(string? query, int count, int offset)
        {
            int userId = await GetUserIdIfAny();
            var travelEntityPreviews =
                await this.travelEntityService
                          .FilterTravelEntityPreviewsAsync(query, count, offset, userId);

            return Ok(travelEntityPreviews);
        }

        [HttpGet("{travelEntityId}")]
        [AllowAnonymous]
        public async Task<ActionResult> GetTravelEntity(int travelEntityId)
        {
            int userId = await GetUserIdIfAny();
            var travelEntity = 
                await this.travelEntityService.GetTravelEntityDtoAsync(travelEntityId, userId);

            if (travelEntity is null)
            {
                return NotFound();
            }

            return Ok(travelEntity);
        }

        [HttpPost("create")]
        [Authorize]
        public async Task<ActionResult> CreateTravelEntity(CreateTravelEntityDto createTravelEntityDto)
        {
            var validationResult = 
                await this.createTravelEntityDtoValidator.ValidateAsync(createTravelEntityDto);

            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }

            var travelEntityDto = 
                await this.travelEntityService.CreateTravelEntityAsync(
                    createTravelEntityDto,
                    await GetCurrentUser());

            return CreatedAtAction(nameof(GetTravelEntity), new { travelEntityId = travelEntityDto.Id }, travelEntityDto);
        }

        [HttpPut("update")]
        [Authorize]
        public async Task<ActionResult> UpdateTravelEntity(UpdateTravelEntityDto updateTravelEntityDto)
        {
            var validationResult = 
                await this.updateTravelEntityDtoValidator.ValidateAsync(updateTravelEntityDto);

            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }

            var travelEntity = 
                await this.travelEntityService.GetTravelEntityAsync(updateTravelEntityDto.Id);
            if (travelEntity is null)
            {
                return NotFound();
            }

            if (travelEntity.UserId != (await GetCurrentUser()).Id)
            {
                return Forbid();
            }

            var updatedTravelEntity = 
                await this.travelEntityService.UpdateTravelEntityAsync(updateTravelEntityDto);

            return Ok(updatedTravelEntity);
        }

        [HttpDelete("delete/{travelEntityId}")]
        [Authorize]
        public async Task<ActionResult> DeleteTravelEntity(int travelEntityId)
        {
            var travelEntity = await this.travelEntityService.GetTravelEntityAsync(travelEntityId);
            if (travelEntity is null)
            {
                return NoContent();
            }

            if (travelEntity.UserId != (await GetCurrentUser()).Id)
            {
                return Forbid();
            }

            await this.travelEntityService.DeleteTravelEntityAsync(travelEntity);
            return NoContent();
        }

        [HttpPost("switch-like/{travelEntityId}")]
        [Authorize]
        public async Task<ActionResult> SwitchTravelEntityLike(int travelEntityId)
        {
            var userId = (await GetCurrentUser()).Id;
            var travelEntity = 
                await this.travelEntityService.GetTravelEntityAsync(travelEntityId);

            if (travelEntity is null)
            {
                return NotFound();
            }

            bool isLiked 
                = await this.travelEntityService.SwitchTravelEntityLikeAsync(
                    travelEntityId, 
                    userId);

            return Ok(isLiked);
        }

        [HttpGet("contribution/{username}")]
        [AllowAnonymous]
        public async Task<ActionResult> GetContribution(string username, int count, int offset)
        {
            int userId = await GetUserIdIfAny();
            var contribution = 
                await this.travelEntityService.GetContributionAsync(username, count, offset, userId);
            
            if (contribution is null)
            {
                return NotFound();
            }

            return Ok(contribution);
        }

        [HttpGet]
        [Route("comments/{travelEntityId}")]
        public async Task<ActionResult<IEnumerable<CommentDto>>> GetComments(int travelEntityId)
        {
            var comments = await this.travelEntityService.GetCommentsByTravelEntityIdAsync(travelEntityId);
            return Ok(comments);
        }

        [HttpPost]
        [Route("comment")]
        [Authorize]
        public async Task<ActionResult<CommentDto>> AddComment(CreateCommentDto createCommentDto)
        {
            var validationResult =
                await this.createCommentDtoValidator.ValidateAsync(createCommentDto);

            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }

            int userId = (await GetCurrentUser()).Id;
            var commentDto = await this.travelEntityService.AddCommentAsync(createCommentDto, userId);
            return CreatedAtAction(nameof(GetComments), new { createCommentDto.TravelEntityId }, commentDto);
        }

        [HttpPut]
        [Route("comment/{commentId}")]
        [Authorize]
        public async Task<IActionResult> UpdateComment(int commentId, UpdateCommentDto updateCommentDto)
        {
            var validationResult =
                await this.updateCommentDtoValidator.ValidateAsync(updateCommentDto);

            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }
            var comment =
                await this.travelEntityService.GetCommentAsync(commentId);
            if (comment is null)
            {
                return NotFound();
            }

            int userId = (await GetCurrentUser()).Id;
            if (comment.UserId != userId)
            {
                return Forbid();
            }

            var updatedComment = await this.travelEntityService.UpdateCommentAsync(comment, updateCommentDto.Content, userId);
            return Content(updatedComment.Content);
        }

        [HttpDelete]
        [Route("comment/{commentId}")]
        [Authorize]
        public async Task<IActionResult> DeleteComment(int commentId)
        {
            var comment =
               await this.travelEntityService.GetCommentAsync(commentId);
            if (comment is null)
            {
                return NoContent();
            }

            int userId = (await GetCurrentUser()).Id;
            if (comment.UserId != userId)
            {
                return Forbid();
            }

            await this.travelEntityService.DeleteCommentAsync(commentId, userId);
            return NoContent();
        }

        private async Task<User> GetCurrentUser()
        {
            var email = this.User.Identity?.Name;
            if (email is null)
            {
                throw new InvalidOperationException("User is not authenticated");
            }

            var user = await this.userService.GetUserAsync(email);
            if (user is null)
            {
                throw new InvalidOperationException("User is not authenticated");
            }

            return user;
        }

        private async Task<int> GetUserIdIfAny()
        {
            int userId = 0;
            if (this.User.Identity?.IsAuthenticated ?? false)
            {
                userId = (await GetCurrentUser()).Id;
            }

            return userId;
        }
    }
}
