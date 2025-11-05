using MongoDB.Driver;
using Microsoft.Extensions.Options;
using RestaurantBackend.Models;

namespace RestaurantBackend.Data
{
    public class MongoContext
    {
        private readonly IMongoDatabase _database;
        private readonly IMongoClient _client;

        public MongoContext(IOptions<MongoSettings> mongosettings)
        {
            _client = new MongoClient(mongosettings.Value.ConnectionString);
            _database = _client.GetDatabase(mongosettings.Value.DatabaseName);
        }

        public IMongoClient Client => _client;
        public IMongoCollection<Restaurant> Restaurants => _database.GetCollection<Restaurant>("restaurants");
        public IMongoCollection<MenuItem> MenuItems => _database.GetCollection<MenuItem>("MenuItems");
        public IMongoCollection<Customer> Customers => _database.GetCollection<Customer>("Customers");
        public IMongoCollection<Order> Orders => _database.GetCollection<Order>("Orders");

        public IMongoCollection<Partner> Partners => _database.GetCollection<Partner>("Partners");

        public IMongoCollection<User> Users => _database.GetCollection<User>("Users");
    }
}