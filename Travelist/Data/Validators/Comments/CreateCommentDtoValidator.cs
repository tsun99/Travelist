using FluentValidation;
using Travelist.Data.DTO.Comments;

namespace Travelist.Data.Validators.Comments
{
    public class CreateCommentDtoValidator : AbstractValidator<CreateCommentDto>
    {
        public CreateCommentDtoValidator() 
        {
            RuleFor(c => c.Content)
            .NotEmpty().WithMessage("Content is required.")
            .Length(1, 300).WithMessage("Content must be between 1 and 300 characters.");

            RuleFor(c => c.TravelEntityId)
                .NotEmpty().WithMessage("TravelEntityId is required.");
        }
    }
}
