using Chirp.Application.Behaviors;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
namespace Chirp.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {

        services.AddMediatR(cf =>
        {
            cf.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
            cf.AddOpenBehavior(typeof(ValidationBehavior<,>));
        });


        services.AddAutoMapper(Assembly.GetExecutingAssembly());

        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        return services;
    }
}