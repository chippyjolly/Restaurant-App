using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using RestaurantBackend.Models;
using RestaurantBackend.Data;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

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

        // Generate Random Address
        private string GenerateRandomAddress()
        {
            string[] streets = { "MG Road", "Park Street", "Brigade Road", "Anna Salai", "Linking Road" };
            string[] cities = { "Mumbai", "Bangalore", "Chennai", "Delhi", "Kolkata", "Hyderabad" };

            Random r = new Random();
            return $"{r.Next(10,999)}, {streets[r.Next(streets.Length)]}, {cities[r.Next(cities.Length)]}, India";
        }

        // Create Order
        [HttpPost("create")]
        [Authorize]
        public async Task<ActionResult<Order>> CreateOrder([FromBody] Order orderRequest)
        {
            Console.WriteLine("hai");

            
            if (orderRequest == null || orderRequest.Items == null)
                return BadRequest("Invalid order");

            var newOrder = new Order
            {
                CustomerName = orderRequest.CustomerName,
                Items = orderRequest.Items,
                TotalPrice = orderRequest.TotalPrice,
                Status = "Pending",
                OrderDate = DateTime.Now,
                ShippingAddress = GenerateRandomAddress()
            };

            

            await _context.Orders.InsertOneAsync(newOrder);
            return Ok(newOrder);
        }

        // Get all orders
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<List<Order>>> GetOrders()
        {
            var orders = await _context.Orders.Find(_ => true).ToListAsync();
            return Ok(orders);
        }

        // Cancel Order
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> CancelOrder(string id)
        {
            var res = await _context.Orders.DeleteOneAsync(o => o.Id == id);

            if (res.DeletedCount == 0)
                return NotFound();

            return NoContent();
        }
    }
}
