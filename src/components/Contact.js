import { useContext, useState } from "react";
import { ToastContext } from "../context/ToastContext";

export const Contact = () => {
  const { showToast } = useContext(ToastContext);
  const [feedback, setFeedback] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    showToast("Feedback submitted successfully", "success", 1500);
    setFeedback({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact-container">
      <section className="contact-hero">
        <h1 className="contact-title">Contact Us</h1>
        <p className="contact-subtitle">We are here to help with orders, feedback, and support.</p>
      </section>

      <section className="contact-content">
        <div className="contact-card">
          <h3>Customer Support</h3>
          <p>Need help with your order? Reach us anytime.</p>
          <p><strong>Email:</strong> support@cheffood.com</p>
          <p><strong>Phone:</strong> +91 98765 43210</p>
          <p><strong>Hours:</strong> 9:00 AM - 11:00 PM</p>
        </div>

        <div className="contact-card">
          <h3>Office Address</h3>
          <p>Chef Food Technologies Pvt. Ltd.</p>
          <p>4th Floor, Food Hub Tower</p>
          <p>Sector 62, Noida, Uttar Pradesh 201309</p>
        </div>

        <div className="contact-card">
          <h3>Share Feedback</h3>
          <p>We love hearing from you.</p>
          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={feedback.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={feedback.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Tell us how we can improve"
              rows="4"
              value={feedback.message}
              onChange={handleChange}
              required
            ></textarea>
            <button type="submit">Submit</button>
          </form>
        </div>
      </section>
    </div>
  );
};
