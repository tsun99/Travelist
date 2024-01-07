namespace Travelist.Services.Authentication
{
    public interface IPasswordHasher
    {
        public string HashPassword(string password);
    }
}
