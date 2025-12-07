using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RestaurantBackend.Models
{
    public class MenuItem
    {
        // 👇 Change here: store this as "_id" field explicitly
        [BsonElement("_id")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

        [BsonElement("name")]
        public string Name { get; set; } = null!;

        [BsonElement("price")]
        public decimal Price { get; set; }

        [BsonElement("imageUrl")]
        public string ImageUrl { get; set; } = null!;

        [BsonElement("description")]
        public string Description { get; set; } = null!;

        [BsonElement("restaurantId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? RestaurantId { get; set; }
    }
}
