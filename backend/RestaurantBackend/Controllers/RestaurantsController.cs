using MongoDB.Driver;
using Microsoft.AspNetCore.Mvc;
using RestaurantBackend.Data;
using RestaurantBackend.Models;

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
        public IActionResult GetAll()
        {
            var restaurants = _context.Restaurants.Find(r => true).ToList();
            return Ok(restaurants);
        }

        [HttpPost]
        public IActionResult Create(Restaurant restaurant)
        {
            _context.Restaurants.InsertOne(restaurant);
            return CreatedAtAction(nameof(GetAll), new { id = restaurant.Id }, restaurant);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRestaurant(string id, [FromBody] Restaurant UpdatedRestaurant)
        {
            if (UpdatedRestaurant == null || string.IsNullOrEmpty(UpdatedRestaurant.Name))
                return BadRequest(new { message = "Restaurant name is required" });


            var restaurant = await _context.Restaurants.Find(r => r.Id == id).FirstOrDefaultAsync();

            if (restaurant == null)
                return NotFound(new { message = "Restaurant not found" });


            UpdatedRestaurant.Id = restaurant.Id;
            await _context.Restaurants.ReplaceOneAsync(r => r.Id == id, UpdatedRestaurant);
            return Ok(UpdatedRestaurant);

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRestaurant(string id)
        {
            var result = await _context.Restaurants.DeleteOneAsync(r => r.Id == id);

            if (result.DeletedCount == 0)
                return NotFound(new { message = "Restaurant not found" });

            return NoContent();

        }

    }
}