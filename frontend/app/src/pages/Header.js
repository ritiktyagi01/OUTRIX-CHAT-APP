import React from 'react';
import './Header.css';

const Header = () => {
  const handleLogout = () => {
    localStorage.removeItem("userToken"); // Remove token from local storage
    localStorage.removeItem("LoggedInUser"); // Remove token from local storage
    localStorage.removeItem("user"); // Remove token from local storage


    window.location.href = 'http://localhost:3000/login'  };

  return (
    <div className='container1'>
      <h1>Chat App</h1>
      <i className="fa-solid fa-user" onClick={handleLogout} style={{ cursor: "pointer" }}></i>
    </div>
  );
};

export default Header;
