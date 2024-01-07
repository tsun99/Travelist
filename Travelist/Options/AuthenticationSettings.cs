using Microsoft.IdentityModel.Tokens;
using System.Diagnostics.CodeAnalysis;
using System.Runtime.Serialization;
using System.Text;

namespace Travelist.Options
{
    public class AuthenticationSettings
    {
        private string token;

        public required string Token
        {
            get => token;

            [MemberNotNull(nameof(token), nameof(SecurityKey))]
            set
            {
                this.token = value;
                this.SecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(value));
            }
        }

        public double TokenExpirationHours { get; set; }

        public SymmetricSecurityKey SecurityKey { get; private set; }
    }
}
