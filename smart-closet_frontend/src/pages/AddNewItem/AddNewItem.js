import React, { useState, useEffect } from 'react';
import './AddNewItem.css';

const AddItem = () => {
  const [closets, setClosets] = useState([]);
  const [selectedCloset, setSelectedCloset] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSecondCategory, setSelectedSecondCategory] = useState(''); // State for second category
  const [selectedType, setSelectedType] = useState('');
  const [file, setFile] = useState(null);
  const [popupMessage, setPopupMessage] = useState(''); // State to control the popup message
  const [showPopup, setShowPopup] = useState(false); // State to control the visibility of the popup

  // Fetch the list of closets from the API
  useEffect(() => {
    const fetchClosets = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:8000/api/closets/', {
          headers: {'Authorization': `Bearer ${token}`}
        });
        if (!response.ok) {
          throw new Error('Failed to fetch closets');
        }
        const data = await response.json();
        setClosets(data);
      } catch (error) {
        console.error('Error fetching closets:', error);
      }
    };

    fetchClosets();
  }, []);

  const handleClosetChange = (event) => {
    setSelectedCloset(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSecondCategoryChange = (event) => {
    setSelectedSecondCategory(event.target.value);
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Ensure all required fields are selected
    if (!selectedCloset || !selectedCategory || !selectedSecondCategory || !selectedType || !file) {
      setPopupMessage('Please fill in all required fields.');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }

    // Create FormData object for file upload
    const formData = new FormData();
    formData.append('closet', selectedCloset); // Closet ID
    formData.append('color', selectedCategory); // Assuming color is equivalent to category
    formData.append('type', selectedType); // Type of wearable
    formData.append('image', file); // The file to be uploaded
    formData.append('usage_1', selectedCategory.charAt(0)); // Sample usage field for first category
    formData.append('usage_2', selectedSecondCategory.charAt(0)); // Sample usage field for second category
    formData.append('accessible', true); // Boolean field for accessibility

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/wearables/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        setPopupMessage('Operation failed');
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
        return;
      }

      setPopupMessage('Item added successfully');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (error) {
      setPopupMessage('Operation failed');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    }
  };

  return (
    <div className="add-item-container">
      <form className="item-form" onSubmit={handleSubmit}>
        <div className="dropdown-menu">
          <label htmlFor="closet-select">Closet:</label>
          <select 
            id="closet-select" 
            value={selectedCloset} 
            onChange={handleClosetChange}
            required
          >
            <option value="" disabled hidden>Please choose a closet</option>
            {closets.map((closet) => (
              <option key={closet.id} value={closet.id}>
                {closet.name}
              </option>
            ))}
          </select>
        </div>

        <div className="dropdown-menu">
          <label htmlFor="category-select">category1:</label>
          <select 
            id="category-select" 
            value={selectedCategory} 
            onChange={handleCategoryChange}
            required
          >
            <option value="" disabled hidden>?</option>
            <option value="f">Formal</option>
            <option value="c">Casual</option>
            <option value="s">Sport</option>
            <option value="g">General</option>
          </select>
        </div>

        <div className="dropdown-menu">
          <label htmlFor="second-category-select">category2:</label>
          <select 
            id="second-category-select" 
            value={selectedSecondCategory} 
            onChange={handleSecondCategoryChange}
            required
          >
            <option value="" disabled hidden>?</option>
            <option value="f">Formal</option>
            <option value="c">Casual</option>
            <option value="s">Sport</option>
            <option value="g">General</option>
          </select>
        </div>

        <div className="dropdown-menu">
          <label htmlFor="type-select">Type:</label>
          <select 
            id="type-select" 
            value={selectedType} 
            onChange={handleTypeChange}
            required
          >
            <option value="" disabled hidden>?</option>
            <option value="s">Shirt</option>
            <option value="p">Pants</option>
            <option value="f">Footwear</option>
          </select>
        </div>

        <div className="file-input-container">
          <input type="file" id="file-input" onChange={handleFileChange} required />
        </div>

        <button type="submit" className="add-button">Add Item</button>
      </form>

      {showPopup && (
        <div className="popup">
          <p>{popupMessage}</p>
        </div>
      )}
    </div>
  );
};

export default AddItem;