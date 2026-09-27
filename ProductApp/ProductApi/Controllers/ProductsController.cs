using Microsoft.AspNetCore.Mvc;
using ProductApi.Contracts;
using ProductApi.Repositories;
namespace ProductApi.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController(IProductRepository repository) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductResponse>>> GetAll() =>
        Ok((await repository.GetAllAsync()).Select(ProductResponse.From));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductResponse>> GetById(int id)
    {
        var product = await repository.GetByIdAsync(id);
        return product is null ? MissingProduct(id) : Ok(ProductResponse.From(product));
    }

    [HttpPost]
    public async Task<ActionResult<ProductResponse>> Create(ProductRequest request)
    {
        var product = await repository.CreateAsync(request.ToProduct());
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, ProductResponse.From(product));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ProductResponse>> Update(int id, ProductRequest request)
    {
        var product = await repository.UpdateAsync(id, request.ToProduct());
        return product is null ? MissingProduct(id) : Ok(ProductResponse.From(product));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id) =>
        await repository.DeleteAsync(id) ? NoContent() : MissingProduct(id);

    private ObjectResult MissingProduct(int id) => Problem(statusCode: 404,
        title: "Item não encontrado", detail: $"O item {id} não está mais no catálogo.");
}
