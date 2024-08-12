import React from 'react';
import './CheckIfLiked.css'; // Import the CSS file

const CheckIfLiked = () => {

  const handleYesClick = () => {
    console.log('Yes clicked');
    // Add your logic for "Yes" here
  };

  const handleNoClick = () => {
    console.log('No Generate Again');
    // Add your logic for "No, Generate Another Again" here
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
    </div>
  );
};

export default CheckIfLiked;
