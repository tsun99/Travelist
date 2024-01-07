using FluentValidation;

namespace Travelist.Data.Validators.Extensions
{
    public static class TravelEntityValidationExtensions
    {
        public static IRuleBuilderOptions<T, List<string>> ItemsToPackList<T>(this IRuleBuilder<T, List<string>> ruleBuilder)
        {
            return ruleBuilder
                .Must(x => x.Count <= 100).WithMessage("Items to pack list cannot contain more than 100 items.");
        }

        public static IRuleBuilderOptions<T, string> ItemToPack<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            return ruleBuilder
                .NotEmpty()
                .MaximumLength(250)
                .Must(x => !x.Contains('\n')).WithMessage("Item to pack cannot contain new line character.");
        }
    }
}
