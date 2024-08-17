import React, { useState, useEffect } from 'react';
import './ShowWearable.css';

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

  const handleClosetClick = (closet) => {
    // Toggle the visibility of the clicked closet's wearables
    setVisibleClosetId(visibleClosetId === closet.id ? null : closet.id);
  };

  const getWearablesForCloset = (closetId) => {
    return wearables.filter(wearable => wearable.closet === closetId);
  };

  return (
    <div className="closet-dropdown-container">
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
                <li key={item.id} className="wearable-item">{item.color}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default ShowAllWearables;
