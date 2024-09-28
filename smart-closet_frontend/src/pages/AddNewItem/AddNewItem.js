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
  const [showDropdowns, setShowDropdowns] = useState(true); // کنترل نمایش منوهای کشویی

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
          throw new Error('دریافت اطلاعات کمدها با شکست مواجه شد');
        }
        const data = await response.json();
        setClosets(data);
      } catch (error) {
        console.error('خطا در دریافت کمدها:', error);
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
    setCapturedImage(null); // بازنشانی عکس گرفته شده در صورت انتخاب فایل
  };

  // تابع فعال‌سازی دوربین
  const activateCamera = () => {
    setIsCameraActive(true);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((error) => console.error('خطا در دسترسی به دوربین:', error));
  };

  // تابع گرفتن عکس از دوربین
  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // تبدیل بوم به فایل تصویر
    canvas.toBlob((blob) => {
      const imageFile = new File([blob], 'captured_image.png', { type: 'image/png' });
      setCapturedImage(imageFile);
      setFile(null); // بازنشانی فایل ورودی اگر عکسی گرفته شده باشد
      stopCamera();
    });
  };

  // تابع توقف جریان دوربین
  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    setIsCameraActive(false);
    setShowDropdowns(true);
  };

  // تابع استخراج رنگ غالب با استفاده از ColorThief
  const extractDominantColor = (imageUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageUrl;
      img.crossOrigin = 'Anonymous';
      imageRef.current = img;

      img.onload = () => {
        try {
          const colorThief = new ColorThief();
          const dominantColorRGB = colorThief.getColor(img); // دریافت رنگ غالب به صورت [R, G, B]
          const dominantHex = `#${(
            (1 << 24) +
            (dominantColorRGB[0] << 16) +
            (dominantColorRGB[1] << 8) +
            dominantColorRGB[2]
          )
            .toString(16)
            .slice(1)}`; // تبدیل RGB به HEX
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
      setPopupMessage('لطفاً تمام فیلدهای الزامی را پر کنید.');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }
    const startTime = new Date();
    setLoading(true);

    try {
      const imageToUpload = file || capturedImage;

      // گام ۱: حذف پس‌زمینه با استفاده از Remove.bg
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

      // گام ۳: آپلود به Cloudinary
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append('file', processedFile);
      cloudinaryFormData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const cloudinaryResponse = await axios.post(CLOUDINARY_URL, cloudinaryFormData);
      const imageUrl = cloudinaryResponse.data.secure_url;

      // استخراج رنگ غالب
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

      // ارسال به بک‌اند جنگو
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
        throw new Error('ذخیره پوشاک در سرور با شکست مواجه شد');
      }
      const endTime = new Date();
      const timeTaken = endTime - startTime; // Time in milliseconds
      console.log(`Time taken for the operation: ${timeTaken} ms`);
      setPopupMessage('پوشاک با موفقیت اضافه شد');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);

      // بازنشانی مقادیر بعد از موفقیت در ارسال
      setFile(null);
      setCapturedImage(null);
      setSelectedCloset('');
      setSelectedCategory('');
      setSelectedSecondCategory('');
      setSelectedType('');
      setShowDropdowns(true);

    } catch (error) {
      console.error('خطا:', error);
      setPopupMessage('عملیات با شکست مواجه شد');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  // تابع لغو عملیات و بارگذاری مجدد صفحه
  const handleCancel = () => {
    window.location.reload(); // بارگذاری مجدد صفحه
  };

  return (
    <div className="add-item-container">
      <form className="item-form" onSubmit={handleSubmit}>
        {/* نمایش شرطی منوهای کشویی بر اساس وضعیت showDropdowns */}
        {showDropdowns && (
          <>

        <div className="file-input-container">
          <input type="file" id="file-input" onChange={handleFileChange} disabled={isCameraActive} accept="image/*" />
          <button type="button" onClick={activateCamera} disabled={isCameraActive}>
            گرفتن عکس
          </button>
        </div>

        {/* قسمت پیش‌نمایش تصویر */}
        {(file || capturedImage) && (
          <div className="image-preview-container">
            <img src={file ? URL.createObjectURL(file) : URL.createObjectURL(capturedImage)} alt="انتخاب شده" />
          </div>
        )}

            <div className="dropdown-menu">
              <label htmlFor="closet-select">نام کمد</label>
              <select
                id="closet-select"
                value={selectedCloset}
                onChange={handleClosetChange}
                required
              >
                <option value="" disabled hidden>؟</option>
                {closets.map((closet) => (
                  <option key={closet.id} value={closet.id}>
                    {closet.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="dropdown-menu">
              <label htmlFor="type-select">نوع</label>
              <select
                id="type-select"
                value={selectedType}
                onChange={handleTypeChange}
                required
              >
                <option value="" disabled hidden>؟</option>
                <option value="s">پیراهن</option>
                <option value="p">شلوار</option>
                <option value="f">کفش</option>
              </select>
            </div>
            <div className="dropdown-menu">
              <label htmlFor="category-select">دسته‌بندی ۱</label>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={handleCategoryChange}
                required
              >
                <option value="" disabled hidden>؟</option>
                <option value="f">رسمی</option>
                <option value="c">روزمره</option>
                <option value="s">ورزشی</option>
                <option value="g">عمومی</option>
              </select>
            </div>

            <div className="dropdown-menu">
              <label htmlFor="second-category-select">دسته‌بندی ۲</label>
              <select
                id="second-category-select"
                value={selectedSecondCategory}
                onChange={handleSecondCategoryChange}
                required
              >
                <option value="" disabled hidden>؟</option>
                <option value="f">رسمی</option>
                <option value="c">روزمره</option>
                <option value="s">ورزشی</option>
                <option value="g">عمومی</option>
              </select>
            </div>

          </>
        )}

        {isCameraActive && (
          <div className="camera-container">
            <video ref={videoRef} autoPlay />
            <div className="button-group">
              <button type="button" onClick={stopCamera}>لغو</button>
              <button type="button" onClick={captureImage}>گرفتن عکس</button>
            </div>
          </div>
        )}

        <button 
          type="submit" 
          className="add-button" 
          disabled={loading || !selectedCloset || !selectedCategory || !selectedSecondCategory || !selectedType || (!file && !capturedImage)}>
          {loading ? (
            <FontAwesomeIcon icon={faSpinner} spin />
          ) : (
            'اضافه کردن پوشاک'
          )}
        </button>

        {/* دکمه لغو */}
        <button 
          type="button" 
          className="cancel-button" 
          onClick={handleCancel}>
          لغو
        </button>
      </form>

      {showPopup && (
        <div className="popup">
          <p>{popupMessage}</p>
        </div>
      )}

      {/* عنصر بوم مخفی برای گرفتن عکس */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <img ref={imageRef} alt="پوشاک بارگذاری شده" style={{ display: 'none' }} />
    </div>
  );
};

export default AddItem;
