using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using RestaurantBackend.Data;
using RestaurantBackend.Models;
using System.Security.Claims;

namespace RestaurantBackend.Controllers
{
    [ApiController]
    [Route("api/partner/menu")]
    [Authorize(Roles = UserRoles.Partner)]
    public class MenuController : ControllerBase
    {
        private readonly MongoContext _context;

        public MenuController(MongoContext context)
        {
            _context = context;
        }

        [HttpGet("{restaurantId}")]
        public async Task<IActionResult> GetMenu(string restaurantId)
        {
            var menuItems = await _context.MenuItems.Find(m => m.RestaurantId == restaurantId).ToListAsync();
            return Ok(menuItems);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMenuItem([FromBody] MenuItem menuItem)
        {
            await _context.MenuItems.InsertOneAsync(menuItem);
            return CreatedAtAction(nameof(GetMenu), new { restaurantId = menuItem.RestaurantId }, menuItem);
        }

        [HttpPut("{menuId}")]
        public async Task<IActionResult> UpdateMenuItem(string menuId, [FromBody] MenuItem menuItemIn)
        {
            var menuItem = await _context.MenuItems.Find(m => m.Id == menuId).FirstOrDefaultAsync();

            if (menuItem == null)
            {
                return NotFound();
            }

            menuItemIn.Id = menuItem.Id;
            await _context.MenuItems.ReplaceOneAsync(m => m.Id == menuId, menuItemIn);

            return NoContent();
        }

        [HttpDelete("{menuId}")]
        public async Task<IActionResult> DeleteMenuItem(string menuId)
        {
            var menuItem = await _context.MenuItems.Find(m => m.Id == menuId).FirstOrDefaultAsync();

            if (menuItem == null)
            {
                return NotFound();
            }

            await _context.MenuItems.DeleteOneAsync(m => m.Id == menuId);

            return NoContent();
        }
    }
}
