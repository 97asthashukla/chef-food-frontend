export const Contact = () => {
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
          <form className="contact-form" onSubmit={(event) => event.preventDefault()}>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Email Address" required />
            <textarea placeholder="Tell us how we can improve" rows="4" required></textarea>
            <button type="submit">Submit</button>
          </form>
        </div>
      </section>
    </div>
  );
};
