namespace RestaurantBackend.Models.Dtos
{
    public class PartnerRegisterDto
    {
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public string RestaurantName { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string Cuisine { get; set; } = null!;
        public string Description { get; set; } = null!;
    }
}
