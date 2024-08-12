import React, { useState } from 'react';
import './GenerateCombination.css'; // Import your CSS

const GenerateCombination = () => {
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    console.log('Selected category:', event.target.value);
    // Later, you'll use this category to fetch images from an API
  };

  const handleYesClick = () => {
    console.log('Yes clicked');
    // Implement the logic for the Yes button
  };

  const handleNoClick = () => {
    console.log('No clicked');
    // Implement the logic for the No button
  };

  const handleGenerateClick = () => {
    console.log('Generate clicked');
    // Implement the logic to generate combinations based on the selected category
  };

  return (
    <div className="combination-container">
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
        <span className="like-text">Do You Like  It?</span>
        <button className="yes-button" onClick={handleYesClick}>Yes</button>
      </div>
    </div>
  );
};

export default GenerateCombination;
