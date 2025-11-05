import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddMenuPage() {
  const [formData, setFormData] = useState({ name: '', description: '', price: '', imageUrl: '' });
  const navigate = useNavigate();
  const restaurantId = "663a4999f2083e709c834045"; // TODO: Make this dynamic

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
      await axios.post("http://localhost:5199/api/partner/menu", { ...formData, restaurantId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Menu item added successfully!");
      navigate("/restaurant-owner-view");
    } catch (error) {
      console.error("Error adding menu item:", error);
      alert("Error adding menu item. Please try again.");
    }
  };

  return (
    <div className="add-menu-page">
      <h2>Add New Menu Item</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Item Name" value={formData.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Item Description" value={formData.description} onChange={handleChange} required />
        <input type="text" name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} />
        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
        <button type="submit">Add Item</button>
        <button type="button" onClick={() => navigate("/restaurant-owner-view")}>Cancel</button>
      </form>
    </div>
  );
}

export default AddMenuPage;
