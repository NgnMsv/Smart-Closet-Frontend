import React from 'react';
import './Dashboard.css'; // Import your CSS

const Dashboard = () => {

  const handleGenerateCombination = () => {
    console.log('Generate random combination');
  };

  const handleCreateNewCloset = () => {
    console.log('Create new closet');
  };

  const handleEnterNewItem = () => {
    console.log('Enter new item');
  };

  const handleLogout = () => {
    console.log('Logout');
    // Add your logout logic here
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
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
