import React, { useEffect, useState } from 'react';
// import styles from './Dashboard.css'; // Importing the CSS module
import styles from './Dashboard.module.css';

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
    window.location = "/show-all-werable";
  };

  const handleKnowYourTaste = () => {
    window.location = "/know-your-taste";
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome to Your Dashboard</h2>
      <div className="button-group">
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
