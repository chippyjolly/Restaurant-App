using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using RestaurantBackend.Data;
using RestaurantBackend.Models;
using System.Security.Claims;

namespace RestaurantBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserProfileController : ControllerBase
    {
        private readonly MongoContext _context;

        public UserProfileController(MongoContext context)
        {
            _context = context;
        }

        // ⭐ GET PROFILE (username + email)
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = User.FindFirstValue(ClaimTypes.Role); // To identify customer/partner

            if (string.IsNullOrEmpty(userId))
                return Unauthorized("Invalid token.");

            var user = await _context.Users
                .Find(u => u.Id == userId)
                .FirstOrDefaultAsync();

            if (user == null)
                return NotFound("User not found.");

            return Ok(new
            {
                username = user.Username,
                email = user.Email
            });
        }

        // ⭐ UPDATE PROFILE (username + email)
        [HttpPut("update")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = User.FindFirstValue(ClaimTypes.Role); // "customer" or "Partner"

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            // Get the user from Users collection
            var user = await _context.Users.Find(u => u.Id == userId).FirstOrDefaultAsync();
            if (user == null)
                return NotFound("User not found.");

            string oldEmail = user.Email;

            // ⭐ Update Users Collection
            user.Username = dto.Username;
            user.Email = dto.Email;

            await _context.Users.ReplaceOneAsync(u => u.Id == userId, user);

            // ⭐ If CUSTOMER → also update Customers collection (case-insensitive)
            if (role.Equals(UserRoles.Customer, StringComparison.OrdinalIgnoreCase))
            {
                var customer = await _context.Customers
                    .Find(c => c.Email == oldEmail)
                    .FirstOrDefaultAsync();

                if (customer != null)
                {
                    customer.Name = dto.Username;
                    customer.Email = dto.Email;

                    await _context.Customers.ReplaceOneAsync(c => c.Id == customer.Id, customer);
                }
            }

            // ⭐ If PARTNER → update Partners collection (case-insensitive)
            if (role.Equals(UserRoles.Partner, StringComparison.OrdinalIgnoreCase))
            {
                var partner = await _context.Partners
                    .Find(p => p.Email == oldEmail)
                    .FirstOrDefaultAsync();

                if (partner != null)
                {
                    partner.Name = dto.Username;  // Adjust if field is OwnerName
                    partner.Email = dto.Email;

                    await _context.Partners.ReplaceOneAsync(p => p.Id == partner.Id, partner);
                }
            }

            return Ok(new { message = "Profile updated successfully" });
        }
    }

    // ⭐ DTO
    public class UpdateProfileDto
    {
        public string Username { get; set; }
        public string Email { get; set; }
    }
}
