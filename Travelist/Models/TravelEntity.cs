using System.ComponentModel.DataAnnotations;

namespace Travelist.Models
{
    public class TravelEntity
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        [MaxLength(50)]
        public string? Title { get; set; }

        [MaxLength(50)]
        public string? City { get; set; }

        [MaxLength(250)]
        public string? Text { get; set; }
        
        public string? ImageUrl { get; set; }

        public Location? Location { get; set; }

        public required List<string> ItemsToPack { get; set; } = new();
    }
}
