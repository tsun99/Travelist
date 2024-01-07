using AutoMapper;
using Travelist.Data.DTO.Comments;
using Travelist.Models;

namespace Travelist.Data.Mappings
{
    public class CommentProfile : Profile
    {
        public CommentProfile() 
        {
            CreateMap<Comment, CommentDto>();
            CreateMap<CreateCommentDto, Comment>();
            CreateMap<UpdateCommentDto, Comment>();
        }
    }
}
