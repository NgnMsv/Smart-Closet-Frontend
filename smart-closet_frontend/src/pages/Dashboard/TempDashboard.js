import React, { useEffect, useState } from 'react';
import dashboardImage from './Dashboard.webp'; // Correct image import
import styles from './Dashboard.css'; // Importing the CSS module

const Dashboard = () => {
  const [showWearables, setShowWearables] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      window.location = "/Login";
    }
  }, []);

  const handleGenerateCombination = () => {
    window.location = "/generate-combination";
  };

  const handleCreateNewCloset = () => {
    window.location = "/create-new-closet";
  };

  const handleEnterNewItem = () => {
    window.location = "/add-new-item";
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location = "/Login";
  };

  const handleShowWearables = () => {
    window.location = "/show-all-wearable";
  };

  const handleKnowYourTaste = () => {
    window.location = "/know-your-taste";
  };

  return (
    <div className="dashboard-container">
      <div className="image-container">
        <img src={dashboardImage} alt="Closet Manager" className="dashboard-image" />
      </div>

      

      <div className="button-group-dashboard">
        <div className="row">
          <button onClick={handleCreateNewCloset}>Add New Closet</button>
          <button onClick={handleGenerateCombination}>Generate Combination</button>
          <button onClick={handleEnterNewItem}>Add New Item</button>
        </div>
        <div className="row">
          <button onClick={handleShowWearables}>Show All Wearables</button>
          <button onClick={handleKnowYourTaste}>Know Your Taste</button>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
