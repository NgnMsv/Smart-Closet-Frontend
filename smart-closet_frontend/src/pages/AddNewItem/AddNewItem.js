import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ColorThief from 'colorthief';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
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
  const [loading, setLoading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showDropdowns, setShowDropdowns] = useState(true); // Control visibility of dropdowns

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef();

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
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setCapturedImage(null); // Reset captured image if a file is chosen
    setShowDropdowns(false); // Hide dropdowns when file is chosen
  };

  // Function to handle camera activation
  const activateCamera = () => {
    setIsCameraActive(true);
    setShowDropdowns(false); // Hide dropdowns when camera is activated
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((error) => console.error('Error accessing camera:', error));
  };

  // Function to capture image from webcam
  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to a blob (image file)
    canvas.toBlob((blob) => {
      const imageFile = new File([blob], 'captured_image.png', { type: 'image/png' });
      setCapturedImage(imageFile);
      setFile(null); // Reset file input if a photo is captured
      stopCamera();
    });
  };

  // Function to stop the camera stream
  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    setIsCameraActive(false);
    setShowDropdowns(true)
  };

  // Function to extract the dominant color using ColorThief
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

    if (!selectedCloset || !selectedCategory || !selectedSecondCategory || !selectedType || (!file && !capturedImage)) {
      setPopupMessage('Please fill in all required fields.');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }

    setLoading(true);

    try {
      const imageToUpload = file || capturedImage;

      // Step 1: Remove background using Remove.bg
      const formData = new FormData();
      formData.append('image_file', imageToUpload);
      formData.append('size', 'auto');

      const removeBgResponse = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
        headers: {
          'X-Api-Key': REMOVE_BG_API_KEY,
        },
        responseType: 'blob',
      });

      const processedFile = new File([removeBgResponse.data], 'processed_image.png', { type: 'image/png' });

      // Step 3: Upload to Cloudinary
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append('file', processedFile);
      cloudinaryFormData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const cloudinaryResponse = await axios.post(CLOUDINARY_URL, cloudinaryFormData);
      const imageUrl = cloudinaryResponse.data.secure_url;

      // Extract dominant color
      const extractedColor = await extractDominantColor(imageUrl);
      setDominantColor(extractedColor);

      const wearableData = {
        closet: selectedCloset,
        color: extractedColor,
        type: selectedType,
        image_url: imageUrl,
        usage_1: selectedCategory.charAt(0),
        usage_2: selectedSecondCategory.charAt(0),
        accessible: true,
      };

      // Send to Django backend
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
      setShowDropdowns(true); // Show dropdowns again after successful submission
    } catch (error) {
      console.error('Error:', error);
      setPopupMessage('Operation failed');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-item-container">
      <form className="item-form" onSubmit={handleSubmit}>
        {/* Conditionally render dropdowns based on showDropdowns state */}
        {showDropdowns && (
          <>
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
          </>
        )}

        <div className="file-input-container">
          <input type="file" id="file-input" onChange={handleFileChange} disabled={isCameraActive} accept="image/*" />
          <button type="button" onClick={activateCamera} disabled={isCameraActive}>
            Take Photo
          </button>
        </div>

        {/* Image preview container */}
        {file && (
          <div className="image-preview-container">
            <img src={URL.createObjectURL(file)} alt="Selected" />
          </div>
        )}

        {isCameraActive && (
          <div className="camera-container">
            <video ref={videoRef} autoPlay />
            <div className="button-group">
              <button type="button" onClick={stopCamera}>Cancel</button>
              <button type="button" onClick={captureImage}>Capture Photo</button>
            </div>
          </div>
        )}

        <button type="submit" className="add-button" disabled={loading}>
          {loading ? (
            <FontAwesomeIcon icon={faSpinner} spin />
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

      {/* Hidden canvas element for capturing image */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <img ref={imageRef} alt="uploaded item" style={{ display: 'none' }} />
    </div>
  );
};

export default AddItem;
