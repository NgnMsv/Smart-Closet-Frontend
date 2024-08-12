import React from 'react';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './Dashboard.css'; // Import your CSS

const Dashboard = (props) => { // Change to a functional component structure similar to Login
//   const navigate = useNavigate(); // Initialize useNavigate

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
    // navigate('/'); // Redirect to the login page
  };

  return (
    <div className="dashboard-container">
      <h2 >Welcome to Your Dashboard</h2>
      <div className="button-container">
        <button onClick={handleGenerateCombination}>Generate Random Combination</button>
        <button onClick={handleCreateNewCloset}>Create New Closet</button>
        <button onClick={handleEnterNewItem}>Enter New Item</button>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    </div>
  );
}

export default Dashboard;
