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
    public class WishlistController : ControllerBase
    {
        private readonly MongoContext _context;

        public WishlistController(MongoContext context)
        {
            _context = context;
        }

        // ✅ Get wishlist by customerId
        [HttpGet("{customerId}")]
        public async Task<IActionResult> GetWishlist(string customerId)
        {
            var wishlist = await _context.Wishlists
                .Find(w => w.CustomerId == customerId)
                .FirstOrDefaultAsync();

            if (wishlist == null)
            {
                wishlist = new Wishlist { CustomerId = customerId, Items = new() };
                await _context.Wishlists.InsertOneAsync(wishlist);
            }

            return Ok(wishlist);
        }

        // ✅ Add item to wishlist
        [HttpPost("{customerId}/add")]
        public async Task<IActionResult> AddToWishlist(string customerId, [FromBody] WishlistItem item)
        {
            var wishlist = await _context.Wishlists.Find(w => w.CustomerId == customerId).FirstOrDefaultAsync();

            if (wishlist == null)
            {
                wishlist = new Wishlist { CustomerId = customerId, Items = new() };
                await _context.Wishlists.InsertOneAsync(wishlist);
            }

            if (!wishlist.Items.Any(i => i.MenuItemId == item.MenuItemId))
            {
                wishlist.Items.Add(item);
                await _context.Wishlists.ReplaceOneAsync(w => w.CustomerId == customerId, wishlist);
            }

            return Ok(wishlist);
        }

        // ✅ Remove item
        [HttpDelete("{customerId}/item/{menuItemId}")]
        public async Task<IActionResult> RemoveItem(string customerId, string menuItemId)
        {
            var wishlist = await _context.Wishlists.Find(w => w.CustomerId == customerId).FirstOrDefaultAsync();
            if (wishlist == null) return NotFound();

            wishlist.Items = wishlist.Items.Where(i => i.MenuItemId != menuItemId).ToList();
            await _context.Wishlists.ReplaceOneAsync(w => w.CustomerId == customerId, wishlist);

            return Ok(wishlist);
        }

        // ✅ Clear wishlist
        [HttpDelete("{customerId}/clear")]
        public async Task<IActionResult> ClearWishlist(string customerId)
        {
            var wishlist = await _context.Wishlists.Find(w => w.CustomerId == customerId).FirstOrDefaultAsync();
            if (wishlist == null) return NotFound();

            wishlist.Items.Clear();
            await _context.Wishlists.ReplaceOneAsync(w => w.CustomerId == customerId, wishlist);

            return Ok(wishlist);
        }
    }
}
