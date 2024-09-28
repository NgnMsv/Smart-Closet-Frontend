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
    console.log('بله کلیک شد');
    await updateCombinationLabel(true); // Set label to true when Yes is clicked
    resetStateAfterFeedback('انتخاب عالی!', true);
    handleGenerateClick(); // Automatically generate a new combination
  };

  const handleNoClick = async () => {
    console.log('خیر کلیک شد');
    await updateCombinationLabel(false); // Set label to false when No is clicked
    resetStateAfterFeedback('ممنون از بازخورد شما!', true);
    handleGenerateClick(); // Automatically generate a new combination
  };

  const resetStateAfterFeedback = (message, keepButtonsVisible = false) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      if (!keepButtonsVisible) {
        setShowYesNoButtons(false); // Hide Yes/No buttons
        setShowGenerateButton(true); // Show Generate button again
      }
    }, 1000); // Hide pop-up after 1 second
  };

  const handleGenerateClick = async () => {
    console.log('تولید کلیک شد');
    const startTime = new Date();

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
        console.log('ترکیب تولید شد:', data);
        const endTime = new Date();
        const timeTaken = endTime - startTime; // Time in milliseconds
        // console.log(`Time taken for the operation: ${timeTaken} ms`);

        // Store the combination ID for later use
        setCombinationId(data.id);

        // Assuming the API returns an object with the image URLs
        setShirtImage(data.shirt.image_url);
        setPantsImage(data.pants.image_url);
        setFootwearImage(data.footwear.image_url);

        setShowGenerateButton(false); // Hide Generate button
        setShowYesNoButtons(true);    // Show Yes/No buttons

      } else {
        console.error('تولید ترکیب شکست خورد');
        setPopupMessage('تولید ترکیب شکست خورد');
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000); // Hide pop-up after 2 seconds
      }
    } catch (error) {
      console.error('خطا:', error);
      setPopupMessage('خطا در تولید ترکیب');
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
        throw new Error('بروزرسانی برچسب ترکیب شکست خورد');
      }

      console.log(`برچسب ترکیب به‌روزرسانی شد: ${labelValue}`);
    } catch (error) {
      console.error('خطا در به‌روزرسانی برچسب:', error);
      setPopupMessage('خطا در به‌روزرسانی برچسب ترکیب');
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
            تولید
          </button>
        </div>
      )}

      <div className="image-container">
        <div className="image-box">
          {shirtImage ? <img src={shirtImage} alt="پیراهن" /> : 'پیراهن'}
        </div>
        <div className="image-box">
          {pantsImage ? <img src={pantsImage} alt="شلوار" /> : 'شلوار'}
        </div>
        <div className="image-box">
          {footwearImage ? <img src={footwearImage} alt="کفش" /> : 'کفش'}
        </div>
      </div>

      {showYesNoButtons && (
        <div className="button-container">
          <button className="yes-button" onClick={handleYesClick}>بله</button>
          <span className="like-text">آیا می‌پسندید؟</span>
          <button className="no-button" onClick={handleNoClick}>خیر</button>
        </div>
      )}
    </div>
  );
};

export default KnowYourTaste;
