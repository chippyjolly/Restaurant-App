using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using RestaurantBackend.Models;
using RestaurantBackend.Data;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace RestaurantBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly MongoContext _context;

        public OrderController(MongoContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Authorize(Roles =UserRoles.Customer)]
        public IActionResult CreateOrder(Order order)
        {

            var customerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (customerId == null)
            {
                return Unauthorized();
            }

            order.CustomerId = customerId;



            if (order.MenuItemIds == null || order.MenuItemIds.Count == 0)
                return BadRequest("At least one menu item is required.");

            var menuItems = _context.MenuItems.Find(m => m.Id !=null && order.MenuItemIds.Contains(m.Id)).ToList();
            order.TotalPrice = menuItems.Sum(m => m.Price);

            _context.Orders.InsertOne(order);
            return Ok(order);
        }

        [HttpGet("byCustomer")]
        [Authorize(Roles =UserRoles.Customer)]
        public IActionResult GetOrdersByCustomer()
        {

            var customerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if(customerId == null)
            {
                return Unauthorized();
            }



            var orders = _context.Orders.Find(o => o.CustomerId == customerId).ToList();
            return Ok(orders);
        }

        [HttpGet("byRestaurant/{restaurantId}")]
        public IActionResult GetOrdersByRestaurant(string restaurantId)
        {
            var orders = _context.Orders.Find(o => o.RestaurantId == restaurantId).ToList();
            return Ok(orders);
        }
    }
}