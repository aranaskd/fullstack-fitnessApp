import React from 'react';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home-container d-flex align-items-center justify-content-center">
      <div className="text-center p-5 shadow-lg rounded bg-light home-content">
        <h1 className="display-4">Welcome to FitnessApp!</h1>
        <p className="lead mt-4">Your journey to a healthier lifestyle starts here.</p>
        <p>Track your workouts, monitor progress, and stay motivated!</p>
      </div>
    </div>
  );
}

export default Home;
