using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Travelist.Data;
using Travelist.Data.DTO.Comments;
using Travelist.Data.DTO.TravelEntities;
using Travelist.Models;
using Travelist.Services.Users;

namespace Travelist.Services.TravelEntities
{
    public class TravelEntityService : ITravelEntityService
    {
        private readonly AppDbContext dbContext;
        private readonly IMapper mapper;
        private readonly IPublicUserService userService;

        public TravelEntityService(
            AppDbContext dbContext, 
            IMapper mapper,
            IPublicUserService userService)
        {
            this.dbContext = dbContext;
            this.mapper = mapper;
            this.userService = userService;
        }

        public async Task<TravelEntityDto> CreateTravelEntityAsync(CreateTravelEntityDto createTravelEntityDto, User user)
        {
            var travelEntity = mapper.Map<TravelEntity>(createTravelEntityDto);
            travelEntity.UserId = user.Id;

            await this.dbContext.TravelEntities.AddAsync(travelEntity);
            await this.dbContext.SaveChangesAsync();

            var travelEntityDto = await this.GetTravelEntityDtoAsync(travelEntity.Id);
            if (travelEntityDto is null)
            {
                throw new InvalidOperationException("Travel entity was not created.");
            }

            return travelEntityDto;
        }

        public async Task DeleteTravelEntityAsync(TravelEntity travelEntity)
        {
            this.dbContext.TravelEntities.Remove(travelEntity);
            await this.dbContext.SaveChangesAsync();
        }

        public async Task<List<TravelEntityPreviewDto>> FilterTravelEntityPreviewsAsync(string? query, int count, int offset, int userId = 0)
        {
            IQueryable<TravelEntity> resultsQuery = this.dbContext.TravelEntities;
            if (!string.IsNullOrWhiteSpace(query))
            {
                resultsQuery = resultsQuery.Where(
                    travelEntity =>
                    (travelEntity.Text != null && travelEntity.Text.Contains(query)) ||
                    (travelEntity.City != null && travelEntity.City.Contains(query)) ||
                    (travelEntity.Title != null && travelEntity.Title.Contains(query)));
            }

            return await this.GetTravelEntityPreviews(resultsQuery, count, offset, userId);
        }

        public async Task<List<string>> GetAllLocationsAsync()
        {
            var locations = await this.dbContext.TravelEntities
                .Where(x => x.City != null)
                .Select(x => x.City ?? string.Empty)
                .Distinct()
                .ToListAsync();

            return locations ?? new List<string>();
        }

        public async Task<TravelEntity?> GetTravelEntityAsync(int travelEntityId)
        {
            var travelEntity = 
                await this.dbContext.TravelEntities.SingleOrDefaultAsync(
                    x => x.Id == travelEntityId);

            return travelEntity;
        }

        public async Task<TravelEntityDto?> GetTravelEntityDtoAsync(int travelEntityId, int userId = 0)
        {
            var travelEntity = 
                await this.dbContext.TravelEntities.SingleOrDefaultAsync(
                    x => x.Id == travelEntityId);

            if (travelEntity is null)
            {
                return null;
            }

            var travelEntityDto = this.mapper.Map<TravelEntityDto>(travelEntity);

            travelEntityDto.User 
                = await this.userService.GetUserPreviewDto(travelEntity.UserId);

            int likes = await this.dbContext.TravelEntityLikes
                .CountAsync(x => x.TravelEntityId == travelEntityId);

            travelEntityDto.Likes = likes;

            if (userId > 0)
            {
                var isLiked = await this.dbContext.TravelEntityLikes
                    .AnyAsync(x => x.TravelEntityId == travelEntityId && x.UserId == userId);

                travelEntityDto.IsLiked = isLiked;
            }

            return travelEntityDto;
        }

        public async Task<bool> SwitchTravelEntityLikeAsync(int travelEntityId, int userId)
        {
            var like = await this.dbContext.TravelEntityLikes
                .SingleOrDefaultAsync(
                    x => x.TravelEntityId == travelEntityId && x.UserId == userId);

            if (like is not null)
            {
                this.dbContext.TravelEntityLikes.Remove(like);
                await this.dbContext.SaveChangesAsync();
                return false;
            }

            await this.dbContext.TravelEntityLikes.AddAsync(
                new TravelEntityLike
                    {
                        TravelEntityId = travelEntityId,
                        UserId = userId
                    });

            await this.dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<TravelEntityDto?> UpdateTravelEntityAsync(UpdateTravelEntityDto updateTravelEntityDto)
        {
            var travelEntity =
                await this.dbContext.TravelEntities.SingleOrDefaultAsync(
                    x => x.Id == updateTravelEntityDto.Id);

            if (travelEntity is null)
            {
                return null;
            }

            this.mapper.Map(updateTravelEntityDto, travelEntity);
            this.dbContext.TravelEntities.Update(travelEntity);
            await this.dbContext.SaveChangesAsync();

            var travelEntityDto = await this.GetTravelEntityDtoAsync(travelEntity.Id);
            return travelEntityDto;
        }

        public async Task<List<TravelEntityPreviewDto>?> GetContributionAsync(string username, int count, int offset, int userId = 0)
        {
            var user = 
                await this.dbContext.Users.SingleOrDefaultAsync(
                    user => user.Username == username);

            if (user is null)
            {
                return null;
            }

            var travelEntitiesQuery = this.dbContext.TravelEntities
                .Where(travelEntity => travelEntity.UserId == user.Id);
            
            return await this.GetTravelEntityPreviews(travelEntitiesQuery, count, offset, userId);
        }

        // TODO: Refactor private methods and FilterTravelEntityPreviewsAsync
        private async Task<List<TravelEntityPreviewDto>> GetTravelEntityPreviews(IQueryable<TravelEntity> travelEntitiesQuery, int count, int offset, int userId = 0)
        {
            if (offset < 0)
            {
                offset = 0;
            }
            
            var likesQuery = this.dbContext.TravelEntityLikes;
            travelEntitiesQuery = travelEntitiesQuery
                .OrderByDescending(
                    travelEntity => likesQuery.Count(
                        like => like.TravelEntityId == travelEntity.Id))
                .Skip(offset);

            if (count > 0)
            {
                travelEntitiesQuery = travelEntitiesQuery.Take(count);
            }

            var travelEntityPreviews = new List<TravelEntityPreviewDto>();
            await this.AddTravelEntitiesToPreviewList(travelEntityPreviews, travelEntitiesQuery);
            await this.MapTravelEntitiesLikes(travelEntityPreviews, travelEntitiesQuery);

            if (userId > 0)
            {
                await this.MapUserLikes(travelEntityPreviews, travelEntitiesQuery, userId);
            }

            return travelEntityPreviews;
        }

        private async Task AddTravelEntitiesToPreviewList(List<TravelEntityPreviewDto> travelEntityPreviews, IQueryable<TravelEntity> travelEntitiesQuery)
        {
            var usersQuery = this.dbContext.Users;
            var results = await travelEntitiesQuery
                .Join(
                    usersQuery,
                    travelEntity => travelEntity.UserId,
                    user => user.Id,
                    (travelEntity, user) => new
                    {
                        User = user,
                        TravelEntity = travelEntity
                    })
                .ToListAsync();

            foreach (var result in results)
            {
                var travelEntityPreview =
                    this.mapper.Map<TravelEntityPreviewDto>(result.TravelEntity);

                travelEntityPreview.User
                    = await this.userService.GetUserPreviewDto(result.User);

                travelEntityPreviews.Add(travelEntityPreview);
            }
        }

        private async Task MapUserLikes(List<TravelEntityPreviewDto> travelEntityPreviews, IQueryable<TravelEntity> travelEntitiesQuery, int userId)
        {
            var userLikes = await this.dbContext.TravelEntityLikes
                    .Where(like =>
                        like.UserId == userId &&
                        travelEntitiesQuery.Any(
                            travelEntity => travelEntity.Id == like.TravelEntityId))
                    .ToListAsync();

            foreach (var travelEntityPreview in travelEntityPreviews)
            {
                if (userLikes.Any(x => x.TravelEntityId == travelEntityPreview.Id))
                {
                    travelEntityPreview.IsLiked = true;
                }
            }
        }

        private async Task MapTravelEntitiesLikes(List<TravelEntityPreviewDto> travelEntityPreviews, IQueryable<TravelEntity> travelEntitiesQuery)
        {
            var likesQuery = this.dbContext.TravelEntityLikes;
            var result = await travelEntitiesQuery
                .Select(travelEntity => 
                    likesQuery.Count(like => like.TravelEntityId == travelEntity.Id))
                .ToListAsync();

            for (int i = 0; i < travelEntityPreviews.Count; i++)
            {
                travelEntityPreviews[i].Likes = result[i];
            }
        }

        public async Task<Comment?> GetCommentAsync(int commentId)
        {
            var comment =
                await this.dbContext.Comments.SingleOrDefaultAsync(
                    x => x.Id == commentId);

            return comment;
        }

        public async Task<CommentDto> AddCommentAsync(CreateCommentDto createCommentDto, int userId)
        {
            var comment = new Comment
            {
                Content = createCommentDto.Content,
                TravelEntityId = createCommentDto.TravelEntityId,
                UserId = userId,
            };

            await this.dbContext.AddAsync(comment);
            await this.dbContext.SaveChangesAsync();

            return this.mapper.Map<CommentDto>(comment);

        }

        public async Task<IEnumerable<CommentDto>> GetCommentsByTravelEntityIdAsync(int travelEntityId)
        {
            var comments = await dbContext.Comments
                .Where(c => c.TravelEntityId == travelEntityId)
                .ToListAsync();

            var commentDtos = new List<CommentDto>();
            foreach (var comment in comments)
            {
                var user = await dbContext.Users.FindAsync(comment.UserId);
                var commentDto = mapper.Map<CommentDto>(comment);
                if(user != null)
                {
                commentDto.Username = user.Username;
                commentDto.Name = user.Name;
                if (user.ImageUrl != null) commentDto.ImageUrl = user.ImageUrl;
                }
                commentDtos.Add(commentDto);
            }

            return commentDtos;
        }

        public async Task DeleteCommentAsync(int commentId, int userId)
        {
            var comment = await dbContext.Comments
                .FirstOrDefaultAsync(c => c.Id == commentId);

            if (comment == null)
            {
                return;
            }

            dbContext.Comments.Remove(comment);
            await dbContext.SaveChangesAsync();
        }

        public async Task<CommentDto> UpdateCommentAsync(Comment comment, string updatedContent, int userId)
        {


            if (comment.UserId != userId)
            {
                throw new UnauthorizedAccessException("User is not authorized to update this comment.");
            }

            comment.Content = updatedContent;

            this.dbContext.Comments.Update(comment);
            await dbContext.SaveChangesAsync();

            return mapper.Map<CommentDto>(comment);
        }
    }
}
