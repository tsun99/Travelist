using Travelist.Data.DTO.Comments;
using Travelist.Data.DTO.TravelEntities;
using Travelist.Models;

namespace Travelist.Services.TravelEntities
{
    public interface ITravelEntityService
    {
        Task<TravelEntity?> GetTravelEntityAsync(int travelEntityId);

        Task<List<string>> GetAllLocationsAsync();
        Task<List<TravelEntityPreviewDto>> FilterTravelEntityPreviewsAsync(string? query, int count, int offset, int userId = 0);
        Task<TravelEntityDto?> GetTravelEntityDtoAsync(int travelEntityId, int userId = 0);
        Task<TravelEntityDto> CreateTravelEntityAsync(CreateTravelEntityDto createTravelEntityDto, User user);
        Task<TravelEntityDto?> UpdateTravelEntityAsync(UpdateTravelEntityDto updateTravelEntityDto);
        Task DeleteTravelEntityAsync(TravelEntity travelEntity);

        Task<bool> SwitchTravelEntityLikeAsync(int travelEntityId, int userId);
        Task<List<TravelEntityPreviewDto>?> GetContributionAsync(string username, int count, int offset, int userId = 0);

        Task<Comment?> GetCommentAsync(int commentId);
        Task<CommentDto> AddCommentAsync(CreateCommentDto createCommentDto, int userId);
        Task<IEnumerable<CommentDto>> GetCommentsByTravelEntityIdAsync(int travelEntityId);
        Task DeleteCommentAsync(int commentId, int userId);
        Task<CommentDto> UpdateCommentAsync(Comment comment, string updatedContent, int userId);
    }

   
}
