using MongoDB.Driver;
using Microsoft.Extensions.Options;
using RestaurantBackend.Models;

namespace RestaurantBackend.Data
{
    public class MongoContext
    {
        private readonly IMongoDatabase _database;

        public MongoContext(IOptions<MongoSettings> mongosettings)
        {
            var client = new MongoClient(mongosettings.Value.ConnectionString);
            _database = client.GetDatabase(mongosettings.Value.DatabaseName);
        }

        public IMongoCollection<Restaurant> Restaurants => _database.GetCollection<Restaurant>("restaurants");
        public IMongoCollection<MenuItem> MenuItems => _database.GetCollection<MenuItem>("MenuItems");
        public IMongoCollection<Customer> Customers => _database.GetCollection<Customer>("Customers");
        public IMongoCollection<Order> Orders => _database.GetCollection<Order>("Orders");
    }
}