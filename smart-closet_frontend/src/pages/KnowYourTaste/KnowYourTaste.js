import React, { useState } from 'react';

const KnowYourTaste = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [popupMessage, setPopupMessage] = useState(''); // State for pop-up message
  const [showPopup, setShowPopup] = useState(false); // State to control pop-up visibility
  const [shirtImage, setShirtImage] = useState(''); // State for shirt image URL
  const [pantsImage, setPantsImage] = useState(''); // State for pants image URL
  const [footwearImage, setFootwearImage] = useState(''); // State for footwear image URL

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
        body: JSON.stringify({ category: selectedCategory }), // Sending selected category
        credentials: 'include' // This will send cookies, if any, with the request
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Combination generated:', data);

        // Assuming the API returns an object with the image URLs
        setShirtImage(data.shirt.image_url);
        setPantsImage(data.pants.image_url);
        setFootwearImage(data.footwear.image_url);

      } else {
        console.error('Failed to generate combination');
        setPopupMessage('Failed to generate combination');
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000); // Hide pop-up after 3 seconds
      }
    } catch (error) {
      console.error('Error:', error);
      setPopupMessage('Error generating combination');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000); // Hide pop-up after 3 seconds
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
        <div className="image-box">
          {shirtImage ? <img src={shirtImage} alt="Shirt" /> : 'Shirt'}
        </div>
        <div className="image-box">
          {pantsImage ? <img src={pantsImage} alt="Pants" /> : 'Pants'}
        </div>
        <div className="image-box">
          {footwearImage ? <img src={footwearImage} alt="Footwear" /> : 'Footwear'}
        </div>
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
