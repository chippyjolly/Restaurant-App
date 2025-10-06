using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RestaurantBackend.Models
{
    public class MenuItem
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("name")]
        public string Name { get; set; } = null!;

        [BsonElement("price")]
        public decimal Price { get; set; }

        [BsonElement("restaurantId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? restaurantId { get; set; }
    }
}