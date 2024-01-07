using System.ComponentModel.DataAnnotations;

namespace Travelist.Models
{
    public class User
    {
        public int Id { get; set; }

        public required string Email { get; set; }

        [MaxLength(50)]
        public required string Name { get; set; }

        public required string PasswordHash { get; set; }
        public required string Username { get; set; }

        public string? ImageUrl { get; set; }
    }
}
