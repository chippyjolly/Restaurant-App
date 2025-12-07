using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using RestaurantBackend.Models;
using RestaurantBackend.Data;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;

namespace RestaurantBackend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly MongoContext _context;
        public CustomerController(MongoContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult AddCustomer(Customer customer)
        {
            if (string.IsNullOrEmpty(customer.Name) || string.IsNullOrEmpty(customer.Email))
                return BadRequest("Name and Email are required.");

            if (!Regex.IsMatch(customer.Email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
                return BadRequest("Invalid email format.");


            _context.Customers.InsertOne(customer);
            return Ok(customer);
        }


        [HttpGet("restaurants")]
        public IActionResult GetRestaurants()
        {
            var restaurants = _context.Restaurants.Find(r => true).ToList();
            return Ok(restaurants);
        }

        
    }
}