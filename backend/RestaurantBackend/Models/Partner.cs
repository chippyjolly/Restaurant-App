using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RestaurantBackend.Models
{
    public class Partner
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        // 👤 Partner Info
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;

        // 🍽️ Restaurant Info
        public string RestaurantName { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string Cuisine { get; set; } = null!;
        public string Description { get; set; } = null!;

        // 🔐 Role info
        public string Role { get; set; } = "Partner";
    }
}
