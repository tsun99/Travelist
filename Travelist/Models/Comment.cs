namespace Travelist.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public required string Content { get; set; }
        public int TravelEntityId { get; set; }
        public int UserId { get; set; }
    }
}
