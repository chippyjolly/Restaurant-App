import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "" });

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5199/api/userprofile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm(res.data);
    };

    loadProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put("http://localhost:5199/api/userprofile/update", form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Profile updated!");
      navigate("/profile");

    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div className="profile-container">

      {/* NAVBAR */}
      <div className="srv-navbar-view">
        <div className="srv-logo" onClick={() => navigate("/")}>🍽️ DineSphere</div>

        <div className="srv-links">
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={() => navigate("/wishlist")}>Wishlist</button>
          <button onClick={() => navigate("/cart")}>Cart</button>
          <button onClick={() => navigate("/orders")}>Orders</button>
          <button onClick={() => navigate("/profile")}>Profile</button>
        </div>
      </div>

      {/* EDIT CARD */}
      <div className="profile-card">

        <h2 className="profile-name">Edit Profile</h2>

        <input
          type="text"
          className="profile-input"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          placeholder="Username"
        />

        <input
          type="email"
          className="profile-input"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
        />

        <button className="profile-btn save-btn" onClick={handleUpdate}>
          Save Changes
        </button>

        <button className="profile-btn cancel-btn" onClick={() => navigate("/profile")}>
          Cancel
        </button>

      </div>

    </div>
  );
}

export default EditProfile;
