using AutoMapper;
using Travelist.Data.DTO.Users;
using Travelist.Models;

namespace Travelist.Data.Mappings
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<User, UserDto>();
            CreateMap<User, UserInfoDto>();
            CreateMap<User, UserPreviewDto>();

            CreateMap<CreateUserDto, User>();
            CreateMap<UpdateUserDto, User>();
        }
    }
}
