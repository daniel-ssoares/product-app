using System.ComponentModel.DataAnnotations;
namespace ProductApi.Contracts;

public sealed class ProductRequest
{
    [Required(ErrorMessage = "Informe o nome do item.")]
    [StringLength(200, ErrorMessage = "O nome deve ter até 200 caracteres.")]
    public string Name { get; set; } = string.Empty;
    [Required(ErrorMessage = "Informe uma descrição.")]
    [StringLength(500, ErrorMessage = "A descrição deve ter até 500 caracteres.")]
    public string Description { get; set; } = string.Empty;
    [Required(ErrorMessage = "Escolha uma categoria.")]
    [RegularExpression("^(Computação|Periféricos|Escritório)$", ErrorMessage = "Escolha uma categoria válida.")]
    public string Category { get; set; } = string.Empty;
    [Required(ErrorMessage = "Informe o preço.")]
    [Range(typeof(decimal), "0.01", "999999999.99", ErrorMessage = "O preço deve estar entre R$ 0,01 e R$ 999.999.999,99.")]
    public decimal? Price { get; set; }
    [Required(ErrorMessage = "Informe a quantidade em estoque.")]
    [Range(0, int.MaxValue, ErrorMessage = "O estoque deve ser um inteiro não negativo.")]
    public int? Stock { get; set; }
    public Product ToProduct() => new()
    {
        Name = Name.Trim(), Description = Description.Trim(), Category = Category,
        Price = Price!.Value, Stock = Stock!.Value
    };
}
