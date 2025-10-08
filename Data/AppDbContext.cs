using Microsoft.EntityFrameworkCore;

namespace GameShopLuden.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Game> Games { get; set; }
    }

    public class Game
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public double Price { get; set; }
    }
}