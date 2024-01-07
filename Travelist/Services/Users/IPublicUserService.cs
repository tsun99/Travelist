using Travelist.Data.DTO.Users;
using Travelist.Models;

namespace Travelist.Services.Users
{
    public interface IPublicUserService
    {
        public Task<UserPreviewDto?> GetUserPreviewDto(int userId);
        public Task<UserPreviewDto> GetUserPreviewDto(User user);
    }
}
