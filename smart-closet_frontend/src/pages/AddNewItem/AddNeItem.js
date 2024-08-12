import React, { useState } from 'react';
import './AddNewItem.css'; // Import your CSS

const AddNewItem = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = () => {
    console.log('Item added:', selectedCategory);
    // Handle the logic for adding the item here
  };

  return (
    <div className="add-item-container">
      <div className="item-form">
        <div className="dropdown-menu">
          <select id="category-select" value={selectedCategory} onChange={handleCategoryChange}>
            <option value="" disabled hidden>Choose a category</option>
            <option value="shirt">Shirt</option>
            <option value="pants">Pants</option>
            <option value="footwear">Footwear</option>
          </select>
        </div>

        <div className="file-input-container">
          <input type="file" id="file-input" onChange={handleImageChange} />
        </div>

        <div className="image-preview-container">
          {imagePreview ? <img src={imagePreview} alt="Preview" className="image-preview" /> : <div className="placeholder">Image Preview</div>}
        </div>

        <button className="add-button" onClick={handleAddItem}>Add Item</button>
      </div>
    </div>
  );
};

export default AddNewItem;
