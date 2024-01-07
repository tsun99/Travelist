using FluentValidation;
using Travelist.Data.DTO.Users;
using Travelist.Data.Validators.Extensions;

namespace Travelist.Data.Validators.Users
{
    public class UpdateUserDtoValidator : AbstractValidator<UpdateUserDto>
    {
        public UpdateUserDtoValidator()
        {
            RuleFor(x => x.Name)
                .UserName();
        }
    }
}
