using Microsoft.AspNetCore.Mvc;
using RestaurantBackend.Models;
using RestaurantBackend.Data;
using MongoDB.Driver;
using Microsoft.AspNetCore.Authorization;

namespace RestaurantBackend.Controllers
{
    [Authorize(Roles = UserRoles.Admin)]
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly MongoContext _context;
        public AdminController(MongoContext context)
        {
            _context = context;
        }

        [HttpGet("users")]
        public IActionResult GetUsers()
        {
            var users = _context.Users.Find(u => true).ToList();
            return Ok(users);
        }

        [HttpDelete("users/{id}")]
        public IActionResult DeleteUser(string id)
        {
            var result = _context.Users.DeleteOne(u => u.Id == id);
            if (result.DeletedCount == 0)
                return NotFound("User not found.");
            return Ok("User deleted successfully.");

        }

        [HttpGet("restaurants")]
        public IActionResult GetRestaurants()
        {
            var restaurants = _context.Restaurants.Find(r => true).ToList();
            return Ok(restaurants);
        }
    }
}