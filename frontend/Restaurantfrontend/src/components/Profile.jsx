import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5199/api/userprofile", {
          headers: { Authorization: `Bearer ${token}` }
        });

        setProfile(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadProfile();
  }, []);

  if (!profile) return <h3 style={{ textAlign: "center", marginTop: 50 }}>Loading...</h3>;

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

      {/* PROFILE CARD */}
      <div className="profile-card">

        <img src="/avatar.png" alt="Profile" className="profile-avatar" />

        <h2 className="profile-name">{profile.username}</h2>
        <p className="profile-email">{profile.email}</p>

        <button className="profile-btn edit-btn" onClick={() => navigate("/edit-profile")}>
          Edit Profile
        </button>

        <button
          className="profile-btn logout-btn"
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>

    </div>
  );
}

export default Profile;
