namespace Travelist.Data.DTO.Users
{
    public class UserInfoDto
    {
        public required string Username { get; set; }
        public required string Name { get; set; }
        public string? ImageUrl { get; set; }
    }
}
