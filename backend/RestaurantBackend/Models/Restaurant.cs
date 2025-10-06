using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RestaurantBackend.Models
{
    public class Restaurant
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("name")]
        public string Name { get; set; } = null!;

        [BsonElement("address")]
        public string Address { get; set; } = null!;

        [BsonElement("cuisine")]
        public string Cuisine { get; set; } = null!;

        [BsonElement("Menu")]
        public List<MenuItem> Menu { get; set; } = new List<MenuItem>();

    }
}

