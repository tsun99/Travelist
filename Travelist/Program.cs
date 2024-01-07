using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using System.Text;
using Travelist.Data;
using Travelist.Options;
using Travelist.Services.Authentication;
using Travelist.Services.TravelEntities;
using Travelist.Services.Users;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        Description = "Standard Authorization header using the Bearer scheme (\"bearer {token}\")",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
    });

    options.OperationFilter<SecurityRequirementsOperationFilter>();
});

var authenticationSettings = builder.Configuration
    .GetSection("AppSettings:Authentication")
    .Get<AuthenticationSettings>()!;

builder.Services.AddSingleton(authenticationSettings);

// Configure AppDbContext.
builder.Services.AddDbContext<AppDbContext>(
    options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddValidatorsFromAssemblyContaining(typeof(Program));

builder.Services.AddScoped<AuthenticationService>();
builder.Services.AddScoped<IAuthenticationService>(
    provider => provider.GetRequiredService<AuthenticationService>());
builder.Services.AddScoped<IPasswordHasher>(
    provider => provider.GetRequiredService<AuthenticationService>());

builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<IUserService>(
    provider => provider.GetRequiredService<UserService>());
builder.Services.AddScoped<IPublicUserService>(
    provider => provider.GetRequiredService<UserService>());

builder.Services.AddScoped<ITravelEntityService, TravelEntityService>();

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = authenticationSettings.SecurityKey,
            ValidateIssuer = false,
            ValidateAudience = false,
        });


builder.Services.AddCors(options =>
{
    options.AddPolicy("MyAllowSpecificOrigins",
        builder => builder.WithOrigins("https://localhost:44405")
            .AllowAnyHeader()
            .AllowAnyMethod());
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}
else
{
    app.UseSwagger();
    app.UseSwaggerUI();

    var serviceProvider = app.Services.CreateScope().ServiceProvider;
    AppDbContext.EnsureMigrated(serviceProvider.GetRequiredService<AppDbContext>());
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseCors("MyAllowSpecificOrigins");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("index.html");

app.Run();
