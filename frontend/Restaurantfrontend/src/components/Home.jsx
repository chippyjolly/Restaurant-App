import React, { useState } from 'react';
import './Home.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [showPartnerForm, setShowPartnerForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    restaurantName: '',
    address: '',
    cuisine: '',
    description: '',
  });

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePartnerSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5199/api/partner/register', formData);
      alert('Partner registration successful!');
      console.log(response.data);
      setShowPartnerForm(false);
      navigate("/restaurant-owner-view");
    } catch (error) {
      console.error('Registration failed:', error.response || error);
      alert('Error registering partner. Please try again.');
    }
  };

  return (
    <div className="home-container">
      <nav className="home-nav">
        <a onClick={() => scrollToSection('home-section')}>Home</a>
        <a onClick={() => scrollToSection('about-section')}>About Us</a>
        <a onClick={() => scrollToSection('partner-section')}>Partner Us</a>
        <a onClick={() => scrollToSection('contact-section')}>Contact Us</a>
      </nav>

      <section id="home-section" className="home-section">
        <div className="home-card">
          <button onClick={() => navigate('/register')}>Register</button>
          <button onClick={() => navigate('/login')}>Login</button>
        </div>
      </section>

      <section id="about-section" className="home-section">
        <div className="home-card">
          <button onClick={() => alert('About Us page')}>About Us</button>
        </div>
      </section>

      <section id="partner-section" className="home-section">
        <div className="home-card">
          {!showPartnerForm ? (
            <button onClick={() => setShowPartnerForm(true)}>Partner Us</button>
          ) : (
            <form className="partner-form" onSubmit={handlePartnerSubmit}>
              <h2>Restaurant Partner Registration</h2>
              <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
              <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required />
              <input type="text" name="restaurantName" placeholder="Restaurant Name" value={formData.restaurantName} onChange={handleChange} required />
              <input type="text" name="address" placeholder="Restaurant Address" value={formData.address} onChange={handleChange} required />
              <input type="text" name="cuisine" placeholder="Cuisine Type (e.g., South Indian, Chinese)" value={formData.cuisine} onChange={handleChange} required />
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
              <div className="partner-buttons">
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setShowPartnerForm(false)}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </section>

      <section id="contact-section" className="home-section">
        <div className="home-card">
          <button onClick={() => alert('Contact Us page')}>Contact Us</button>
        </div>
      </section>
    </div>
  );
}

export default Home;