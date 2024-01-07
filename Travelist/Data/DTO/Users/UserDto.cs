namespace Travelist.Data.DTO.Users
{
    public class UserDto
    {
        public required string Email { get; set; }
        public required string Username { get; set; }
        public required string Name { get; set; }
        public string? ImageUrl { get; set; }
    }
}
