using Travelist.Models;

namespace Travelist.Services.Authentication
{
    public interface IAuthenticationService
    {
        public string GetLoginToken(User user);
        public bool VerifyPassword(string password, string passwordHash);
    }
}
