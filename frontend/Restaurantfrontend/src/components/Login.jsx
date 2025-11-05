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
        alert("Login successful!");
        const token = response.data.token;
        const userRole = response.data.role;
        console.log("JWT Token:", token);
        localStorage.setItem("token", token);

        const decodedToken = jwtDecode(token);
      
        console.log(userRole)

        if (userRole === "Partner") {
          navigate("/restaurant-owner-view");
        } else {
          navigate("/"); // or to a customer view
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
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
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

          <button type="submit" className="btn">Login</button>
        </form>

        <button className="back-btn" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default Login;
