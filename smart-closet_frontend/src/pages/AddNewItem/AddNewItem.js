import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ColorThief from 'colorthief'; // Import ColorThief
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faSpinner } from '@fortawesome/free-solid-svg-icons'; // Import Spinner Icon
import './AddNewItem.css';

const AddItem = () => {
  const [closets, setClosets] = useState([]);
  const [selectedCloset, setSelectedCloset] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSecondCategory, setSelectedSecondCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [file, setFile] = useState(null);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [dominantColor, setDominantColor] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const imageRef = useRef(); // Ref for image element

  const REMOVE_BG_API_KEY = process.env.REACT_APP_REMOVE_BG_API_KEY;
  const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dhh2bkogz/image/upload';
  const CLOUDINARY_UPLOAD_PRESET = 'Image_preset';

  useEffect(() => {
    const fetchClosets = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:8000/api/closets/', {
          headers: { 'Authorization': `Bearer ${token}` }
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

  // Create a function to extract the dominant color using a Promise
  const extractDominantColor = (imageUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageUrl;
      img.crossOrigin = 'Anonymous';
      imageRef.current = img;

      img.onload = () => {
        try {
          const colorThief = new ColorThief();
          const dominantColorRGB = colorThief.getColor(img); // Get dominant color as [R, G, B]
          const dominantHex = `#${(
            (1 << 24) +
            (dominantColorRGB[0] << 16) +
            (dominantColorRGB[1] << 8) +
            dominantColorRGB[2]
          )
            .toString(16)
            .slice(1)}`; // Convert RGB to HEX
          resolve(dominantHex);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedCloset || !selectedCategory || !selectedSecondCategory || !selectedType || !file) {
      setPopupMessage('Please fill in all required fields.');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }

    setLoading(true); // Start loading spinner

    try {
      // Step 1: Remove background using Remove.bg
      const formData = new FormData();
      formData.append('image_file', file);
      formData.append('size', 'auto');

      const removeBgResponse = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
        headers: {
          'X-Api-Key': REMOVE_BG_API_KEY,
        },
        responseType: 'blob', // Receive the processed image as Blob
      });

      // Step 2: Convert the Blob (processed image) to a File object
      const processedFile = new File([removeBgResponse.data], 'processed_image.png', { type: 'image/png' });

      // Step 3: Upload the processed image to Cloudinary
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append('file', processedFile);
      cloudinaryFormData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const cloudinaryResponse = await axios.post(CLOUDINARY_URL, cloudinaryFormData);
      const imageUrl = cloudinaryResponse.data.secure_url;

      // Step 4: Extract the dominant color and wait for it
      const extractedColor = await extractDominantColor(imageUrl);
      setDominantColor(extractedColor);

      // Step 5: Prepare data to send to Django backend
      const wearableData = {
        closet: selectedCloset,
        color: extractedColor, // Send the extracted dominant color (hex code)
        type: selectedType,
        image_url: imageUrl,
        usage_1: selectedCategory.charAt(0),
        usage_2: selectedSecondCategory.charAt(0),
        accessible: true,
      };

      // Step 6: Send data to Django backend
      const token = localStorage.getItem('access_token');
      const backendResponse = await fetch('http://localhost:8000/api/wearables/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wearableData),
      });

      if (!backendResponse.ok) {
        throw new Error('Failed to save item in the backend');
      }

      setPopupMessage('Item added successfully');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (error) {
      console.error('Error:', error);
      setPopupMessage('Operation failed');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } finally {
      setLoading(false); // Stop loading spinner
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
            <option value="" disabled hidden>?</option>
            {closets.map((closet) => (
              <option key={closet.id} value={closet.id}>
                {closet.name}
              </option>
            ))}
          </select>
        </div>

        <div className="dropdown-menu">
          <label htmlFor="category-select">Category 1:</label>
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
          <label htmlFor="second-category-select">Category 2:</label>
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

        <button type="submit" className="add-button" disabled={loading}>
          {loading ? (
            <FontAwesomeIcon icon={faSpinner} spin /> // Spinner icon while loading
          ) : (
            'Add Item'
          )}
        </button>
      </form>

      {showPopup && (
        <div className="popup">
          <p>{popupMessage}</p>
        </div>
      )}

      {/* Hidden image element for color extraction */}
      <img ref={imageRef} alt="uploaded item" style={{ display: 'none' }} />
    </div>
  );
};

export default AddItem;
