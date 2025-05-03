import React from 'react';
import '../App.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Welcome to SmashBrosSpain</h1>
      <p>Your ultimate source for Smash Bros tournaments in Spain!</p>
      
      <div className="features">
        <div className="feature-card">
          <h3>Tournament Calendar</h3>
          <p>View all upcoming events</p>
        </div>
        <div className="feature-card">
          <h3>Player Rankings</h3>
          <p>Coming soon!</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;