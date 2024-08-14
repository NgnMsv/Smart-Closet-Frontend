import React, { useState, useEffect } from 'react';
import './AddNewItem.css'; // Import your CSS

const AddItem = () => {
  const [closets, setClosets] = useState([]);
  const [selectedCloset, setSelectedCloset] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [file, setFile] = useState(null);

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
    console.log('Selected closet ID:', event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    console.log('Selected category:', event.target.value);
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
    console.log('Selected type:', event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create FormData object for file upload
    const formData = new FormData();
    formData.append('closet', selectedCloset);
    formData.append('color', selectedCategory);
    formData.append('type', selectedType.charAt(0));
    formData.append('usage_1', selectedCategory.charAt(0));
    formData.append('usage_2', selectedCategory.charAt(0));
    if (file) {
      formData.append('image', file);
    }
    formData.append('accessible', true);

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
        throw new Error('Failed to add item');
      }

      console.log('Item added successfully');
      // Optionally, redirect or clear the form
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  return (
    <div className="add-item-container">
      <form className="item-form" onSubmit={handleSubmit}>
        <div className="dropdown-menu">
          <label htmlFor="closet-select">Choose a closet:</label>
          <select 
            id="closet-select" 
            value={selectedCloset} 
            onChange={handleClosetChange}
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
          <label htmlFor="category-select">Choose a category:</label>
          <select 
            id="category-select" 
            value={selectedCategory} 
            onChange={handleCategoryChange}
          >
            <option value="" disabled hidden>Please choose a category</option>
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
            <option value="" disabled hidden>Please choose a type</option>
            <option value="shirt">Shirt</option>
            <option value="pants">Pants</option>
            <option value="footwear">Footwear</option>
          </select>
        </div>

        <div className="file-input-container">
          <input type="file" id="file-input" onChange={handleFileChange} />
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
