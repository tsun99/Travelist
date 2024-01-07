using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using Travelist.Data.DTO.Users;
using Travelist.Models;
using Travelist.Options;
using Travelist.Services.Authentication;
using Travelist.Services.Users;

namespace Travelist.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IAuthenticationService authenticationService;
        private readonly IUserService userService;
        private readonly IValidator<CreateUserDto> createUserDtoValidator;
        private readonly IValidator<UpdateUserDto> updateUserDtoValidator;
        private readonly IValidator<UpdateUserPasswordDto> updateUserPasswordDtoValidator;

        public UserController(
            IAuthenticationService authenticationService,
            IUserService userService,
            IValidator<CreateUserDto> createUserDtoValidator,
            IValidator<UpdateUserDto> updateUserDtoValidator,
            IValidator<UpdateUserPasswordDto> updateUserPasswordDtoValidator)
        {
            this.authenticationService = authenticationService;
            this.userService = userService;
            this.createUserDtoValidator = createUserDtoValidator;
            this.updateUserDtoValidator = updateUserDtoValidator;
            this.updateUserPasswordDtoValidator = updateUserPasswordDtoValidator;
        }

        [HttpPost("create")]
        [AllowAnonymous]
        public async Task<ActionResult> CreateUser(CreateUserDto createUserDto)
        {
            var validationResult = await this.createUserDtoValidator.ValidateAsync(createUserDto);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }

            var existingUser = await this.userService.GetUserAsync(createUserDto.Email);
            if (existingUser is not null)
            {
                return Conflict("User with this email already exists");
            }

            var userDto = await this.userService.CreateUserAsync(createUserDto);

            return CreatedAtAction(nameof(GetCurrentUser), userDto);
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult> LoginUser(LoginUserDto loginUserDto)
        {
            string failureMessage = "Wrong email or password";

            var user = await this.userService.GetUserAsync(loginUserDto.Email);
            if (user is null)
            {
                return BadRequest(failureMessage);
            }

            if (!this.authenticationService.VerifyPassword(
                loginUserDto.Password, user.PasswordHash))
            {
                return BadRequest(failureMessage);
            }

            var token = this.authenticationService.GetLoginToken(user);
            return Ok(token);
        }

        [HttpGet("{username}")]
        [AllowAnonymous]
        public async Task<ActionResult> GetUser(string username)
        {
            var userDto = await this.userService.GetUserInfoDtoAsync(username);
            if (userDto is null)
            {
                return NotFound();
            }

            return Ok(userDto);
        }

        [HttpGet("current")]
        [Authorize]
        public async Task<ActionResult> GetCurrentUser()
        {
            var userEmail = this.GetCurrentUserEmail();

            var userDto = await this.userService.GetUserDtoAsync(userEmail);
            if (userDto is null)
            {
                return NotFound();
            }

            return Ok(userDto);
        }

        [HttpPut("update")]
        [Authorize]
        public async Task<ActionResult> UpdateUser(UpdateUserDto updateUserDto)
        {
            var validationResult = await this.updateUserDtoValidator.ValidateAsync(updateUserDto);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }

            var userEmail = this.GetCurrentUserEmail();

            var userDto = await this.userService.UpdateUserAsync(userEmail, updateUserDto);
            if (userDto is null)
            {
                return NotFound();
            }

            return Ok(userDto);
        }

        [HttpPut("password/update")]
        [Authorize]
        public async Task<ActionResult> UpdateUserPassword(
            UpdateUserPasswordDto updateUserPasswordDto)
        {
            var validationResult = 
                await this.updateUserPasswordDtoValidator.ValidateAsync(updateUserPasswordDto);
            
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }

            var userEmail = this.GetCurrentUserEmail();
            var user = await this.userService.GetUserAsync(userEmail);
            if (user is null)
            {
                return NotFound();
            }

            if (!this.authenticationService.VerifyPassword(
                updateUserPasswordDto.OldPassword, user.PasswordHash))
            {
                return Unauthorized("Wrong password");
            }

            await this.userService.UpdateUserPassword(userEmail, updateUserPasswordDto);
            
            return Ok();
        }

        [HttpDelete("delete")]
        [Authorize]
        public async Task<ActionResult> DeleteUser([FromBody] string password)
        {
            var userEmail = this.GetCurrentUserEmail();

            var user = await this.userService.GetUserAsync(userEmail);
            if (user is null)
            {
                return NoContent();
            }

            if (!this.authenticationService.VerifyPassword(password, user.PasswordHash))
            {
                return BadRequest("Wrong password");
            }

            await this.userService.DeleteUserAsync(userEmail);
            return NoContent();
        }

        private string GetCurrentUserEmail()
        {
            var email = this.User.Identity?.Name;
            if (email is null)
            {
                throw new InvalidOperationException("User is not authenticated");
            }

            return email;
        }
    }
}
