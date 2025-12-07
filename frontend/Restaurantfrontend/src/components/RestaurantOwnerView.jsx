import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RestaurantOwnerView.css';

function RestaurantOwnerView() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ownerRestaurantId, setOwnerRestaurantId] = useState(null); // New state for dynamic restaurantId
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOwnerRestaurant = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5199/api/restaurants", {
          headers: { Authorization: `Bearer ${token}` }, //Hey, give me the restaurants that belong to this owner.”
        });

        if (response.data && response.data.length > 0) {
          const restaurant = response.data[0]; // get  restaurant
          const restaurantId = restaurant.id;  // local variable

          setOwnerRestaurantId(restaurantId); // update state

          // Log local variable instead of state
          console.log("Restaurant ID (local):", restaurantId);
          console.log("Fetched Restaurant:", restaurant);
          console.log("Menu Items:", restaurant.menu);// Optional: log menu items
        } else {
          console.warn("No restaurant found for the current owner.");
          setLoading(false);
        }

      } catch (error) {
        console.error("Error fetching owner's restaurant:", error);
        setLoading(false);
      }
    };
    fetchOwnerRestaurant();
  }, []); //call the function right away when the page loads.

  useEffect(() => {
    if (ownerRestaurantId) {
      //Hey backend, show me all menu items for this restaurant ID.
      const fetchMenuItems = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `http://localhost:5199/api/menu/${ownerRestaurantId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setMenuItems(response.data.menuItems);//menu items fetched into React state so the UI can display them.
        } catch (error) {
          console.error("Error fetching menu items:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchMenuItems();
    }
  }, [ownerRestaurantId]); // Re-run when ownerRestaurantId(restaurant-id) is set

  const handleAdd = () => {
    if (ownerRestaurantId) {
      navigate("/add-menu", { state: { restaurantId: ownerRestaurantId } });
    } else {
      alert("Please set up your restaurant first.");
    }
  };

  const handleDelete = async (menuId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5199/api/menu/${menuId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMenuItems(menuItems.filter((item) => item.id !== menuId));
      } catch (error) {
        console.error("Error deleting menu item:", error);
      }
    }
  };

  const handleEdit = (item) => {
    navigate(`/edit-menu/${item.id}`);
  };

  return (
    <div className="restaurant-owner-view">
      {/* Navbar */}
      <nav className="rov-navbar">
        <button onClick={() => navigate("/")}>Home</button> {/* ✅ Added */}
        <button onClick={() => navigate("/partner/restaurants")}>
          View Restaurants
        </button>

        <button onClick={() => navigate("/profile")}>Profile</button>


      </nav>

      {/* Restaurant Image */}
      <div className="rov-restaurant-image-placeholder">
        <img
          src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/236f0d76128175.5c60ecdfead4b.png"
          alt="Restaurant"
        />
      </div>

      {/* Menu Items */}
      {loading ? (
        <p>Loading restaurant data...</p>
      ) : ownerRestaurantId ? (
        <div className="rov-menu-items-grid">
          {menuItems.length > 0 ? (
            menuItems.map((item) => (
              <div key={item.id} className="rov-menu-item-card">
                <div className="rov-card-buttons">
                  <button
                    className="rov-edit-btn"
                    onClick={() => handleEdit(item)}
                    title="Edit Item"
                  >
                    ✏️
                  </button>
                  <button
                    className="rov-delete-btn"
                    onClick={() => handleDelete(item.id)}
                    title="Delete Item"
                  >
                    🗑️
                  </button>
                </div>

                <div className="rov-menu-item-image-placeholder">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} />
                  ) : (
                    <div className="rov-image-placeholder-icon">📷</div>
                  )}
                </div>

                <h3>{item.name}</h3>
              </div>
            ))
          ) : (
            <p>No menu items found. Add one to get started!</p>
          )}
        </div>
      ) : (
        <p>No restaurant associated with your account. Please ensure your restaurant is registered.</p>
      )}

      {/* Add Menu Button */}
      {ownerRestaurantId && (
        <button className="rov-add-menu-button" onClick={handleAdd}>
          Add Menu Item
        </button>
      )}
    </div>
  );
}

export default RestaurantOwnerView;
