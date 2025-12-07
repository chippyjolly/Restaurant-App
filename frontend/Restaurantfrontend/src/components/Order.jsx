import React, { useEffect, useState } from "react";
import "./Order.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5199/api/order", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrders();
  }, []);

  const cancelOrder = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5199/api/order/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(orders.filter((order) => order.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="cart-container">
      <div className="srv-navbar-view">
        <div className="srv-logo" onClick={() => navigate("/")}>MyRestaurant</div>
        <div className="srv-links">
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={() => navigate('/customer')}>Restaurants</button>
          <button onClick={() => navigate("/wishlist")}>Wishlist</button>
          <button onClick={() => navigate("/cart")}>Cart</button>
          <button onClick={() => navigate("/orders")}>Orders</button>
          <button onClick={() => navigate("/profile")}>Profile</button>
        </div>
      </div>

      <div className="cart-content">
        {orders.length === 0 && <p>No orders found.</p>}

        {orders.map((order) => (
          <div className="order-wrapper" key={order.id}>

            {/* <h2 className="order-title">Order ID: {order.id}</h2> */}

            <div className="order-info">
              <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Shipping:</strong> {order.shippingAddress}</p>
            </div>

            <div className="order-products">
              {order.items.map((item, idx) => (
                <div key={idx} className="order-card">

                  {/* <img
                    src={item.productImage || "/no-image.png"}
                    alt={item.productName}
                    className="order-img"
                  /> */}

                  <div className="order-card-info">
                    <h4>{item.productName}</h4>
                    <p>₹{item.price}</p>
                    <p>Qty: {item.quantity}</p>
                  </div>

                </div>
              ))}
            </div>

            <h3 className="order-total">Total Price : ₹{order.totalPrice}</h3>

            <div className="order-btn-container">
              <button className="cancel-order-btn" onClick={() => cancelOrder(order.id)}>
                Cancel Order
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
