using Microsoft.EntityFrameworkCore;
namespace ProductApi.Data;
public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var entity = modelBuilder.Entity<Product>();
        entity.HasKey(p => p.Id);
        entity.Property(p => p.Name).IsRequired().HasMaxLength(200);
        entity.Property(p => p.Description).IsRequired().HasMaxLength(500);
        entity.Property(p => p.Category).IsRequired().HasMaxLength(30);
        entity.Property(p => p.Price).HasPrecision(18, 2);
        var created = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        entity.HasData(
            new Product { Id = 1, Name = "Notebook Pro 14", Description = "16 GB de RAM, SSD de 512 GB e tela de 14 polegadas. Seu escritório vai com você.", Category = "Computação", Price = 4290m, Stock = 8, CreatedAt = created },
            new Product { Id = 2, Name = "Monitor IPS 27", Description = "Resolução QHD e ajuste de altura para trabalhar com mais espaço e conforto.", Category = "Computação", Price = 1590m, Stock = 12, CreatedAt = created },
            new Product { Id = 3, Name = "Teclado mecânico compacto", Description = "Layout ABNT2, conexão USB-C e switches silenciosos.", Category = "Periféricos", Price = 349.90m, Stock = 4, CreatedAt = created },
            new Product { Id = 4, Name = "Mouse ergonômico sem fio", Description = "Pegada vertical, bateria recarregável e conexão Bluetooth.", Category = "Periféricos", Price = 189.90m, Stock = 18, CreatedAt = created },
            new Product { Id = 5, Name = "Cadeira de escritório", Description = "Apoio lombar, braços ajustáveis e encosto em tela respirável.", Category = "Escritório", Price = 899m, Stock = 3, CreatedAt = created },
            new Product { Id = 6, Name = "Organizador de mesa", Description = "Compartimentos para canetas, cadernos e pequenos acessórios.", Category = "Escritório", Price = 79.90m, Stock = 24, CreatedAt = created },
            new Product { Id = 7, Name = "Hub USB-C 6 em 1", Description = "HDMI, leitor de cartões, USB e carregamento em um único adaptador.", Category = "Periféricos", Price = 229m, Stock = 0, CreatedAt = created },
            new Product { Id = 8, Name = "Luminária de mesa LED", Description = "Intensidade regulável e três temperaturas de cor para sua rotina.", Category = "Escritório", Price = 149.90m, Stock = 10, CreatedAt = created }
        );
    }
}
