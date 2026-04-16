export const About = () => (
  <div className="about-container">
    <div className="about-hero">
      <h1 className="about-title">About Chef Food</h1>
      <p className="about-tagline">Connecting people with food, one delivery at a time</p>
    </div>

    <div className="about-intro">
      <p>
        Chef Food is a modern food delivery platform making gourmet cuisine accessible to everyone. 
        We connect food lovers with the best restaurants in their city through our user-friendly app and website.
      </p>

      <p>
        Our mission is to revolutionize food delivery by combining speed, reliability, and quality. 
        We work with hand-picked restaurants to ensure every meal arrives fresh and delicious, 
        delivering not just food, but exceptional culinary experiences.
      </p>
    </div>

    <div className="about-section">
      <h2 className="section-title">Our Services</h2>
      <div className="services-grid">
        <div className="service-card">
          <h3>🍕 Fast Food Delivery</h3>
          <p>Quick and reliable food delivery from your favorite restaurants with real-time tracking.</p>
        </div>
        <div className="service-card">
          <h3>⭐ Chef's Recommendations</h3>
          <p>Curated restaurant suggestions and exclusive deals from top-rated culinary partners.</p>
        </div>
        <div className="service-card">
          <h3>🎁 Loyalty Rewards</h3>
          <p>Earn points on every order and enjoy exclusive discounts and special offers.</p>
        </div>
        <div className="service-card">
          <h3>💳 Easy Payments</h3>
          <p>Multiple payment options with secure transactions and instant order confirmation.</p>
        </div>
      </div>
    </div>

    <div className="about-section">
      <h2 className="section-title">Platform Focus</h2>
      <div className="focus-content">
        <p>
          The platform integrates payments, discovery, personalization, and logistics
          into a single flow. Restaurants gain demand aggregation and operational tools,
          delivery partners get flexible earning opportunities, and users get fast,
          predictable fulfillment.
        </p>

        <p>
          Focus areas include high-frequency use cases, city-level density, and
          improving unit economics through route efficiency, batching, and supply
          balancing.
        </p>
      </div>
    </div>

    <div className="about-footer">
      <p>Join millions of users discovering restaurants and food near them.</p>
    </div>
  </div>
);
