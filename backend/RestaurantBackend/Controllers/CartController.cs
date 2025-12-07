using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using RestaurantBackend.Data;
using RestaurantBackend.Models;
using System.Threading.Tasks;
using System.Linq;

namespace RestaurantBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly MongoContext _context;

        public CartController(MongoContext context)
        {
            _context = context;
        }

        // ✅ Add or update an item in the cart
        [HttpPost("add")]
        public async Task<IActionResult> AddToCart([FromBody] CartItemRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.CustomerId))
                return BadRequest("Invalid cart data.");

            var cart = await _context.Carts
                .Find(c => c.CustomerId == request.CustomerId)
                .FirstOrDefaultAsync();

            if (cart == null)
            {
                cart = new Cart
                {
                    CustomerId = request.CustomerId,
                    Items = new List<CartItem>()
                };
            }

            var existingItem = cart.Items.FirstOrDefault(i => i.MenuItemId == request.MenuItemId);
            if (existingItem != null)
            {
                existingItem.Quantity += request.Quantity;
            }
            else
            {
                cart.Items.Add(new CartItem
                {
                    MenuItemId = request.MenuItemId,
                    Name = request.Name,
                    Quantity = request.Quantity,
                    Price = request.Price
                });
            }

            cart.TotalAmount = cart.Items.Sum(i => i.Price * i.Quantity);

            var filter = Builders<Cart>.Filter.Eq(c => c.CustomerId, request.CustomerId);
            await _context.Carts.ReplaceOneAsync(filter, cart, new ReplaceOptions { IsUpsert = true });

            return Ok(cart);
        }

        // ✅ Get cart by customer ID
        [HttpGet("{customerId}")]
        public async Task<IActionResult> GetCart(string customerId)
        {
            var cart = await _context.Carts.Find(c => c.CustomerId == customerId).FirstOrDefaultAsync();
            if (cart == null)
                return NotFound("Cart not found.");

            return Ok(cart);
        }

        // ✅ Remove one item
        [HttpDelete("{customerId}/item/{menuItemId}")]
        public async Task<IActionResult> RemoveItem(string customerId, string menuItemId)
        {
            var cart = await _context.Carts.Find(c => c.CustomerId == customerId).FirstOrDefaultAsync();
            if (cart == null)
                return NotFound("Cart not found.");

            cart.Items = cart.Items.Where(i => i.MenuItemId != menuItemId).ToList();
            cart.TotalAmount = cart.Items.Sum(i => i.Price * i.Quantity);

            await _context.Carts.ReplaceOneAsync(c => c.CustomerId == customerId, cart);

            return Ok(cart);
        }

        // ✅ Clear all items
        [HttpDelete("{customerId}/clear")]
        public async Task<IActionResult> ClearCart(string customerId)
        {
            var cart = await _context.Carts.Find(c => c.CustomerId == customerId).FirstOrDefaultAsync();
            if (cart == null)
                return NotFound("Cart not found.");

            cart.Items.Clear();
            cart.TotalAmount = 0;
            await _context.Carts.ReplaceOneAsync(c => c.CustomerId == customerId, cart);

            return Ok(cart);
        }
    }

    public class CartItemRequest
    {
        public string CustomerId { get; set; }
        public string MenuItemId { get; set; }
        public string Name { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}
