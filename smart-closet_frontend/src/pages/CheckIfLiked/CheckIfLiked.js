import React, { useState } from 'react';
import styles from './CheckIfLiked.css'; // Importing the CSS module


const CheckIfLiked = () => {
    const [showPopup, setShowPopup] = useState(false); // State to manage pop-up visibility
    const [popupMessage, setPopupMessage] = useState(''); // State to hold the pop-up message

    const handleYesClick = () => {
        console.log('Yes clicked');
        setPopupMessage('Great pick! Check back soon for more personalized recommendations');
        setShowPopup(true);

        setTimeout(() => {
            window.location = "/generate-combination";
        }, 3000); // 3 seconds delay before redirecting
    };

    const handleNoClick = () => {
        console.log('No Generate Again');
        setPopupMessage('Generating another combination');
        setShowPopup(true);

        setTimeout(() => {
            window.history.back(); // Redirects back to the previous page after 3 seconds
        }, 3000); // 3 seconds delay before redirecting
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <div className="checkifliked-container">
            <h1 className="checkifliked-title">Are You Going To Take The Combination?</h1>
            <div className="checkifliked-button-container">
                <button className="checkifliked-button no-button" onClick={handleNoClick}>
                    No Generate Again
                </button>
                <button className="checkifliked-button yes-button" onClick={handleYesClick}>
                    Yes I Take It
                </button>
            </div>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <p>{popupMessage}</p>
                        <button className="close-popup-button" onClick={closePopup}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckIfLiked;
