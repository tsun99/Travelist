using System.ComponentModel.DataAnnotations;
using Travelist.Data.DTO.Users;
using Travelist.Models;

namespace Travelist.Data.DTO.TravelEntities
{
    public class TravelEntityDto
    {
        public int Id { get; set; }
        public UserPreviewDto? User { get; set; }
        public string? Title { get; set; }
        public string? City { get; set; }
        public string? Text { get; set; }
        public string? ImageUrl { get; set; }
        public int Likes { get; set; }
        public bool IsLiked { get; set; }
        public Location? Location { get; set; }
        public required List<string> ItemsToPack { get; set; }
    }
}
