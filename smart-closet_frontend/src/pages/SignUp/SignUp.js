import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const Signup = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');
    const [error, setError] = useState(null); // State to handle error messages
    const [showPopup, setShowPopup] = useState(false); // State to manage pop-up visibility

    const navigate = useNavigate();

    const handlePasswordChange = (e) => {
        const pwd = e.target.value;
        setPassword(pwd);

        // Simple password strength checker
        if (pwd.length < 6) {
            setPasswordStrength('Weak');
        } else if (pwd.length < 10) {
            setPasswordStrength('Medium');
        } else {
            setPasswordStrength('Strong');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Clear any previous errors

        // Check password strength before submitting
        if (passwordStrength === 'Weak') {
            setShowPopup(true); // Show the pop-up
            return; // Prevent form submission
        }

        try {
            // Create a new user by sending signup data to the backend
            const response = await fetch('http://localhost:8000/auth/users/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    phone_number: phone,
                    password: password,
                    re_password: password,
                }),
            });

            if (!response.ok) {
                throw new Error('Too weak password, please try again!');
            }

            const data = await response.json();

            // Assuming the backend returns JWT tokens upon successful signup
            const tokenResponse = await fetch('http://localhost:8000/auth/jwt/create/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            if (!tokenResponse.ok) {
                throw new Error('Failed to retrieve tokens. Please try logging in.');
            }

            const tokenData = await tokenResponse.json();
            localStorage.setItem('access_token', tokenData.access);
            localStorage.setItem('refresh_token', tokenData.refresh);

            // Redirect to the dashboard upon successful signup and token retrieval
            window.location = "/Dashboard";
            alert('Signup successful!');
        } catch (error) {
            setError(error.message);
            console.error('Error during signup:', error);
        }
    };

    const handleLoginClick = () => {
        navigate('/Login');
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <div className="signup-container">
            <div className="signup-form">
                <h2>Sign Up</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input 
                            type="text" 
                            id="firstName" 
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter your first name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input 
                            type="text" 
                            id="lastName" 
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Enter your last name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input 
                            type="tel" 
                            id="phone" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter your phone number"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="Enter your password"
                            required
                        />
                        <p className={`password-strength ${passwordStrength.toLowerCase()}`}>
                            Password strength: {passwordStrength}
                        </p>
                    </div>
                    <button type="submit" className="signup-button">Sign Up</button>
                </form>

                <div className="login-prompt">
                    <span className="account-text">Have an Account?</span>
                    <button className="login-button" onClick={handleLoginClick}>Login Here</button>
                </div>
            </div>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <p>Your password is too weak. Please choose a stronger password.</p>
                        <button className="close-popup-button" onClick={closePopup}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Signup;
