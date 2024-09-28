
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
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const navigate = useNavigate();

    const handlePasswordChange = (e) => {
        const pwd = e.target.value;
        setPassword(pwd);

        if (pwd.length < 6) {
            setPasswordStrength('ضعیف');
        } else if (pwd.length < 10) {
            setPasswordStrength('متوسط');
        } else {
            setPasswordStrength('قوی');
        }
    };

    const handleSubmit = async (e) => {
        const startTime = Date.now()
        e.preventDefault();
        setError(null);

        if (passwordStrength === 'ضعیف') {
            setShowPopup(true);
            return;
        }

        try {
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
                throw new Error('رمز عبور خیلی ضعیف است، لطفاً دوباره امتحان کنید!');
            }

            const data = await response.json();

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
                throw new Error('دریافت توکن‌ها با شکست مواجه شد. لطفاً دوباره وارد شوید.');
            }

            const tokenData = await tokenResponse.json();
            localStorage.setItem('access_token', tokenData.access);
            localStorage.setItem('refresh_token', tokenData.refresh);

            window.location = "/Dashboard";
            const endTime = Date.now()
            const Takenttime = endTime - startTime
            console.log(Takenttime)
            alert('ثبت نام با موفقیت انجام شد!');
        } catch (error) {
            setError(error.message);
            console.error('خطا در حین ثبت نام:', error);
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
                <h2>ثبت نام</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="firstName">نام</label>
                        <input 
                            type="text" 
                            id="firstName" 
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="نام خود را وارد کنید"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">نام خانوادگی</label>
                        <input 
                            type="text" 
                            id="lastName" 
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="نام خانوادگی خود را وارد کنید"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">ایمیل</label>
                        <input 
                            type="email" 
                            id="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ایمیل خود را وارد کنید"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">شماره تلفن</label>
                        <input 
                            type="tel" 
                            id="phone" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="شماره تلفن خود را وارد کنید"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">رمز عبور</label>
                        <input 
                            type="password" 
                            id="password" 
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="رمز عبور خود را وارد کنید"
                            required
                        />
                        <p className={`password-strength ${passwordStrength.toLowerCase()}`}>
                            قدرت رمز عبور: {passwordStrength}
                        </p>
                    </div>
                    <button type="submit" className="signup-button">ثبت نام</button>
                </form>

                <div className="login-prompt">
                    <span className="account-text">حساب کاربری دارید؟</span>
                    <button className="login-button" onClick={handleLoginClick}>ورود</button>
                </div>
            </div>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <p>رمز عبور شما خیلی ضعیف است. لطفاً یک رمز قوی‌تر انتخاب کنید.</p>
                        <button className="close-popup-button" onClick={closePopup}>بستن</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Signup;
