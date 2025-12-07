import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./EditItemPage.css";

function EditItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5199/api/menu/item/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Fetched item:", response.data);
        setItem(response.data);
      } catch (error) {
        console.error("Error fetching menu item:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5199/api/menu/${id}`, item, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Menu item updated successfully!");
      navigate("/restaurant-owner");
    } catch (error) {
      console.error("Error updating menu item:", error);
      alert("❌ Failed to update item. Please try again.");
    }
  };

  if (loading) {
    return <p className="edit-item-loading">Loading item details...</p>;
  }

  return (
    <div className="edit-item-container">
      <div className="edit-item-card">
        <h2>Edit Menu Item</h2>
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={item.name}
            onChange={handleChange}
            placeholder="Enter item name"
          />

          <label>Description</label>
          <textarea
            name="description"
            value={item.description}
            onChange={handleChange}
            placeholder="Enter item description"
          ></textarea>

          <label>Price</label>
          <input
            type="number"
            name="price"
            value={item.price}
            onChange={handleChange}
            placeholder="Enter price"
          />

          <label>Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={item.imageUrl}
            onChange={handleChange}
            placeholder="Enter image URL"
          />

          <button type="submit" className="btn">
            Save Changes
          </button>
        </form>

        <button className="back-btn" onClick={() => navigate("/restaurant-owner")}>
          ⬅ Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default EditItemPage;
