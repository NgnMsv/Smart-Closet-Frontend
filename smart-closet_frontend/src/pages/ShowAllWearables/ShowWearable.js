import React, { useState, useEffect } from 'react';
import styles from './ShowWearable.css'; // Importing the CSS module

const ShowAllWearables = () => {
  const [closets, setClosets] = useState([]);
  const [visibleClosetId, setVisibleClosetId] = useState(null); // State to track which closet's wearables are visible
  const [wearables, setWearables] = useState([]); // State to hold all wearables data

  // Function to refresh access token
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    try {
      const response = await fetch('http://localhost:8000/auth/jwt/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
      const data = await response.json();
      localStorage.setItem('access_token', data.access);
      return data.access;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      window.location = "/Login"; // Optionally redirect to login page if refresh fails
    }
  };

  // Function to fetch with token handling
  const fetchWithAuth = async (url, options = {}) => {
    let token = localStorage.getItem('access_token');
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    };

    let response = await fetch(url, options);
    
    if (response.status === 401) {
      token = await refreshAccessToken(); // Attempt to refresh token
      if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
        response = await fetch(url, options); // Retry with new token
      }
    }

    return response;
  };

  // Fetch the list of closets and wearables when the component mounts
  useEffect(() => {
    const fetchClosetsAndWearables = async () => {
      try {
        const closetsResponse = await fetchWithAuth('http://localhost:8000/api/closets/');
        if (!closetsResponse.ok) {
          throw new Error('Failed to fetch closets');
        }
        const closetsData = await closetsResponse.json();
        setClosets(closetsData);

        const wearablesResponse = await fetchWithAuth('http://localhost:8000/api/wearables/');
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

  // Toggle the visibility of wearables for a specific closet
  const handleClosetClick = (closet) => {
    setVisibleClosetId(visibleClosetId === closet.id ? null : closet.id);
  };

  // Handle the removal of a wearable by setting accessible to false
  const handleRemoveWearable = async (wearableId) => {
    try {
      const response = await fetchWithAuth(`http://localhost:8000/api/wearables/${wearableId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessible: false }),
      });

      if (response.ok) {
        // Remove the wearable from the state after successful update
        setWearables(prevWearables => prevWearables.filter(wearable => wearable.id !== wearableId));
      } else {
        console.error('Failed to update wearable accessibility.');
      }
    } catch (error) {
      console.error('Error updating wearable:', error);
    }
  };

  const getWearablesForCloset = (closetId) => {
    return wearables.filter(wearable => wearable.closet === closetId && wearable.accessible);
  };

  return (
    <div className="closet-dropdown-container">
      {/* Add Item button */}
      <button className="add-item-button" onClick={() => window.location = "/add-new-item"}>
        Add Item
      </button>

      {closets.map((closet) => (
        <div key={closet.id} className="closet-item">
          <button 
            className="closet-button" 
            onClick={() => handleClosetClick(closet)}
          >
            {closet.name}
          </button>
          {visibleClosetId === closet.id && (
            <ul className="wearables-list">
              {getWearablesForCloset(closet.id).map((item) => (
                <li key={item.id} className="wearable-item">
                  {item.image_url && (
                    <div className="image-container">
                      <img 
                        src={item.image_url} 
                        alt={`${item.color} wearable`} 
                        className="wearable-image"
                      />
                      {/* Tiny X button to remove the wearable */}
                      <button 
                        className="remove-button" 
                        onClick={() => handleRemoveWearable(item.id)}
                      >
                        &times;
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default ShowAllWearables;
