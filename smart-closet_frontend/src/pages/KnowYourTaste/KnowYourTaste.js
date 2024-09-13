import React, { useState } from 'react';
import styles from './GenerateCombination.css'; // Importing the CSS module

const KnowYourTaste = () => {
  const [popupMessage, setPopupMessage] = useState(''); // State for pop-up message
  const [showPopup, setShowPopup] = useState(false); // State to control pop-up visibility
  const [shirtImage, setShirtImage] = useState(''); // State for shirt image URL
  const [pantsImage, setPantsImage] = useState(''); // State for pants image URL
  const [footwearImage, setFootwearImage] = useState(''); // State for footwear image URL
  const [showYesNoButtons, setShowYesNoButtons] = useState(false); // Show Yes/No buttons
  const [showGenerateButton, setShowGenerateButton] = useState(true); // Show Generate button
  const [combinationId, setCombinationId] = useState(null); // Store the combination ID

  const handleYesClick = async () => {
    console.log('Yes clicked');
    await updateCombinationLabel(true); // Set label to true when Yes is clicked
    resetStateAfterFeedback('Great Choice!');
  };

  const handleNoClick = async () => {
    console.log('No clicked');
    await updateCombinationLabel(false); // Set label to false when No is clicked
    resetStateAfterFeedback('Thanks for Your Feedback!');
  };

  const resetStateAfterFeedback = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      setShowYesNoButtons(false); // Hide Yes/No buttons
      setShowGenerateButton(true); // Show Generate button again
    }, 1000); // Hide pop-up after 3 seconds
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
        credentials: 'include' // This will send cookies, if any, with the request
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Combination generated:', data);

        // Store the combination ID for later use
        setCombinationId(data.id);

        // Assuming the API returns an object with the image URLs
        setShirtImage(data.shirt.image_url);
        setPantsImage(data.pants.image_url);
        setFootwearImage(data.footwear.image_url);

        setShowGenerateButton(false); // Hide Generate button
        setShowYesNoButtons(true);    // Show Yes/No buttons

      } else {
        console.error('Failed to generate combination');
        setPopupMessage('Failed to generate combination');
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000); // Hide pop-up after 2 seconds
      }
    } catch (error) {
      console.error('Error:', error);
      setPopupMessage('Error generating combination');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000); // Hide pop-up after 2 seconds
    }
  };

  const updateCombinationLabel = async (labelValue) => {
    if (!combinationId) return; // Do nothing if there's no combination ID

    try {
      const response = await fetch(`http://localhost:8000/api/combinations/${combinationId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ label: labelValue }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to update combination label');
      }

      console.log(`Combination label updated to: ${labelValue}`);
    } catch (error) {
      console.error('Error updating label:', error);
      setPopupMessage('Error updating combination label');
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

      {showGenerateButton && (
        <div className="generate-button-container">
          <button
            className="generate-button"
            onClick={handleGenerateClick}
          >
            Generate
          </button>
        </div>
      )}

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

      {showYesNoButtons && (
        <div className="button-container">
          <button className="no-button" onClick={handleNoClick}>No</button>
          <span className="like-text">Do You Like It?</span>
          <button className="yes-button" onClick={handleYesClick}>Yes</button>
        </div>
      )}
    </div>
  );
};

export default KnowYourTaste;
