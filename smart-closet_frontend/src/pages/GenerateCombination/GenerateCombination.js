import React, { useState } from 'react';
import './GenerateCombination.css'; // Import your CSS

const GenerateCombination = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [shirtImage, setShirtImage] = useState(''); // State for shirt image URL
  const [pantsImage, setPantsImage] = useState(''); // State for pants image URL
  const [footwearImage, setFootwearImage] = useState(''); // State for footwear image URL
  const [combinationId, setCombinationId] = useState(null); // Store the combination ID
  const [showPopup, setShowPopup] = useState(false); // State to manage pop-up visibility
  const [popupMessage, setPopupMessage] = useState(''); // State to manage pop-up message
  const [showYesNoButtons, setShowYesNoButtons] = useState(false); // Show Yes/No buttons
  const [showDropdown, setShowDropdown] = useState(true); // Show dropdown initially
  const [showTakeItButtons, setShowTakeItButtons] = useState(false); // New state to show "Yes I take it" and "Generate again" buttons
  const [likeText, setLikeText] = useState('Do You Like It?'); // State for changing text

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    console.log('Selected category:', event.target.value);
  };

  const handleYesClick = async () => {
    console.log('Yes clicked');
    await updateCombinationLabel(true); // Set label to true when Yes is clicked
    setLikeText('Do You Take It?'); // Change text to "Do you take it?"
    setShowYesNoButtons(false); // Hide Yes/No buttons
    setShowTakeItButtons(true); // Show "Yes I take it" and "Generate again" buttons
  };

  const handleNoClick = async () => {
    console.log('No clicked');
    await updateCombinationLabel(false); // Set label to false when No is clicked
    resetStateAfterFeedback('Thanks for Your Feedback!');
    setShowYesNoButtons(false);
  };

  const handleTakeItClick = async () => {
    console.log('Yes I take it clicked');
    
    try {
      // Fetch the combination details using the combination ID
      const response = await fetch(`http://localhost:8000/api/combinations/${combinationId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch combination details');
      }

      const combination = await response.json();
      
      // Extract shirt, pants, and footwear from the combination
      const { shirt, pants, footwear } = combination;

      // Update each item to set accessible to false
      await Promise.all([
        updateWearableAccessibility(shirt.id, false),
        updateWearableAccessibility(pants.id, false),
        updateWearableAccessibility(footwear.id, false)
      ]);

      resetStateAfterFeedback('Great Choice! Items are now inaccessible.');
    } catch (error) {
      console.error('Error making items inaccessible:', error);
      setPopupMessage('Error updating item accessibility');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000); // Hide pop-up after 3 seconds
    }
  };

  // Helper function to update the accessibility of a wearable item
  const updateWearableAccessibility = async (wearableId, accessible) => {
    const response = await fetch(`http://localhost:8000/api/wearables/${wearableId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify({ accessible }),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Failed to update wearable item ${wearableId}`);
    }

    console.log(`Wearable item ${wearableId} updated to accessible: ${accessible}`);
  };

  const handleGenerateAgainClick = () => {
    console.log('Generate again clicked');
    resetStateAfterFeedback('Generating a new combination...');
  };

  const resetStateAfterFeedback = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      setShowTakeItButtons(false); // Hide "Yes I take it" and "Generate again" buttons
      setLikeText('Do You Like It?'); // Reset text to "Do you like it?"
      setShowDropdown(true); // Show Dropdown again
    }, 1000); // Hide pop-up after 1 second
  };

  const handleGenerateClick = async () => {
    if (!selectedCategory) {
      setPopupMessage('Please choose a category');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 1000); // Hide pop-up after 2 seconds
      return;
    }

    console.log('Generate clicked');
    try {
      const response = await fetch('http://localhost:8000/api/combinations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        credentials: 'include', // This will send cookies, if any, with the request
        body: JSON.stringify({ category: selectedCategory }) // Send selected category
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

        setShowDropdown(false); // Hide dropdown
        setShowYesNoButtons(true); // Show Yes/No buttons

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
        <div className="popup-overlay">
          <div className="popup-content">
            <p>{popupMessage}</p>
          </div>
        </div>
      )}

      {showDropdown && (
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
          <span className="like-text">{likeText}</span>
          <button className="yes-button" onClick={handleYesClick}>Yes</button>
        </div>
      )}

      {showTakeItButtons && (
        <div className="button-container">
          <button className="yes-button" onClick={handleTakeItClick}>Yes I Take It</button>
          <button className="no-button" onClick={handleGenerateAgainClick}>Generate Again</button>
        </div>
      )}
    </div>
  );
};

export default GenerateCombination;
