import React, { useState, useEffect } from 'react';
import styles from './ShowWearable.css'; // Importing the CSS module

const ShowAllWearables = () => {
  const [closets, setClosets] = useState([]);
  const [visibleClosetId, setVisibleClosetId] = useState(null); // State to track which closet's wearables are visible
  const [wearables, setWearables] = useState([]); // State to hold all wearables data
  const [showConfirmation, setShowConfirmation] = useState(false); // State to manage confirmation modal
  const [selectedWearable, setSelectedWearable] = useState(null); // State to hold the selected wearable for removal

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
        setShowConfirmation(false); // Close the modal after removal
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

  // Open confirmation modal
  const openConfirmationModal = (wearableId) => {
    setSelectedWearable(wearableId);
    setShowConfirmation(true);
  };

  // Close confirmation modal
  const closeConfirmationModal = () => {
    setShowConfirmation(false);
    setSelectedWearable(null);
  };

  return (
    <div className="closet-dropdown-container">
      {/* Add Item button */}
      <button className="add-item-button" onClick={() => window.location = "/add-new-item"}>
        افزودن پوشاک
      </button>
      <button className="add-item-button" onClick={() => window.location = "/create-new-closet"}>
        افزدون کمد
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
                        onClick={() => openConfirmationModal(item.id)}
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

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="confirmation-modal">
          <div className="confirmation-content">
            <p>آیا از حذف این مورد اطمینان دارید؟</p>
            <button className="confirm-yes" onClick={() => handleRemoveWearable(selectedWearable)}>بله</button>
            <button className="confirm-no" onClick={closeConfirmationModal}>خیر</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowAllWearables;
