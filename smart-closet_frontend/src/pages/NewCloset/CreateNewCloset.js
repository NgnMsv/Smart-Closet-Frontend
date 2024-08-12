import React, { useState } from 'react';
import './CreateNewCloset.css'; // Import your CSS
// import { useNavigate } from 'react-router-dom'; // Assuming you'll use this for navigation later

const CreateNewCloset = () => {
  const [name, setName] = useState('');
  const closets = Array.from({ length: 10 }, (_, i) => `Closet ${i + 1}`);
//   const navigate = useNavigate(); // Hook for navigation

  const handleAdd = () => {
    console.log('Adding closet with name:', name);
    // Add your API call or logic to handle adding the closet here
  };

  const handleClosetClick = (closet) => {
    console.log(`${closet} clicked`);
    // You can add your API call here or navigate to another page
    // Example: navigate(`/closet/${closet}`);
  };

  return (
    <div className="create-closet-container">
      {/* Left side menu */}
      <div className="closet-menu">
        {closets.map((closet, index) => (
          <button 
            key={index} 
            className="closet-button" 
            onClick={() => handleClosetClick(closet)}
          >
            {closet}
          </button>
        ))}
      </div>

      {/* Right side form */}
      <div className="closet-form">
        <input
          type="text"
          placeholder="Enter closet name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="closet-input"
        />
        <button onClick={handleAdd} className="add-button">Add</button>
      </div>
    </div>
  );
};

export default CreateNewCloset;
