import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Wishlist.css";

function Wishlist() {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const customerId = localStorage.getItem("customerId");
        if (!customerId) {
          console.error("Customer ID not found in localStorage.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5199/api/Wishlist/${customerId}`);
        setWishlist(response.data);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemoveItem = async (menuItemId) => {
    try {
      const customerId = localStorage.getItem("customerId");
      await axios.delete(`http://localhost:5199/api/Wishlist/${customerId}/item/${menuItemId}`);
      setWishlist((prevWishlist) => ({
        ...prevWishlist,
        items: prevWishlist.items.filter((item) => item.menuItemId !== menuItemId),
      }));
    } catch (error) {
      console.error("Error removing wishlist item:", error);
    }
  };

  const handleClearWishlist = async () => {
    try {
      const customerId = localStorage.getItem("customerId");
      await axios.delete(`http://localhost:5199/api/Wishlist/${customerId}/clear`);
      setWishlist({ ...wishlist, items: [] });
    } catch (error) {
      console.error("Error clearing wishlist:", error);
    }
  };

  if (loading) {
    return (
      <div className="wishlist-container">
        <h2 className="wishlist-title">💛 Your Wishlist</h2>
        <p className="wishlist-loading">Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
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

      {/* Wishlist Header */}
      <div className="wishlist-header">
        <h2 className="wishlist-title">💛 Your Wishlist</h2>
        <button className="clear-wishlist-btn" onClick={handleClearWishlist}>
          Clear All
        </button>
      </div>

      {/* Wishlist Items Grid */}
      {(!wishlist || !wishlist.items || wishlist.items.length === 0) ? (
        <p className="wishlist-empty">Your wishlist is empty.</p>
      ) : (
        <div className="wishlist-grid">
          {wishlist.items.map((item) => (
            <div key={item.menuItemId} className="wishlist-card">
              {/* Trash icon at top-right */}
              <button
                className="wishlist-delete-btn"
                onClick={() => handleRemoveItem(item.menuItemId)}
              >
                <FaTrashAlt />
              </button>


              <div className="wishlist-card-image">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} />
                ) : (
                  <div className="wishlist-placeholder">🍽️</div>
                )}
              </div>
              <h3>{item.name}</h3>
              <p className="wishlist-price">₹{item.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
