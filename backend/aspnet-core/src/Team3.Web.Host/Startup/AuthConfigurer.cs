using Abp.Runtime.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Team3.Web.Host.Startup
{
    public static class AuthConfigurer
    {
        public static void Configure(IServiceCollection services, IConfiguration configuration)
        {
            if (bool.Parse(configuration["Authentication:JwtBearer:IsEnabled"]))
            {
                services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = "JwtBearer";
                    options.DefaultChallengeScheme = "JwtBearer";
                }).AddJwtBearer("JwtBearer", options =>
                {
                    options.Audience = configuration["Authentication:JwtBearer:Audience"];

                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        // The signing key must match!
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(configuration["Authentication:JwtBearer:SecurityKey"])),

                        // Validate the JWT Issuer (iss) claim
                        ValidateIssuer = true,
                        ValidIssuer = configuration["Authentication:JwtBearer:Issuer"],

                        // Validate the JWT Audience (aud) claim
                        ValidateAudience = true,
                        ValidAudience = configuration["Authentication:JwtBearer:Audience"],

                        // Validate the token expiry
                        ValidateLifetime = true,

                        // If you want to allow a certain amount of clock drift, set that here
                        ClockSkew = TimeSpan.Zero
                    };

                    options.Events = new JwtBearerEvents
                    {
                            OnMessageReceived = CookieOrQueryStringTokenResolver
                    };
                });
            }
        }

        /* Resolves the bearer token from:
         *   1. An encrypted query-string parameter for SignalR clients (which cannot send headers).
         *   2. An HttpOnly cookie named "access_token" for all other API requests. */
        private static Task CookieOrQueryStringTokenResolver(MessageReceivedContext context)
        {
            if (!context.HttpContext.Request.Path.HasValue)
            {
                return Task.CompletedTask;
            }

            // SignalR clients send the token as an encrypted query-string value.
            if (context.HttpContext.Request.Path.Value.StartsWith("/signalr"))
            {
                var qsAuthToken = context.HttpContext.Request.Query["enc_auth_token"].FirstOrDefault();
                if (qsAuthToken != null)
                {
                    context.Token = SimpleStringCipher.Instance.Decrypt(qsAuthToken);
                }
                return Task.CompletedTask;
            }

            // All other requests: read the JWT from the HttpOnly cookie set by Authenticate.
            if (context.HttpContext.Request.Cookies.TryGetValue("access_token", out var cookieToken))
            {
                context.Token = cookieToken;
            }

            return Task.CompletedTask;
        }
    }
}
