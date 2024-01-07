using FluentValidation;

namespace Travelist.Data.Validators.Extensions
{
    public static class UserValidationExtensions
    {
        public static IRuleBuilderOptions<T, string> UserPassword<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            return ruleBuilder
                .NotEmpty()
                .Length(8, 16).WithMessage("Password length must be from 8 to 16 symbols")
                .Matches(@"[A-Z]+").WithMessage("Password must contain at least one uppercase letter.")
                .Matches(@"[a-z]+").WithMessage("Password must contain at least one lowercase letter.")
                .Matches(@"[0-9]+").WithMessage("Password must contain at least one number.")
                .Matches(@"[\!\?\*\.\$]+").WithMessage("Password must contain at least one of [!?*.$].");
        }

        public static IRuleBuilderOptions<T, string> UserName<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            return ruleBuilder
                .NotEmpty()
                .Length(3, 50);
        }

    }
}
