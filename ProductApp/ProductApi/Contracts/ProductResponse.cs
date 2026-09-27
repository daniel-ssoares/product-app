namespace ProductApi.Contracts;
public sealed record ProductResponse(int Id, string Name, string Description, string Category,
    decimal Price, int Stock, DateTime CreatedAt)
{
    public static ProductResponse From(Product p) => new(p.Id, p.Name, p.Description,
        p.Category, p.Price, p.Stock, p.CreatedAt);
}
