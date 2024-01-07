using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Travelist.Data;
using Travelist.Data.DTO.Users;
using Travelist.Models;
using Travelist.Services.Authentication;

namespace Travelist.Services.Users
{
    public class UserService : IUserService, IPublicUserService
    {
        private readonly IPasswordHasher passwordHasher;
        private readonly AppDbContext dbContext;
        private readonly IMapper mapper;

        public UserService(
            IPasswordHasher passwordHasher,
            AppDbContext dbContext,
            IMapper mapper)
        {
            this.passwordHasher = passwordHasher;
            this.dbContext = dbContext;
            this.mapper = mapper;
        }

        public async Task<User?> GetUserAsync(string email)
        {
            var user = await this.dbContext.Users.SingleOrDefaultAsync(u => u.Email == email);
            return user;
        }

        public async Task<UserInfoDto?> GetUserInfoDtoAsync(string username)
        {
            var user = await this.dbContext.Users.SingleOrDefaultAsync(u => u.Username == username);
            if (user is null)
            {
                return null;
            }

            var userDto = mapper.Map<UserInfoDto>(user);
            return userDto;
        }

        public async Task<UserDto?> GetUserDtoAsync(string userEmail)
        {
            var user = await this.dbContext.Users.SingleOrDefaultAsync(u => u.Email == userEmail);
            if (user is null)
            {
                return null;
            }

            var userDto = mapper.Map<UserDto>(user);
            return userDto;
        }

        public async Task<UserDto> CreateUserAsync(CreateUserDto createUserDto)
        {
            string passwordHash =
                this.passwordHasher.HashPassword(createUserDto.Password);

            var user = mapper.Map<User>(createUserDto);
            user.PasswordHash = passwordHash;
            user.Username = GenerateUniqueUsername();

            await this.dbContext.Users.AddAsync(user);
            await this.dbContext.SaveChangesAsync();

            var userDto = mapper.Map<UserDto>(user);
            return userDto;
        }

        private static string GenerateUniqueUsername()
        {
            var username = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
            username = username.Replace('+', '-').Replace('/', '_')[..^2];
            return username;
        }

        public async Task<UserDto?> UpdateUserAsync(string email, UpdateUserDto updateUserDto)
        {
            var user = await this.dbContext.Users.SingleOrDefaultAsync(u => u.Email == email);
            if (user is null)
            {
                return null;
            }

            mapper.Map(updateUserDto, user);

            this.dbContext.Users.Update(user);
            await this.dbContext.SaveChangesAsync();

            var userDto = mapper.Map<UserDto>(user);
            return userDto;
        }

        public async Task UpdateUserPassword(string email, UpdateUserPasswordDto updateUserPasswordDto)
        {
            var user = await this.dbContext.Users.SingleOrDefaultAsync(u => u.Email == email);
            if (user is null)
            {
                throw new InvalidOperationException("User not found");
            }

            string passwordHash =
                this.passwordHasher.HashPassword(updateUserPasswordDto.NewPassword);

            user.PasswordHash = passwordHash;

            this.dbContext.Users.Update(user);
            await this.dbContext.SaveChangesAsync();
        }

        public async Task DeleteUserAsync(string email)
        {
            var user = await this.dbContext.Users.SingleOrDefaultAsync(u => u.Email == email);
            if (user is null)
            {
                return;
            }

            var likes = 
                await this.dbContext.TravelEntityLikes.Where(x => x.UserId == user.Id).ToListAsync();
            
            var comments = 
                await this.dbContext.Comments.Where(x => x.UserId == user.Id).ToListAsync();

            this.dbContext.Users.Remove(user);
            await this.dbContext.SaveChangesAsync();
        }

        public async Task<UserPreviewDto?> GetUserPreviewDto(int userId)
        {
            var user = await this.dbContext.Users.SingleOrDefaultAsync(u => u.Id == userId);
            if (user is null)
            {
                return null;
            }

            var userDto = mapper.Map<UserPreviewDto>(user);
            return userDto;
        }

        public Task<UserPreviewDto> GetUserPreviewDto(User user)
        {
            var userDto = mapper.Map<UserPreviewDto>(user);
            return Task.FromResult(userDto);
        }
    }
}
