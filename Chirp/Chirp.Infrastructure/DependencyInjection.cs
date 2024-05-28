using Chirp.Application.Common;
using Chirp.Application.Common.Interfaces;
using Chirp.Infrastructure.Extensions;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace Chirp.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {

            FirebaseApp.Create(new AppOptions()
            {
                Credential = GoogleCredential.FromFile("C:\\Users\\srvth\\OneDrive\\Desktop\\firebase\\chirps-a4ee9-firebase-adminsdk-ulgw4-fbe4f57fd9.json")
            });

            services.AddHostedService<KafkaConsumerService>();
            services.AddScoped<IAppDbContext>(provider => provider.GetRequiredService<AppDbContext>());
            services.AddScoped<IFirebaseService, FirebaseService>();
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"));
            });

            // firebase auth
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(opt =>
                {
                    opt.Authority = configuration.GetValue<string>("JWT_FIREBASE_VALIDISSUER");
                    opt.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = configuration.GetValue<string>("JWT_FIREBASE_VALIDISSUER"),
                        ValidAudience = configuration.GetValue<string>("JWT_FIREBASE_VALIDAUDIENCE"),
                    };
                });

            services.AddElasticsearch(configuration);
            return services;
        }
    }
}
