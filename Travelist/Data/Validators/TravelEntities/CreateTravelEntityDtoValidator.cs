using FluentValidation;
using Travelist.Data.DTO.TravelEntities;
using Travelist.Data.Validators.Extensions;

namespace Travelist.Data.Validators.TravelEntities
{
    public class CreateTravelEntityDtoValidator : AbstractValidator<CreateTravelEntityDto>
    {
        public CreateTravelEntityDtoValidator()
        {
            RuleFor(x => x.Title)
                .MaximumLength(50);

            RuleFor(x => x.City)
                .MaximumLength(50);

            RuleFor(x => x.Text)
                .MaximumLength(250);

            RuleFor(x => x.ItemsToPack)
                .ItemsToPackList();

            RuleForEach(x => x.ItemsToPack)
                .ItemToPack();
        }
    }
}
