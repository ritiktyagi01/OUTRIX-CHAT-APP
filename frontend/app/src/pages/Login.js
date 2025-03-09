import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'
import { NavLink } from 'react-router-dom';

const Login = () => {
 
    const [email,setEmail] = useState();
    const [password,setpass] = useState();
    const [show , setshow] = useState(false);

    const changeye = (e) =>{
      e.preventDefault();
      setshow(!show);

    }
    
    const navigate = useNavigate();
    const handlesubmits = async (e) => {
      e.preventDefault();
  
      try {
          const result = await axios.post('http://localhost:5000/api/user/login', 
              { email, password },
              { withCredentials: true }
              
              
          );
          
          
  
  
          if (result.data) {
            console.log(result);

              localStorage.setItem("userToken", result.data.token);
              localStorage.setItem("LoggedInUser", result.data._id);



              console.log("Token Saved:", localStorage.getItem("userToken"));

              

              navigate('/chat');
          } else {
              alert(result.data.message || 'Login Failed');
          }
      } catch (error) {
          console.error("Axios error:", error);
  
          if (error.response) {
              console.log("Response Data:", error.response.data);
              console.log("Status Code:", error.response.status);
              alert(error.response.data?.message || "Login failed");
          } else if (error.request) {
              console.log("No response received:", error.request);
              alert("No response from server. Check if backend is running.");
          } else {
              console.log("Request error:", error.message);
              alert("Error: " + error.message);
          }
      }
  };
  
    
     
  return (
    <div className="login-container">
      <form onSubmit={handlesubmits}>
        <h1>Login</h1>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <label htmlFor="password">Password</label>
        <div className="form-group1">
          
          <input
           type={show ? "text":"password"}    
            id="password"
            name="password"
            value={password}
            onChange={(e) => setpass(e.target.value)}
            placeholder="Enter your password"
            required
          />
          <button onClick={changeye}>
            {show ?
            <i className="itag" class="fa-solid fa-eye"></i>
            :<i class="fa-solid fa-eye-slash"></i>}


          </button>
        </div>

        <div className="form-group">
          <button type="submit" className="login-btn">Login</button>
        </div>

        <div className="signup-redirect">
          <p>Don't have an account?</p>
          
          {/* <button><NavLink to="/signup" className='signup-btn'  > Signup</NavLink></button> */}
          <a href='/signup' className='signup-btn'> Signup</a>
        </div>
      </form>
    </div>
  );
}
  


export default Login;
