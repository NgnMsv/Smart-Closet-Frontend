import React, { useEffect, useState } from 'react';
import './Dashboard.css'; // Import your CSS

const Dashboard = () => {
  const [wearables, setWearables] = useState([]);
  const [showWearables, setShowWearables] = useState(false);

  useEffect(() => {
    // Check if the access_token is in localStorage
    const token = localStorage.getItem('access_token');
    if (!token) {
      // If the token is not found, redirect to the login page
      console.log('No access token found, redirecting to login page');
      window.location = "/Login";
    }
  }, []); // Empty dependency array means this effect runs once on mount

  const handleGenerateCombination = () => {
    console.log('Leading to Generate random combination Page');
    window.location = "/generate-combination";
  };

  const handleCreateNewCloset = () => {
    console.log('Create new closet');
    window.location = "/create-new-closet";
  };

  const handleEnterNewItem = () => {
    console.log('Enter new item');
    window.location = "/add-new-item";
  };

  const handleLogout = () => {
    console.log('Logout');
    // Clear the localStorage and redirect to login page
    localStorage.clear();
    window.location = "/Login";
  };

  const handleShowWearables = () => {
    window.location = "/show-all-werable";
  };

  const handleKnowYourTaste = () => {
    console.log('Know Your Taste');
    window.location = "/know-your-taste"; // Add the appropriate route
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome to Your Dashboard</h2>
      <div className="button-group">
        <div className="row">
          <button onClick={handleCreateNewCloset}>Add New Closet</button>
          <button onClick={handleGenerateCombination}>Generate Combination</button>
        </div>
        <div className="row">
          <button onClick={handleEnterNewItem}>Add New Item</button>
          <button onClick={handleShowWearables}>Show All Wearables</button>
        </div>
        <div className="row">
          <button onClick={handleKnowYourTaste}>Know Your Taste</button>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>

      {showWearables && (
        <div className="wearables-list">
          <h3>All Wearables</h3>
          <ul>
            {wearables.map((wearable) => (
              <li key={wearable.id} style={{ display: 'flex', alignItems: 'center' }}>
                {wearable.type}: 
                <div 
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: wearable.color,
                    marginLeft: '10px',
                    marginRight: '10px',
                    border: '1px solid #000'
                  }}
                />
                ({wearable.usage_1}, {wearable.usage_2})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
