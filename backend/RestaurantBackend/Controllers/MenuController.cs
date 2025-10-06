using Microsoft.AspNetCore.Mvc;
using RestaurantBackend.Models;
using RestaurantBackend.Data;
using MongoDB.Driver;

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

        [HttpGet("restaurants/{restaurantId}")]
        public IActionResult GetMenuByRestaurant(string restaurantId)
        {
            var restaurant = _context.Restaurants.Find(r => r.Id == restaurantId).FirstOrDefault();
            if (restaurant == null) return NotFound();
            return Ok(restaurant.Menu);
        }

        [HttpGet("{menuItemId}")]
        public IActionResult GetMenuItem(string menuItemId)
        {
            var restaurant = _context.Restaurants.Find(r => r.Menu.Any(m => m.Id == menuItemId)).FirstOrDefault();
            if (restaurant == null) return NotFound();

            var item = restaurant.Menu.First(m => m.Id == menuItemId);
            return Ok(item);
        }


        [HttpPost("{restaurantId}")]
        public async Task<IActionResult> AddMenuItem(string restaurantId, [FromBody] MenuItem newItem)
        {
            var restaurantFilter = Builders<Restaurant>.Filter.Eq(r => r.Id, restaurantId);
            var restaurantExists = await _context.Restaurants.Find(restaurantFilter).AnyAsync();
            if (!restaurantExists)
                return NotFound($"Restaurant with Id '{restaurantId}' not found.");

            newItem.restaurantId = restaurantId;


            await _context.MenuItems.InsertOneAsync(newItem);

            var update = Builders<Restaurant>.Update.Push(r => r.Menu, newItem);
            await _context.Restaurants.UpdateOneAsync(restaurantFilter, update);

            return CreatedAtAction("GetMenuItem", new { menuItemId = newItem.Id }, newItem);
        }

        [HttpPut("{menuItemId}")]
        public IActionResult UpdateMenuItem(string menuItemId, [FromBody] MenuItem updatedItem)
        {
            var restaurant = _context.Restaurants.Find(r => r.Menu.Any(m => m.Id == menuItemId)).FirstOrDefault();
            if (restaurant == null) return NotFound("Menu item not found.");

            var index = restaurant.Menu.FindIndex(m => m.Id == menuItemId);
            updatedItem.Id = menuItemId;
            restaurant.Menu[index] = updatedItem;

            _context.Restaurants.ReplaceOne(r => r.Id == restaurant.Id, restaurant);
            return Ok(updatedItem);
        }

        [HttpDelete("{menuItemId}")]
        public IActionResult DeleteMenuItem(string menuItemId)
        {
            var restaurant = _context.Restaurants.Find(r => r.Menu.Any(m => m.Id == menuItemId)).FirstOrDefault();
            if (restaurant == null) return NotFound("Menu item not found.");

            restaurant.Menu.RemoveAll(m => m.Id == menuItemId);
            _context.Restaurants.ReplaceOne(r => r.Id == restaurant.Id, restaurant);

            return Ok("Menu item deleted successfully.");
        }
    }
}