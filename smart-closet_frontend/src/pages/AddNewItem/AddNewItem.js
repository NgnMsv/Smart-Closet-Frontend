import React, { useState } from 'react';
import './AddNewItem.css'; // Import your CSS

const AddItem = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    console.log('Selected category:', event.target.value);
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
    console.log('Selected type:', event.target.value);
  };

  return (
    <div className="add-item-container">
      <form className="item-form">
        <div className="dropdown-menu">
          <label htmlFor="category-select">Choose a category:</label>
          <select 
            id="category-select" 
            value={selectedCategory} 
            onChange={handleCategoryChange}
          >
            <option value="" disabled hidden>Please choose an option</option>
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
            <option value="sport">Sport</option>
            <option value="general">General</option>
          </select>
        </div>

        <div className="dropdown-menu">
          <label htmlFor="type-select">Choose a type:</label>
          <select 
            id="type-select" 
            value={selectedType} 
            onChange={handleTypeChange}
          >
            <option value="" disabled hidden>Please choose an option</option>
            <option value="shirt">Shirt</option>
            <option value="pants">Pants</option>
            <option value="footwear">Footwear</option>
          </select>
        </div>

        <div className="file-input-container">
          <input type="file" id="file-input" />
        </div>

        <div className="image-preview-container">
          <div className="image-preview placeholder">Image Preview</div>
        </div>

        <button type="submit" className="add-button">Add Item</button>
      </form>
    </div>
  );
};

export default AddItem;
