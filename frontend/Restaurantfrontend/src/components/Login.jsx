import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = form;

    if (!email || !password) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5199/api/auth/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const token = response.data.token;
        const userRole = response.data.role;
        const userId = response.data.userId;
        const userName = response.data.userName;

        console.log("JWT Token:", token);
        console.log("User ID:", userId);

        localStorage.setItem("token", token);
        localStorage.setItem("customerId", userId);
        localStorage.setItem("customerName", userName);


        const decodedToken = jwtDecode(token);
        console.log(userRole);

        if (userRole === "Partner") {
          navigate("/restaurant-owner");
        } else {
          navigate("/customer");
        }

        setForm({ email: "", password: "" });
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert(error.response.data);
      } else {
        console.error("Login error:", error);
        alert("An error occurred during login. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />

          <button type="submit" className="btn-login">Login</button>
        </form>

        <button className="btn-back" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default Login;
