import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./SingleItemView.css";

function SingleItemView() {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5199/api/menu/item/${itemId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setItem(response.data);
      } catch (error) {
        console.error("Error fetching menu item:", error);
      } finally {
        setLoading(false);
      }
    };

    if (itemId) fetchItem();
  }, [itemId]);

  const handleAddToCart = () => alert(`${item.name} added to cart`);
  const handleAddToWishlist = () => alert(`${item.name} added to wishlist`);

  if (loading) return <div className="loading">Loading item...</div>;
  if (!item) return <div className="error">Item not found.</div>;

  return (
    <div className="single-item-view">
      {/* Navbar (same as SingleRestaurantView) */}
      <nav className="srv-navbar">
        <button>Home</button>
        <button>Wishlist</button>
        <button>Cart</button>
        <button>Orders</button>
        <button>Profile</button>
        <button>Logout</button>
      </nav>

      {/* Item Display */}
      <div className="siv-container">
        <div className="siv-image-container">
          <img
            src={
              item.imageUrl ||
              "https://mir-s3-cdn-cf.behance.net/project_modules/fs/236f0d76128175.5c60ecdfead4b.png"
            }
            alt={item.name}
          />
        </div>

        <div className="siv-details">
          <h1 className="siv-name">{item.name}</h1>
          <p className="siv-price">₹{item.price}</p>
          <p className="siv-description">{item.description}</p>

          <div className="siv-info-list">
            {item.category && (
              <p>
                <strong>Category:</strong> {item.category}
              </p>
            )}
            {item.ingredients && (
              <p>
                <strong>Ingredients:</strong> {item.ingredients.join(", ")}
              </p>
            )}
          </div>

          <div className="siv-buttons">
            <button className="siv-cart-btn" onClick={handleAddToCart}>
              🛒 Add to Cart
            </button>
            <button className="siv-wishlist-btn" onClick={handleAddToWishlist}>
              ❤️ Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleItemView;
