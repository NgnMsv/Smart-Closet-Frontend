import React from 'react';
import './Dashboard.css'; // Import your CSS


const Dashboard = () => {

  const handleGenerateCombination = async () => {
    console.log('Leading to Generate random combination Page');
    window.location = "/generate-combination"
  };

  const handleCreateNewCloset = async () => {
    console.log('Create new closet');
    window.location = "/create-new-closet"
  };

  const handleEnterNewItem = () => {
    console.log('Enter new item');
    window.location = "/add-new-item"
  };

  const handleLogout = () => {
    console.log('Logout');
    // Add your logout logic here
    window.location = "/Login"
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
