using Travelist.Data.DTO.Users;
using Travelist.Models;

namespace Travelist.Services.Users
{
    public interface IUserService
    {
        Task<User?> GetUserAsync(string email);

        Task<UserDto?> GetUserDtoAsync(string email);
        Task<UserInfoDto?> GetUserInfoDtoAsync(string username);

        Task<UserDto> CreateUserAsync(CreateUserDto createUserDto);
        Task DeleteUserAsync(string email);

        Task<UserDto?> UpdateUserAsync(string email, UpdateUserDto updateUserDto);
        Task UpdateUserPassword(string email, UpdateUserPasswordDto updateUserPasswordDto);
    }
}
