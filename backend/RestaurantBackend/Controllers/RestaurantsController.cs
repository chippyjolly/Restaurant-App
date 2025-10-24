using MongoDB.Driver;
using Microsoft.AspNetCore.Mvc;
using RestaurantBackend.Data;
using RestaurantBackend.Models;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using System.Security.Claims;


namespace RestaurantBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RestaurantsController : ControllerBase
    {
        private readonly MongoContext _context;

        public RestaurantsController(MongoContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (userRole == UserRoles.RestaurantOwner)
            {
                var restaurants = await _context.Restaurants.Find(r => r.OwnerId == userId).ToListAsync();
                return Ok(restaurants);
            }
            else if (userRole == UserRoles.Customer || userRole == UserRoles.Admin)
            {
                var restaurants = await _context.Restaurants.Find(_ => true).ToListAsync();
                return Ok(restaurants);
            }
            else
            {
                return Forbid();
            }
        }

        [HttpPost]
        [Authorize(Roles = UserRoles.RestaurantOwner)]
        public IActionResult Create(Restaurant restaurant)
        {
            var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (ownerId == null)
                return Unauthorized();

            restaurant.OwnerId = ownerId;

            _context.Restaurants.InsertOne(restaurant);
            return CreatedAtAction(nameof(GetAll), new { id = restaurant.Id }, restaurant);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = UserRoles.RestaurantOwner)]
        public async Task<IActionResult> UpdateRestaurant(string id, [FromBody] Restaurant UpdatedRestaurant)
        {
            if (UpdatedRestaurant == null || string.IsNullOrEmpty(UpdatedRestaurant.Name))
                return BadRequest(new { message = "Restaurant name is required" });

            var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var restaurant = await _context.Restaurants.Find(r => r.Id == id).FirstOrDefaultAsync();

            if (restaurant == null)
                return NotFound(new { message = "Restaurant not found" });

            if (restaurant.OwnerId != ownerId)
                return Forbid();


            UpdatedRestaurant.Id = restaurant.Id;
            UpdatedRestaurant.OwnerId = ownerId;

            await _context.Restaurants.ReplaceOneAsync(r => r.Id == id, UpdatedRestaurant);
            return Ok(UpdatedRestaurant);

        }

        [HttpDelete("{id}")]
        [Authorize(Roles = $"{UserRoles.RestaurantOwner},{UserRoles.Admin}")]

        public async Task<IActionResult> DeleteRestaurant(string id)
        {

            var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var restaurant = await _context.Restaurants.Find(r => r.Id == id).FirstOrDefaultAsync();

            if (restaurant == null)
                return NotFound(new { message = "Restaurant not found" });

            if (!User.IsInRole(UserRoles.Admin) && restaurant.OwnerId != ownerId)
                return Forbid();



            var result = await _context.Restaurants.DeleteOneAsync(r => r.Id == id);

            if (result.DeletedCount == 0)
                return NotFound(new { message = "Restaurant not found" });




            return NoContent();

        }

    }
}