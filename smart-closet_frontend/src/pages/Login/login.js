import React from 'react';
import './login.css'


const Login = (prop) => {
    return (
        <login>
            <div className="login-container">
            <div className="login-form">
                <h2>Login</h2>
                <form>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" placeholder="Enter your username" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" placeholder="Enter your password" />
                </div>
                <button type="submit" className="login-button">Login</button>
                </form>
                <div className="forgot-password">
                <a href="#">Forgot your password?</a>
                </div>
            </div>
            </div>
         </login>
    )
}

export default Login;


// // src/pages/Login.js
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Login.css';

// const Login = (props) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch('https://your-api-endpoint.com/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username, password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         console.log('Login successful:', data);
//         navigate('/dashboard'); // Redirect to the dashboard
//       } else {
//         setError(data.message || 'Invalid credentials');
//       }
//     } catch (error) {
//       setError('An error occurred. Please try again.');
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <login>
//       <div className="login-container">
//         <div className="login-form">
//           <h2>Login</h2>
//           {error && <div className="error">{error}</div>}
//           <form onSubmit={handleSubmit}>
//             <div className="form-group">
//               <label htmlFor="username">Username</label>
//               <input
//                 type="text"
//                 id="username"
//                 placeholder="Enter your username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="password">Password</label>
//               <input
//                 type="password"
//                 id="password"
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//             <button type="submit" className="login-button">
//               Login
//             </button>
//           </form>
//           <div className="forgot-password">
//             <a href="#">Forgot your password?</a>
//           </div>
//         </div>
//       </div>
//     </login>
//   );
// };

// export default Login;
