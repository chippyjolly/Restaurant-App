import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RestaurantOwnerView() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const restaurantId = "663a4999f2083e709c834045"; // TODO: Make this dynamic
  const navigate = useNavigate();

  const handleAdd = () => {
    navigate("/add-menu");
  };

  const handleDelete = async (menuId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5199/api/partner/menu/${menuId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMenuItems(menuItems.filter(item => item.id !== menuId));
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
  };

  const handleEdit = (item) => {
    // TODO: Navigate to an EditMenuPage, passing the item id
    console.log("Editing item:", item);
  };

  return (
    <div className="restaurant-owner-view">
      <nav className="rov-navbar">
        <button>View Restaurants</button>
        <button>Profile</button>
        <button>Logout</button>
      </nav>
      <div className="rov-restaurant-image-placeholder">
        {/* Restaurant image will go here */}
        <p>Restaurant Image</p>
      </div>
      <div className="rov-menu-items-grid">
        {loading ? (
          <p>Loading menu items...</p>
        ) : menuItems.length > 0 ? (
          menuItems.map(item => (
            <div key={item.id} className="rov-menu-item-card">
              <div className="rov-menu-item-image-placeholder">
                {item.imageUrl ? <img src={item.imageUrl} alt={item.name} /> : <div className="rov-image-placeholder-icon">📷</div>}
              </div>
              <h3>{item.name}</h3>
              <div className="rov-card-buttons">
                <button className="rov-edit-btn" onClick={() => handleEdit(item)}>Edit</button>
                <button className="rov-delete-btn" onClick={() => handleDelete(item.id)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No menu items found. Add one to get started!</p>
        )}
      </div>

      <button className="rov-add-menu-button" onClick={handleAdd}>Add Menu Item</button>
    </div>
  );
}

export default RestaurantOwnerView;
