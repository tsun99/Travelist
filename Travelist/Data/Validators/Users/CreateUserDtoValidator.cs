using FluentValidation;
using Travelist.Data.DTO.Users;
using Travelist.Data.Validators.Extensions;

namespace Travelist.Data.Validators.Users
{
    public class CreateUserDtoValidator : AbstractValidator<CreateUserDto>
    {
        public CreateUserDtoValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty()
                .EmailAddress();

            RuleFor(x => x.Password)
                .UserPassword();

            RuleFor(x => x.Name)
                .UserName();
        }
    }
}
