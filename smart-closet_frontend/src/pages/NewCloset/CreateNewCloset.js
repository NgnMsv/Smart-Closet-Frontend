import React, { useState, useEffect } from 'react';
import './CreateNewCloset.css';
// import { useNavigate } from 'react-router-dom'; // Uncomment if navigation is needed

const CreateNewCloset = () => {
  const [name, setName] = useState('');
  const [closets, setClosets] = useState([]);
  // const navigate = useNavigate(); // Hook for navigation

  // Fetch the list of closets when the component mounts
  useEffect(() => {
    const fetchClosets = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:8000/api/closets/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }}
        );
        if (!response.ok) {
          throw new Error('Failed to fetch closets');
        }
        const data = await response.json();
        setClosets(data);
      } catch (error) {
        console.error('Error fetching closets:', error);
      }
    };

    fetchClosets();
  }, []);

  const handleAdd = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/closets/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        window.location = "/Login"
        throw new Error('Failed to add closet');
      }
      const newCloset = await response.json();
      setClosets([...closets, newCloset]); // Update the closet list with the newly added closet
      setName(''); // Clear the input field after adding
    } catch (error) {
      console.error('Error adding closet:', error);
    }
  };

  const handleClosetClick = (closet) => {
    console.log(`${closet.name} clicked`);
    // You can add your API call here or navigate to another page
    // Example: navigate(`/closet/${closet.id}`);
  };

  return (
    <div className="create-closet-container">
      {/* Left side menu */}
      <div className="closet-menu">
        {closets.map((closet) => (
          <button 
            key={closet.id} 
            className="closet-button" 
            onClick={() => handleClosetClick(closet)}
          >
            {closet.name}
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
