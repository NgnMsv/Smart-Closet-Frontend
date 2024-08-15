import React, { useState, useEffect } from 'react';
import './CreateNewCloset.css';
// import { useNavigate } from 'react-router-dom'; // Uncomment if navigation is needed

const CreateNewCloset = () => {
  const [name, setName] = useState('');
  const [closets, setClosets] = useState([]);
  const [visibleClosetId, setVisibleClosetId] = useState(null); // State to track which closet's wearables are visible
  const [wearables, setWearables] = useState([]); // State to hold all wearables data

  // const navigate = useNavigate(); // Hook for navigation

  // Fetch the list of closets and wearables when the component mounts
  useEffect(() => {
    const fetchClosetsAndWearables = async () => {
      try {
        const token = localStorage.getItem('access_token');

        // Fetch closets
        const closetsResponse = await fetch('http://localhost:8000/api/closets/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (!closetsResponse.ok) {
          throw new Error('Failed to fetch closets');
        }
        const closetsData = await closetsResponse.json();
        setClosets(closetsData);

        // Fetch wearables
        const wearablesResponse = await fetch('http://localhost:8000/api/wearables/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (!wearablesResponse.ok) {
          throw new Error('Failed to fetch wearables');
        }
        const wearablesData = await wearablesResponse.json();
        setWearables(wearablesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchClosetsAndWearables();
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
    // Toggle the visibility of the clicked closet's wearables
    setVisibleClosetId(visibleClosetId === closet.id ? null : closet.id);

  };

  const getWearablesForCloset = (closetId) => {
    return wearables.filter(wearable => wearable.closet === closetId);
  };

  return (
    <div className="create-closet-container">
      {/* Left side menu */}
      <div className="closet-menu">
        {closets.map((closet) => (
          <div key={closet.id}>
            <button 
              className="closet-button" 
              onClick={() => handleClosetClick(closet)}
            >
              {closet.name}
            </button>
            {visibleClosetId === closet.id && (
              <ul className="wearables-dropdown">
                {getWearablesForCloset(closet.id).map((item) => (
                  <li key={item.id}>{item.color}</li>
                ))}
              </ul>
            )}
          </div>
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
