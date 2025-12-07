import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import "./SingleRestaurantView.css";

function SingleRestaurantView() {
  const [menuItems, setMenuItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  const { restaurantId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const idToUse = restaurantId || location.state?.restaurantId;

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5199/api/menu/${idToUse}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMenuItems(response.data.menuItems);
        setRestaurant(response.data.restaurant || null);
      } catch (error) {
        console.error("Error fetching restaurant:", error);
      } finally {
        setLoading(false);
      }
    };

    if (idToUse) fetchRestaurantData();
    else setLoading(false);
  }, [idToUse]);

  const handleAddToCart = async (item) => {
    try {
      const customerId = localStorage.getItem("customerId");
      await axios.post("http://localhost:5199/api/Cart/add", {
        customerId: customerId,
        menuItemId: item.id,
        name: item.name,
        quantity: 1,
        price: item.price,
      });
      alert(`${item.name} added to your cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart.");
    }
  };

  const handleAddToWishlist = async (item) => {
    try {
      const customerId = localStorage.getItem("customerId");
      if (!customerId) {
        alert("Please log in to add items to your wishlist.");
        return;
      }

      const wishlistItem = {
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl || "",
      };

      await axios.post(`http://localhost:5199/api/Wishlist/${customerId}/add`, wishlistItem);
      alert(`${item.name} added to your wishlist!`);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      alert("Failed to add item to wishlist.");
    }
  };

  const handleItemClick = (itemId) => {
    navigate(`/item/${itemId}`, { state: { restaurantId: idToUse } });
  };

  return (
    <div className="single-restaurant-view">
      {/* Navbar */}
      <nav className="srv-navbar-view">
        <div className="srv-logo" onClick={() => navigate("/")}>
          🍽️ DineSphere
        </div>
        <div className="srv-links">
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={() => navigate("/wishlist")}>Wishlist</button>
          <button onClick={() => navigate("/cart")}>Cart</button>
          <button onClick={() => navigate("/orders")}>Orders</button>
          <button onClick={() => navigate("/profile")}>Profile</button>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Restaurant Header */}
      {restaurant && (
        <div className="srv-header">
          <h1 className="srv-name">{restaurant.name}</h1>
          <img
            className="srv-image"
            src={
              restaurant.imageUrl ||
              "https://mir-s3-cdn-cf.behance.net/project_modules/fs/236f0d76128175.5c60ecdfead4b.png"
            }
            alt={restaurant.name}
          />
        </div>
      )}

      {/* Menu Section */}
      {loading ? (
        <p className="loading-text">Loading menu items...</p>
      ) : menuItems.length > 0 ? (
        <div className="srv-menu-grid">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="srv-menu-card"
              onClick={() => handleItemClick(item.id)}
            >
              <div className="srv-menu-image">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} />
                ) : (
                  <div className="srv-placeholder">🍽️</div>
                )}
              </div>
              <h3>{item.name}</h3>
              <p className="srv-price">₹{item.price}</p>
              <div className="srv-buttons">
                <button
                  className="srv-cart-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(item);
                  }}
                >
                  Add to Cart
                </button>
                <button
                  className="srv-wishlist-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToWishlist(item);
                  }}
                >
                  Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-menu-text">No menu items found for this restaurant.</p>
      )}
    </div>
  );
}

export default SingleRestaurantView;
