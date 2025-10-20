using Microsoft.AspNetCore.Mvc;
using RestaurantBackend.Models;
using RestaurantBackend.Data;
using MongoDB.Driver;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Threading.Tasks;


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
        [Authorize(Roles = UserRoles.RestaurantOwner)]
        public async Task<IActionResult> AddMenuItem(string restaurantId, [FromBody] MenuItem newItem)
        {
            var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var restaurant = await _context.Restaurants.Find(r => r.Id == restaurantId).FirstOrDefaultAsync();

            if (restaurant == null)
                return NotFound($"Restaurant with Id '{restaurantId}' not found.");

            if (restaurant.OwnerId != ownerId)
                return Forbid();



            // var restaurantFilter = Builders<Restaurant>.Filter.Eq(r => r.Id, restaurantId);
            // var restaurantExists = await _context.Restaurants.Find(restaurantFilter).AnyAsync();
            // if (!restaurantExists)
            //     return NotFound($"Restaurant with Id '{restaurantId}' not found.");

            newItem.restaurantId = restaurantId;


            await _context.MenuItems.InsertOneAsync(newItem);

            var update = Builders<Restaurant>.Update.Push(r => r.Menu, newItem);
            await _context.Restaurants.UpdateOneAsync(r => r.Id == restaurantId, update);
            return CreatedAtAction("GetMenuItem", new { menuItemId = newItem.Id }, newItem);
        }

        [HttpPut("{menuItemId}")]
        [Authorize(Roles = UserRoles.RestaurantOwner)]
        public async Task<IActionResult> UpdateMenuItem(string menuItemId, [FromBody] MenuItem updatedItem)
        {
            var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var restaurantFilter = Builders<Restaurant>.Filter.ElemMatch(r => r.Menu, m => m.Id == menuItemId);
            var restaurant = await _context.Restaurants.Find(restaurantFilter).FirstOrDefaultAsync();
            if (restaurant == null) return NotFound("Menu item not found.");

            if (restaurant.OwnerId != ownerId)
                return Forbid();

            var existingMenuItem = await _context.MenuItems.Find(mi => mi.Id == menuItemId).FirstOrDefaultAsync();

            if (existingMenuItem == null)
                return NotFound("Menu item not found in MenuItems collection.");

            updatedItem.Id = existingMenuItem.Id;
            updatedItem.restaurantId = restaurant.Id;
            await _context.MenuItems.ReplaceOneAsync(mi => mi.Id == menuItemId, updatedItem);

            var update = Builders<Restaurant>.Update.Set("Menu.$", updatedItem);
            await _context.Restaurants.UpdateOneAsync(restaurantFilter, update);
            return Ok(updatedItem);
        }

        [HttpDelete("{menuItemId}")]
        [Authorize(Roles = UserRoles.RestaurantOwner)]
        public async Task<IActionResult> DeleteMenuItem(string restaurantId, string menuItemId)
        {
            var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var restaurant = await _context.Restaurants.Find(r => r.Id == restaurantId).FirstOrDefaultAsync();

            if (restaurant == null || restaurant.Menu.All(m => m.Id != menuItemId))
                return NotFound("Menu item not found in the specified restaurant.");

            if (restaurant.OwnerId != ownerId)
                return Forbid();

            using (var session = await _context.Client.StartSessionAsync())
            {
                session.StartTransaction();
                try
                {
                    var update = Builders<Restaurant>.Update.PullFilter(r => r.Menu, m => m.Id == menuItemId);
                    await _context.Restaurants.UpdateOneAsync(session, r => r.Id == restaurantId, update);

                    var menuItemFilter = Builders<MenuItem>.Filter.Eq(mi => mi.Id, menuItemId);
                    await _context.MenuItems.DeleteOneAsync(session, menuItemFilter);
                    await session.CommitTransactionAsync();
                }
                catch (Exception)
                {
                    await session.AbortTransactionAsync();
                    throw;
                }
            }
            return Ok("Mneu item deleted successfully from all collections.");
            
        }
    }
}