using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace RestaurantBackend.Models
{
    public class Cart
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        // The customer who owns this cart
        [BsonRepresentation(BsonType.ObjectId)]
        public string CustomerId { get; set; }

        // List of items in the cart
        public List<CartItem> Items { get; set; } = new List<CartItem>();

        public decimal TotalAmount { get; set; }
    }

    public class CartItem
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string MenuItemId { get; set; }

        public string Name { get; set; }

        public int Quantity { get; set; }

        public decimal Price { get; set; }
    }
}
