using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace RestaurantBackend.Models
{
     public class Order
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }      // ✅ Make nullable

    public string? CustomerName { get; set; }   // ✅ Make nullable
    public string? ShippingAddress { get; set; } // ⬅ backend creates this
    public DateTime OrderDate { get; set; }
    public string? Status { get; set; }          // ⬅ backend creates this

    public List<OrderItem>? Items { get; set; }  // frontend sends this

    public decimal TotalPrice { get; set; }
}

public class OrderItem
{
    public string? ProductName { get; set; }
    public string? ProductImage { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; }
}

}
