using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using RestaurantBackend.Data;
using RestaurantBackend.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


namespace RestaurantBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly MongoContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(MongoContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }


        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterDto dto)
        {
            var existingUser = _context.Users.Find(u => u.Email == dto.Email).FirstOrDefault();
            if (existingUser != null)
                return BadRequest("User with this email already exists.");

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.password);
            var user = new user;
            {
                Username = dto.Username,
                Email = dto.Email,
                passwordHash = passwordHash,
                Role = dto.Role
            };

            _context.Users.InsertOne(user);

            return Ok(new { message = "User registered successfully" });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto dto)
        {
            var user = _context.Users.Find(u => u.Email == dto.Email).FirstOrDefault();
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.password, user.PasswordHash))
                return Unauthorized("Invalid email or password.");

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["JWT:Key"]);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id!),
new Claim(ClaimTypes.Name, user.Username),


                })
            }
        }
    }
}