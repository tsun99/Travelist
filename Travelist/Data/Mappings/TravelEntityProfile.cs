using AutoMapper;
using Travelist.Data.DTO.TravelEntities;
using Travelist.Models;

namespace Travelist.Data.Mappings
{
    public class TravelEntityProfile : Profile
    {
        public TravelEntityProfile()
        {
            CreateMap<TravelEntity, TravelEntityDto>();
            CreateMap<TravelEntity, TravelEntityPreviewDto>();

            CreateMap<CreateTravelEntityDto, TravelEntity>();
            CreateMap<UpdateTravelEntityDto, TravelEntity>();
        }
    }
}
