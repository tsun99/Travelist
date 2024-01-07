namespace Travelist.Data.DTO.Comments
{
    public class CreateCommentDto
    {
        public required string Content { get; set; }
        public int TravelEntityId { get; set; }

    }
}
