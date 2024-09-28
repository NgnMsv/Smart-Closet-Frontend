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
  const [showTakeItButtons, setShowTakeItButtons] = useState(false); // Show "Yes I take it" and "Generate again" buttons
  const [likeText, setLikeText] = useState('آیا این ترکیب را می‌پسندید؟'); // State for changing text

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    console.log('Selected category:', event.target.value);
  };

  const handleYesClick = async () => {
    console.log('Yes clicked');
    
    // Set label to true when Yes is clicked
    await updateCombinationLabel(true);
  
    // Update text to "Do You Take It?"
    setLikeText('آیا این ترکیب را از کمد خارج می‌کنید؟');
  
    // Hide Yes/No buttons and show "Yes I take it" and "Generate again" buttons
    setShowYesNoButtons(false); 
    setShowTakeItButtons(true);
  };
  
  const handleNoClick = async () => {
    console.log('No clicked');
    await updateCombinationLabel(false); // Set label to false when No is clicked
    resetStateAfterFeedback('از بازخورد شما سپاسگزاریم!');
    setShowYesNoButtons(false);
  };

  const handleTakeItClick = async () => {
    console.log('Yes I take it clicked');
    
    try {
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
      const { shirt, pants, footwear } = combination;

      await Promise.all([
        updateWearableAccessibility(shirt.id, false),
        updateWearableAccessibility(pants.id, false),
        updateWearableAccessibility(footwear.id, false)
      ]);

      resetStateAfterFeedback('انتخاب عالی! اقلام اکنون در دسترس نیستند.');
    } catch (error) {
      console.error('Error making items inaccessible:', error);
      setPopupMessage('خطا در بروزرسانی وضعیت دسترسی اقلام');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    }
  };

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
    resetStateAfterFeedback('در حال تولید یک ترکیب جدید...');
  };

  const resetStateAfterFeedback = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      setShowTakeItButtons(false); // Hide "Yes I take it" and "Generate again" buttons
      setLikeText('آیا این ترکیب را می‌پسندید؟'); // Reset text to "Do you like it?"
      setShowDropdown(true); // Show Dropdown again
    }, 1000);
  };

  const handleGenerateClick = async () => {
    if (!selectedCategory) {
      setPopupMessage('لطفا یک دسته‌بندی را انتخاب کنید');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 1000);
      return;
    }

    console.log('Generate clicked');
    const firstLetter = selectedCategory.charAt(0).toLowerCase();
    try {
      const response = await fetch(`http://localhost:8000/api/accurate-combination/${firstLetter}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        credentials: 'include',
        body: JSON.stringify({ category: selectedCategory })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Combination generated:', data);

        setCombinationId(data.id);
        setShirtImage(data.shirt.image_url);
        setPantsImage(data.pants.image_url);
        setFootwearImage(data.footwear.image_url);

        setShowDropdown(false); // Hide dropdown
        setShowYesNoButtons(true); // Show Yes/No buttons

      } else {
        console.error('Failed to generate combination');
        setPopupMessage('خطا در تولید ترکیب');
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000);
      }
    } catch (error) {
      console.error('Error:', error);
      setPopupMessage('خطا در تولید ترکیب');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    }
  };

  const updateCombinationLabel = async (labelValue) => {
    if (!combinationId) return;

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
      setPopupMessage('خطا در بروزرسانی برچسب ترکیب');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
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
          <label htmlFor="category-select">لطفاً یک دسته‌بندی انتخاب کنید</label>
          <select 
            id="category-select" 
            value={selectedCategory} 
            onChange={handleCategoryChange}
          >
            <option value="" disabled hidden>دسته‌بندی‌ها</option>
            <option value="formal">رسمی</option>
            <option value="casual">روزمره</option>
            <option value="sport">ورزشی</option>
            <option value="general">عمومی</option>
          </select>
          <button className="generate-button" onClick={handleGenerateClick}>تولید ترکیب</button>
        </div>
      )}

      <div className="image-container">
        <div className="image-box">
          {shirtImage ? <img src={shirtImage} alt="Shirt" /> : 'پیراهن'}
        </div>
        <div className="image-box">
          {pantsImage ? <img src={pantsImage} alt="Pants" /> : 'شلوار'}
        </div>
        <div className="image-box">
          {footwearImage ? <img src={footwearImage} alt="Footwear" /> : 'کفش'}
        </div>
      </div>

      {showYesNoButtons && (
  <div className="button-container">
    <button className="no-button" onClick={handleNoClick}>خیر</button>
    <span className="like-text">{likeText}</span>
    <button className="yes-button" onClick={handleYesClick}>بله</button>
  </div>
)}

{showTakeItButtons && (
  <div className="button-container">
    <button className="yes-button" onClick={handleTakeItClick}>بله، بر می‌دارم</button>
    <span className="like-text">{likeText}</span>
    <button className="no-button" onClick={handleGenerateAgainClick}>تولید مجدد</button>
  </div>
)}

    </div>
  );
};

export default GenerateCombination;
