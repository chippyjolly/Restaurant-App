using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RestaurantBackend.Models
{
    public class Order
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("customerId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? CustomerId { get; set; }

        [BsonElement("restaurantId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string RestaurantId { get; set; } = null!;

        [BsonElement("menuItemIds")]
        public List<string> MenuItemIds { get; set; } = new List<string>();

        [BsonElement("totalPrice")]
        public decimal TotalPrice{ get; set; }


    }
}