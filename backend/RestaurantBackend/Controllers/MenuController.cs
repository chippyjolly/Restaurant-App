using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using RestaurantBackend.Data;
using RestaurantBackend.Models;
using System.Security.Claims;
using MongoDB.Bson;

namespace RestaurantBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MenuController : ControllerBase
    {
        private readonly MongoContext _context;

        public MenuController(MongoContext context)
        {
            _context = context;
        }

        // ✅ GET accessible to both Customer and Partner
        [HttpGet("{restaurantId}")]
        [Authorize(Roles = $"{UserRoles.Customer},{UserRoles.Partner}")]

        public async Task<IActionResult> GetMenu(string restaurantId)
        {
            // Fetch restaurant details

            var restaurant = await _context.Restaurants
                .Find(r => r.Id == restaurantId)
                .FirstOrDefaultAsync();

            if (restaurant == null)
                return NotFound(new { message = "Restaurant not found" });

            // Combine restaurant info + menu items
            var response = new
            {
                RestaurantName = restaurant.Name,
                RestaurantId = restaurant.Id,
                MenuItems = restaurant.Menu
            };

            return Ok(response);
        }

        // ✅ POST restricted to Partner only
        [HttpPost]
        [Authorize(Roles = UserRoles.Partner)]
        public async Task<IActionResult> CreateMenuItem([FromBody] MenuItem menuItem)
        {
            Console.WriteLine($"CreateMenuItem called. MenuItem RestaurantId from body: {menuItem.RestaurantId}");

            string restaurantIdToUse = menuItem.RestaurantId;

            if (string.IsNullOrEmpty(restaurantIdToUse))
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not authenticated.");
                }

                var restaurant = await _context.Restaurants.Find(r => r.OwnerId == userId).FirstOrDefaultAsync();

                if (restaurant == null)
                {
                    return Unauthorized("No restaurant associated with this user.");
                }
                restaurantIdToUse = restaurant.Id;
            }
            else
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var restaurant = await _context.Restaurants
                    .Find(r => r.Id == restaurantIdToUse && r.OwnerId == userId)
                    .FirstOrDefaultAsync();
                if (restaurant == null)
                {
                    return Unauthorized("Provided restaurantId does not belong to the authenticated user.");
                }
            }

            if (string.IsNullOrEmpty(restaurantIdToUse))
            {
                return BadRequest("RestaurantId could not be determined.");
            }

            // Add menu item into restaurant’s embedded Menu array
            var update = Builders<Restaurant>.Update.Push(r => r.Menu, menuItem);
            var result = await _context.Restaurants.UpdateOneAsync(
                r => r.Id == restaurantIdToUse,
                update
            );

            if (result.ModifiedCount == 0)
            {
                return BadRequest("Failed to add menu item to restaurant.");
            }

            Console.WriteLine($"Menu item added to restaurant {restaurantIdToUse}: {menuItem.Name}");
            return Ok(menuItem);
        }

        [HttpPut("{menuId}")]
        [Authorize(Roles = UserRoles.Partner)]
        public async Task<IActionResult> UpdateMenuItem(string menuId, [FromBody] MenuItem menuItemIn)
        {
            // Find the restaurant that contains the menu item
            var restaurant = await _context.Restaurants
                .Find(r => r.Menu.Any(m => m.Id == menuId))
                .FirstOrDefaultAsync();

            if (restaurant == null)
                return NotFound("Restaurant not found for this menu item.");

            // ✅ Correct positional operator "$" syntax for updating embedded array
            var update = Builders<Restaurant>.Update
                .Set("Menu.$.Name", menuItemIn.Name)
                .Set("Menu.$.Description", menuItemIn.Description)
                .Set("Menu.$.Price", menuItemIn.Price)
                .Set("Menu.$.ImageUrl", menuItemIn.ImageUrl);

            var result = await _context.Restaurants.UpdateOneAsync(
                r => r.Id == restaurant.Id && r.Menu.Any(m => m.Id == menuId),
                update
            );

            if (result.ModifiedCount == 0)
                return NotFound("Menu item not updated. Please check the ID.");

            return NoContent();
        }

        // ✅ Individual menu item accessible to both roles
        [HttpGet("item/{menuId}")]
        [Authorize(Roles = $"{UserRoles.Customer},{UserRoles.Partner}")]
        public async Task<IActionResult> GetMenuItemById(string menuId)
        {
            var restaurant = await _context.Restaurants
                .Find(r => r.Menu.Any(m => m.Id == menuId))
                .FirstOrDefaultAsync();

            if (restaurant == null)
                return NotFound("Menu item not found.");

            var menuItem = restaurant.Menu.FirstOrDefault(m => m.Id == menuId);
            if (menuItem == null)
                return NotFound("Menu item not found inside the restaurant.");

            return Ok(menuItem);
        }


        // DELETE menu item
        [HttpDelete("{menuId}")]
        [Authorize(Roles = UserRoles.Partner)]
        public async Task<IActionResult> DeleteMenuItem(string menuId)
        {
            // Find restaurant containing the menu item
            var restaurant = await _context.Restaurants
                .Find(r => r.Menu.Any(m => m.Id == menuId))
                .FirstOrDefaultAsync();

            if (restaurant == null)
                return NotFound("Menu item not found in any restaurant.");

            // Remove the menu item from embedded array
            var update = Builders<Restaurant>.Update.PullFilter(
                r => r.Menu,
                m => m.Id == menuId
            );

            var result = await _context.Restaurants.UpdateOneAsync(
                r => r.Id == restaurant.Id,
                update
            );

            if (result.ModifiedCount == 0)
                return BadRequest("Failed to delete menu item.");

            return Ok(new { message = "Menu item deleted successfully" });
        }

    }


}
