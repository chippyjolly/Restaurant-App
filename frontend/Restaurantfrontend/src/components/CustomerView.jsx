import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CustomerView.css';

function CustomerView() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5199/api/customer/restaurants', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRestaurants(response.data);
      } catch (err) {
        setError('Failed to fetch restaurants.');
        console.error('Error fetching restaurants:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="customer-view-container">
        <div className="loading-spinner"></div>
        <p>Loading restaurants...</p>
      </div>
    );
  }

  if (error) {
    return <div className="customer-view-container"><p className="error-message">{error}</p></div>;
  }

  return (
    <div className="customer-view-container">
      {/* Navbar */}
      <nav className="customer-navbar">
        <div className="navbar-logo">🍽️ DineSphere</div>
        <div className="navbar-links">
          <button onClick={() => navigate('/')}>Home</button>
          <button onClick={() => navigate('/customer')}>Restaurants</button>
          <button onClick={() => navigate('/cart')}>Cart</button>
          <button onClick={() => navigate('/orders')}>Orders</button>
          <button onClick={() => navigate('/profile')}>Profile</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* Heading */}
      <h2 className="restaurants-heading">Discover the Best Restaurants Near You</h2>
      <p className="subheading">Handpicked culinary experiences tailored for your taste.</p>

      {/* Restaurant Cards */}
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
                  src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1551218808-94e220e084d2'}
                  alt={restaurant.name}
                  className="restaurant-image"
                />
                <div className="image-overlay">
                  <span>View Menu</span>
                </div>
              </div>
              <div className="restaurant-info">
                <h3>{restaurant.name}</h3>
                <p className="restaurant-location">📍 {restaurant.address || 'Unknown Location'}</p>
                <div className="rating-price">
                  <span className="restaurant-rating">⭐ {restaurant.rating ? restaurant.rating.toFixed(1) : (3.5 + Math.random() * 1.5).toFixed(1)}</span>
                  <span className="restaurant-type">{restaurant.cuisine || 'Multi Cuisine'}</span>
                </div>
              </div>

            </div>
          ))
        ) : (
          <p>No restaurants available right now.</p>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 DineSphere — Savor Every Moment.</p>
      </footer>
    </div>
  );
}

export default CustomerView;
