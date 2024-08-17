import React, { useState } from 'react';
import './GenerateCombination.css'; // Import your CSS

const GenerateCombination = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showPopup, setShowPopup] = useState(false); // State to manage pop-up visibility
  const [popupMessage, setPopupMessage] = useState(''); // State to manage pop-up message

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    console.log('Selected category:', event.target.value);
    // Later, you'll use this category to fetch images from an API
  };

  const handleYesClick = async () => {
    console.log('Yes clicked');
    // Implement the logic for the Yes button
    window.location = "/check-if-liked";
  };

  const handleNoClick = () => {
    console.log('No clicked');
    setPopupMessage('New set generated'); // Set the pop-up message
    setShowPopup(true); // Show the pop-up

    setTimeout(() => {
      setShowPopup(false); // Hide the pop-up after 3 seconds
      // Implement any additional logic for "No" button click, such as generating a new set
    }, 1000); // 3 seconds delay
  };

  const handleGenerateClick = async () => {
    console.log('Generate clicked');
    // Implement the logic to generate combinations based on the selected category
    try {
      const response = await fetch('http://localhost:8000/api/combinations/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          },
          body: JSON.stringify({
              // Any data you want to send in the body, if required
          }),
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
        <div className="popup-overlay">
          <div className="popup-content">
            <p>{popupMessage}</p>
          </div>
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

export default GenerateCombination;
