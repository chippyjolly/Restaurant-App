using Microsoft.AspNetCore.Mvc;
using RestaurantBackend.Models;
using RestaurantBackend.Data;
using BCrypt.Net;
using RestaurantBackend.Models.Dtos;
using MongoDB.Driver;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace RestaurantBackend.Controllers
{
    [ApiController]
    [Route("api/partner")]
    public class PartnerController : ControllerBase
    {
        private readonly MongoContext _context;
        private readonly IConfiguration _configuration;

        public PartnerController(MongoContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] PartnerRegisterDto dto)
        {
            // 🧩 Check if email already exists
            var existingUser = _context.Users.Find(u => u.Email == dto.Email).FirstOrDefault();
            if (existingUser != null)
                return BadRequest("User with this email already exists.");

            // 🔒 Hash password
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            // 👤 Create Partner record
            var partner = new Partner
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = passwordHash,
                PhoneNumber = dto.PhoneNumber,
                RestaurantName = dto.RestaurantName,
                Address = dto.Address,           // ✅ new field
                Cuisine = dto.Cuisine,           // ✅ new field
                Description = dto.Description,
                Role = UserRoles.Partner
            };

            _context.Partners.InsertOne(partner);

            // 👥 Create User record (for login)
            var user = new User
            {
                Username = dto.Name,
                Email = dto.Email,
                PasswordHash = passwordHash,
                Role = UserRoles.Partner
            };
            _context.Users.InsertOne(user);

            var restaurant = new Restaurant
            {
                Name = dto.RestaurantName,
                Address = dto.Address,
                Cuisine = dto.Cuisine,
                OwnerId = user.Id,
                Menu = new List<MenuItem>()
            };
            _context.Restaurants.InsertOne(restaurant);

            return Ok(new { message = "Partner and restaurant registered successfully" });
        }


    }
}
