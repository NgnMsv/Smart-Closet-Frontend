import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateNewCloset.css';

const CreateNewCloset = () => {
  const [name, setName] = useState('');
  const [closets, setClosets] = useState([]);
  const [visibleClosetId, setVisibleClosetId] = useState(null); // State to track which closet's wearables are visible
  const [wearables, setWearables] = useState([]); // State to hold all wearables data

  const navigate = useNavigate(); // Hook for navigation

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
        throw new Error('تلاش برای به‌روزرسانی توکن با شکست مواجه شد');
      }
      const data = await response.json();
      localStorage.setItem('access_token', data.access);
      return data.access;
    } catch (error) {
      console.error('خطا در به‌روزرسانی توکن:', error);
      // Optionally redirect to login page if refresh fails
      window.location = "/Login";
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
          throw new Error('دریافت لیست کمدها با شکست مواجه شد');
        }
        const closetsData = await closetsResponse.json();
        setClosets(closetsData);

        const wearablesResponse = await fetchWithAuth('http://localhost:8000/api/wearables/');
        if (!wearablesResponse.ok) {
          throw new Error('دریافت لیست پوشاک با شکست مواجه شد');
        }
        const wearablesData = await wearablesResponse.json();
        setWearables(wearablesData);
      } catch (error) {
        console.error('خطا در دریافت اطلاعات:', error);
      }
    };

    fetchClosetsAndWearables();
  }, []);

  const handleAdd = async () => {
    try {
      const response = await fetchWithAuth('http://localhost:8000/api/closets/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        throw new Error('افزودن کمد با شکست مواجه شد');
      }
      const newCloset = await response.json();
      setClosets([...closets, newCloset]); // Update the closet list with the newly added closet
      setName(''); // Clear the input field after adding
    } catch (error) {
      console.error('خطا در افزودن کمد:', error);
    }
  };

  const handleClosetClick = (closet) => {
    // Toggle the visibility of the clicked closet's wearables
    setVisibleClosetId(visibleClosetId === closet.id ? null : closet.id);
  };

  const getWearablesForCloset = (closetId) => {
    return wearables.filter(wearable => wearable.closet === closetId);
  };

  const handleBackClick = () => {
    navigate('/Dashboard'); // Navigate back to the dashboard
  };

  return (

    <div className="create-closet-container">
      <div className="closet-form">
        <input
          type="text"
          placeholder="نام کمد را وارد کنید"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="closet-input"
        />
        <button onClick={handleAdd} className="add-button">افزودن</button>
      </div>
      {/* منوی سمت چپ */}
      <div className="closet-menu">
        {closets.map((closet) => (
          <div key={closet.id} className="closet-dropdown-wrapper">
            <div className="closet-header">
              <button 
                className="closet-button" 
                onClick={() => handleClosetClick(closet)}
              >
                {closet.name}
              </button>
            </div>
            {/* نگه‌داشتن دکمه کمد قابل مشاهده و نمایش پوشاک زیر آن */}
            {visibleClosetId === closet.id && (
              <ul className="wearables-dropdown">
                {getWearablesForCloset(closet.id).map((item) => (
                  <li key={item.id}>
                    {item.image_url && (
                      <div className="wearable-item">
                        <img 
                          src={item.image_url} 
                          alt={`پوشاک به رنگ ${item.color}`} 
                          className="wearable-image"
                        />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateNewCloset;
