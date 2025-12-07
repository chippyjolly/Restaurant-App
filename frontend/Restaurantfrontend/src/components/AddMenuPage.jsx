import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './AddMenuPage.css';

function AddMenuPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: ''
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const { restaurantId } = location.state || {};

  useEffect(() => {
    if (!restaurantId) {
      console.warn("restaurantId not found in navigation state.");
    }
  }, [restaurantId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price) {
      alert("Please fill all required fields.");
      return;
    }

    if (isNaN(parseFloat(formData.price))) {
      alert("Price must be a valid number.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5199/api/menu",
        { ...formData, restaurantId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Menu item added successfully!");
      navigate("/restaurant-owner");
    } catch (error) {
      console.error("Error adding menu item:", error);
      alert("Error adding menu item. Please try again.");
    }
  };

  return (
    <div className="add-menu-container">
      <div className="add-menu-card">
        <h2 className="add-menu-title">Add New Menu </h2>
        <form onSubmit={handleSubmit} className="add-menu-form">
          <input
            type="text"
            name="name"
            placeholder="Item Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Item Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="imageUrl"
            placeholder="Image URL"
            value={formData.imageUrl}
            onChange={handleChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <div className="add-menu-buttons">
            <button type="submit" className="btn-add">Add Item</button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/restaurant-owner")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMenuPage;
