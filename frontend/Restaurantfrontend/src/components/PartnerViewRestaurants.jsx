import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CustomerView.css"; // reuse same styling

function PartnerViewRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5199/api/restaurants/all-except-mine",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRestaurants(res.data);
      } catch (err) {
        setError("Failed to fetch restaurants.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="customer-view-container">
      {/* Navbar */}
      <nav className="customer-navbar">
        <div className="navbar-logo">🍽️ DineSphere</div>

        <div className="navbar-links">
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={() => navigate("/restaurant-owner")}>My Restaurant</button>
          <button onClick={() => navigate("/profile")}>Profile</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* Heading */}
      <h2 className="restaurants-heading">All Restaurants on DineSphere</h2>
      <p className="subheading">Browse restaurants listed by other partners.</p>

      {/* Loading */}
      {loading && (
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
          <p>Loading restaurants...</p>
        </div>
      )}

      {/* Error */}
      {error && <p className="error-message">{error}</p>}

      {/* Restaurant Grid */}
      <div className="restaurants-grid">
        {restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="restaurant-card"
              onClick={() => navigate(`/single-restaurant/${restaurant.id}`)}
            >
              <div className="image-container">
                <img
                  src={restaurant.imageUrl || "https://images.unsplash.com/photo-1551218808-94e220e084d2"}
                  alt={restaurant.name}
                  className="restaurant-image"
                />
                <div className="image-overlay">
                  <span>View Details</span>
                </div>
              </div>

              <div className="restaurant-info">
                <h3>{restaurant.name}</h3>
                <p className="restaurant-location">
                  📍 {restaurant.address || "Unknown Location"}
                </p>
                <div className="rating-price">
                  <span className="restaurant-rating">
                    ⭐ {restaurant.rating ? restaurant.rating.toFixed(1) : "4.0"}
                  </span>
                  <span className="restaurant-type">
                    {restaurant.cuisine || "Multi Cuisine"}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No restaurants found.</p>
        )}
      </div>

      <footer className="footer">
        <p>© 2025 DineSphere — Empowering Restaurant Partners.</p>
      </footer>
    </div>
  );
}

export default PartnerViewRestaurants;
