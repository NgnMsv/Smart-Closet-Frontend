import React, { useState } from 'react';
//import './KnowYourTaste.css';

const KnowYourTaste = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [popupMessage, setPopupMessage] = useState(''); // State for pop-up message
  const [showPopup, setShowPopup] = useState(false); // State to control pop-up visibility

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    console.log('Selected category:', event.target.value);
  };

  const handleYesClick = () => {
    console.log('Yes clicked');
    setPopupMessage('Great Choice!');
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000); // Hide pop-up after 3 seconds
  };

  const handleNoClick = () => {
    console.log('No clicked');
    setPopupMessage('Thanks for Your Feedback!');
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000); // Hide pop-up after 3 seconds
  };

  const handleGenerateClick = async () => {
    console.log('Generate clicked');
    try {
      const response = await fetch('http://localhost:8000/api/combinations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ /* Any data you want to send in the body, if required */ }),
        credentials: 'include' // This will send cookies, if any, with the request
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Combination generated:', data);
        // Handle the response data
      } else {
        console.error('Failed to generate combination');
        // Handle errors, e.g., show an error message
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle network errors, etc.
    }
  };

  return (
    <div className="combination-container">
      {showPopup && (
        <div className="popup">
          <p>{popupMessage}</p>
        </div>
      )}

      <div className="dropdown-menu">
        <label htmlFor="category-select">Choose a category:</label>
        <select 
          id="category-select" 
          value={selectedCategory} 
          onChange={handleCategoryChange}
        >
          <option value="" disabled hidden> Please choose an option </option>
          <option value="formal">Formal</option>
          <option value="casual">Casual</option>
          <option value="sport">Sport</option>
          <option value="general">General</option>
        </select>
        <button className="generate-button" onClick={handleGenerateClick}>Generate</button>
      </div>

      <div className="image-container">
        <div className="image-box">Shirt</div>
        <div className="image-box">Pants</div>
        <div className="image-box">FootWear</div>
      </div>

      <div className="button-container">
        <button className="no-button" onClick={handleNoClick}>No</button>
        <span className="like-text">Do You Like It?</span>
        <button className="yes-button" onClick={handleYesClick}>Yes</button>
      </div>
    </div>
  );
};

export default KnowYourTaste;
