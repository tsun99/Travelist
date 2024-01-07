namespace Travelist.Data.DTO.Comments
{
    public class CommentDto
    {
        public int Id { get; set; }
        public required string Content { get; set; }
        public required string Username { get; set; }
        public required string Name { get; set; }
        public string? ImageUrl { get; set; }
    }
}
