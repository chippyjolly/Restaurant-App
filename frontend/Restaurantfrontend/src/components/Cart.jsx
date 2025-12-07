import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Cart.css";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const customerId = localStorage.getItem("customerId");
        const res = await axios.get(`http://localhost:5199/api/Cart/${customerId}`);
        setCart(res.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) {
      alert("Cart empty!");
      return;
    }

    setCheckoutLoading(true);

    try {
      const token = localStorage.getItem("token");

      const orderPayload = {
        customerName: localStorage.getItem("customerName") || "Guest Customer",
        items: cart.items.map((i) => ({
          productName: i.name,
          productImage: i.image || "",
          price: i.price,
          quantity: i.quantity
        })),
        totalPrice: cart.totalAmount
      };

      console.log(orderPayload);



      await axios.post("http://localhost:5199/api/Order/create", orderPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const customerId = localStorage.getItem("customerId");
      await axios.delete(`http://localhost:5199/api/Cart/${customerId}/clear`);

      navigate("/orders");
    } catch (e) {
      console.error("Checkout Failed", e);
    } finally {
      setCheckoutLoading(false);
    }
  };

  // console.log("Cart:", cart);
  // console.log("Cart Items:", cart?.items);


  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="cart-container">
      <nav className="srv-navbar-view">
        <div className="srv-logo" onClick={() => navigate("/")}>🍽️ DineSphere</div>
        <div className="srv-links">
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={() => navigate('/customer')}>Restaurants</button>
          <button onClick={() => navigate("/wishlist")}>Wishlist</button>
          <button onClick={() => navigate("/cart")}>Cart</button>
          <button onClick={() => navigate("/orders")}>Orders</button>
          <button onClick={() => navigate("/profile")}>Profile</button>
        </div>
      </nav>

      <div className="cart-content">
        {cart.items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-items">
              {cart.items.map((item) => (
                <div key={item.menuItemId} className="cart-item">
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p>₹{item.price} × {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Total: ₹{cart.totalAmount}</h3>

              {/* <button className="checkout-btn" onClick={handleCheckout}>
                {checkoutLoading ? "Processing..." : "Proceed to Checkout"}
              </button> */}

              <button
                className="checkout-btn"
                onClick={() => {
                  console.log("Button clicked");   // ✅ Debug log
                  handleCheckout();                // Call the original function
                }}
              >
                {checkoutLoading ? "Processing..." : "Proceed to Checkout"}
              </button>

            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;
