import React, { useState } from "react";
import axios from "axios";
import './Signup.css'; 
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");
  const [picLoading, setPicLoading] = useState(false);

  const navigate = useNavigate();

  const handleClick = (event) => {
    event.preventDefault();
    setShow(!show);
  };

  const postPic = async (file) => {
    setPicLoading(true); 
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default"); 
    formData.append("cloud_name", "dbihbtvyz");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dbihbtvyz/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setPic(data.secure_url); 
      console.log("Uploaded Pic URL:", data.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Image upload failed");
    } finally {
      setPicLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); 

    try {
      const res = await axios.post("http://localhost:5000/api/user/signup",
        { name, email, password, pic },
        { withCredentials: true }
      );

      console.log(res.data);
      alert("Signup successful!");
      navigate("/home");
    } catch (error) {
      console.error("Signup Error:", error);
      alert(error.response?.data || "Signup failed");
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>

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
            type={show ? "text" : "password"}
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          <button onClick={handleClick}>
            {show ? (
              <i className="fa-solid fa-eye"></i>
            ) : (
              <i className="fa-solid fa-eye-slash"></i>
            )}
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="pic">Upload Your Pic</label>
          <input
            className="infile"
            type="file"
            id="file"
            name="file"
            onChange={(e) => postPic(e.target.files[0])}
            required
          />
          {picLoading && <p>Uploading...</p>}
          {pic && <img src={pic} alt="Uploaded Pic" style={{ width: "100px" }} />}
        </div>

        <div className="form-group">
          <button type="submit" className="premium-btn">Register</button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
