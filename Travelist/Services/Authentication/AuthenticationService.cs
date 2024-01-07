using Travelist.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Travelist.Options;

namespace Travelist.Services.Authentication
{
    public class AuthenticationService : IAuthenticationService, IPasswordHasher
    {
        private readonly AuthenticationSettings settings;

        public AuthenticationService(AuthenticationSettings settings)
        {
            this.settings = settings;
        }

        public string GetLoginToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Email),
            };

            var expires = DateTime.Now.AddHours(this.settings.TokenExpirationHours);

            var creds = new SigningCredentials(
                this.settings.SecurityKey,
                SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: expires,
                signingCredentials: creds);

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }

        public string HashPassword(string password)
        {
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);
            return passwordHash;
        }

        public bool VerifyPassword(string password, string passwordHash)
        {
            var isPasswordValid = BCrypt.Net.BCrypt.Verify(password, passwordHash);
            return isPasswordValid;
        }
    }
}
