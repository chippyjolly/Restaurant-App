using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace RestaurantBackend.Models
{
    public class Wishlist
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("customerId")]
        public string CustomerId { get; set; }

        [BsonElement("items")]
        public List<WishlistItem> Items { get; set; } = new List<WishlistItem>();
    }

    public class WishlistItem
    {
        [BsonElement("menuItemId")]
        public string MenuItemId { get; set; }

        [BsonElement("name")]
        public string Name { get; set; }

        [BsonElement("price")]
        public decimal Price { get; set; }

        [BsonElement("imageUrl")]
        public string ImageUrl { get; set; }
    }
}
