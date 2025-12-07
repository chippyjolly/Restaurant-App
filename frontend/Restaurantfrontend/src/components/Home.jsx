import React, { useState } from 'react';
import './Home.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [contactData, setContactData] = useState({ name: '', email: '', message: '' });

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
      navigate("/login");
    } catch (error) {
      console.error('Registration failed:', error.response || error);
      alert('Error registering partner. Please try again.');
    }
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert(`Thanks ${contactData.name}, we’ll reach out soon!`);
    setContactData({ name: '', email: '', message: '' });
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="home-nav">
       <div className="navbar-logo">🍽️ DineSphere</div>
        <div className="nav-links">
          <a onClick={() => scrollToSection('home-section')}>Home</a>
          <a onClick={() => scrollToSection('about-section')}>About</a>
          <a onClick={() => scrollToSection('partner-section')}>Partner</a>
          <a onClick={() => scrollToSection('contact-section')}>Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home-section" className="home-section hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Experience Fine Dining</h1>
          <p>Discover flavors crafted with passion, elegance, and excellence.</p>
          <div className="hero-buttons">
            <button onClick={() => navigate('/register')}>Get Started</button>
            <button onClick={() => navigate('/login')} className="secondary">Login</button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about-section" className="home-section about-section">
        <div className="section-content">
          <h2>About Us</h2>
          <p>
            At <strong>The Gourmet Room</strong>, we redefine the dining experience. Our platform connects you with premium restaurants that share our love for culinary excellence.
          </p>
          <p>
            From rich traditional recipes to modern delicacies, we deliver unforgettable flavors — every dish a story, every bite a journey.
          </p>
        </div>
      </section>

      {/* Partner Section */}
      <section id="partner-section" className="home-section partner-section">
        <div className="section-content">
          {!showPartnerForm ? (
            <>
              <h2>Partner With Us</h2>
              <p>Showcase your culinary creations to thousands of food lovers worldwide.</p>
              <button onClick={() => setShowPartnerForm(true)}>Join as Partner</button>
            </>
          ) : (
            <form className="partner-form" onSubmit={handlePartnerSubmit}>
              <h2>Restaurant Partner Registration</h2>
              <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
              <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required />
              <input type="text" name="restaurantName" placeholder="Restaurant Name" value={formData.restaurantName} onChange={handleChange} required />
              <input type="text" name="address" placeholder="Restaurant Address" value={formData.address} onChange={handleChange} required />
              <input type="text" name="cuisine" placeholder="Cuisine Type" value={formData.cuisine} onChange={handleChange} required />
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
              <div className="partner-buttons">
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setShowPartnerForm(false)}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-section" className="home-section contact-section">
        <div className="contact-container">
          <div className="contact-info">
            <h2>Contact Us</h2>
            <p>We’d love to hear from you. Get in touch with our team for inquiries, feedback, or collaborations.</p>

            <div className="contact-details">
              <p>📍 221 Culinary Avenue, Mumbai, India</p>
              <p>☎️ +91 98765 12345</p>
              <p>✉️ hello@gourmetroom.com</p>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleContactSubmit}>
            <h3>Send a Message</h3>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={contactData.name}
              onChange={handleContactChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={contactData.email}
              onChange={handleContactChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="4"
              value={contactData.message}
              onChange={handleContactChange}
              required
            ></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 The Gourmet Room — Crafted with Passion.</p>
      </footer>
    </div>
  );
}

export default Home;
