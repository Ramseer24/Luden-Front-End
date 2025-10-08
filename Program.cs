using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

// Подключаем контекст и модели
using GameShopLuden.Data;

var builder = WebApplication.CreateBuilder(args);

// Добавляем DbContext с PostgreSQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "GameShopLuden API", Version = "v1" });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Эндпоинт для получения всех игр
app.MapGet("/games", async (AppDbContext db) =>
{
    var games = await db.Games.ToListAsync();
    return Results.Ok(games);
}).WithName("GetGames");

// Эндпоинт для добавления новой игры
app.MapPost("/games", async (Game game, AppDbContext db) =>
{
    db.Games.Add(game);
    await db.SaveChangesAsync();
    return Results.Created($"/games/{game.Id}", game);
}).WithName("AddGame");

// Твой старый пример weatherforecast оставим, если нужен
var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast(
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        )).ToArray();
    return forecast;
}).WithName("GetWeatherForecast");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}