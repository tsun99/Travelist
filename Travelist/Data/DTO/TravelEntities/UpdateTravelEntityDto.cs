using System.ComponentModel.DataAnnotations;
using Travelist.Models;

namespace Travelist.Data.DTO.TravelEntities
{
    public class UpdateTravelEntityDto
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? City { get; set; }
        public string? Text { get; set; }
        public string? ImageUrl { get; set; }
        public Location? Location { get; set; }
        public required List<string> ItemsToPack { get; set; }
    }
}
