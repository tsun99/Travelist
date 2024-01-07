using FluentValidation;
using Travelist.Data.DTO.Users;
using Travelist.Data.Validators.Extensions;

namespace Travelist.Data.Validators.Users
{
    public class UpdateUserPasswordDtoValidator : AbstractValidator<UpdateUserPasswordDto>
    {
        public UpdateUserPasswordDtoValidator()
        {
            RuleFor(x => x.NewPassword)
                .UserPassword()
                .NotEqual(x => x.OldPassword).WithMessage(x => $"'{nameof(x.NewPassword)}' should not be equal to '{nameof(x.OldPassword)}'");
        }
    }
}
