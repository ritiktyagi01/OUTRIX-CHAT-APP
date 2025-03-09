import React, { useState, useEffect } from 'react';
import './Users.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import Chating from './Chating';

const Users = () => {
  const [value, setValue] = useState("");
  const [data, setData] = useState([]);
  const [fetchData, setFetchData] = useState([]);
  const [error, setError] = useState(null);
  const [popup, setPopup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupUsers, setGroupUsers] = useState("");
  const [groupData, setGroupData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [checkedUsers, setCheckedUsers] = useState([]); 

  const loggedInUserId = localStorage.getItem("LoggedInUser");

  console.log("Selected user:", selectedUser);
  console.log("Fetched data:", fetchData);

  // ✅ Reset selected user before updating
  const handleSelectUser = (user) => {
    setSelectedUser(null);  // Clear previous chat selection
    setTimeout(() => {
      setSelectedUser(user);  // Set new chat after clearing
    }, 0);
  };

  // ✅ Toggle Group Chat User Selection
  const handleGroupChats = (userId) => {
    if (checkedUsers.includes(userId)) {
      setCheckedUsers(checkedUsers.filter((id) => id !== userId));
    } else {
      setCheckedUsers([...checkedUsers, userId]);
    }
  };

  // ✅ Search for Users
  const handleUserSearch = async () => {
    if (!value.trim()) {
      setData([]);
      return;
    }

    const token = localStorage.getItem("userToken");
    if (!token) return;

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`http://localhost:5000/api/user?search=${value}`, config);
      setData(response.data.length ? response.data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleUserSearch();
  }, [value]);

  // ✅ Group User Search
  const handleGroupSearch = async () => {
    if (!groupUsers.trim()) {
      setGroupData([]);
      return;
    }

    const token = localStorage.getItem("userToken");
    if (!token) return;

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`http://localhost:5000/api/user?search=${groupUsers}`, config);
      setGroupData(response.data.length ? response.data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGroupSearch();
  }, [groupUsers]);

  // ✅ Fetch Existing Chats
  const fetchChats = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`http://localhost:5000/api/chat`, config);

      if (Array.isArray(response.data)) {
        setFetchData(response.data);
        setError(null);
      } else {
        setError("Invalid response format: Expected array");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch chats");
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  // ✅ Create Group Chat
  const handleCreateGroup = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    try {
      const config = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } };
      const requestBody = { name: groupName, users: JSON.stringify(checkedUsers) };
      const response = await axios.post("http://localhost:5000/api/chat/group", requestBody, config);

      console.log("Group Created:", response.data);
      setPopup(false); // ✅ Close popup after group creation
      setCheckedUsers([]); // ✅ Clear checked users
      fetchChats(); // ✅ Refresh chats
    } catch (error) {
      console.error("Error creating group:", error.response?.data || error.message);
    }
  };

  return (
    <div className='container-mains'>
      {error && <div className="error-message">{error}</div>}
      
      <div className='Gchat'>
        <h1>Users</h1>
        <button onClick={() => setPopup(true)}>Group Chat</button>
      </div>

      {popup && (
        <div className='popup-overlay'>
          <div className='Gchat-pop'>
            <input placeholder="Enter group name" onChange={(e) => setGroupName(e.target.value)} />
            <input placeholder='Enter users' onChange={(e) => setGroupUsers(e.target.value)} />

            {groupData.map((user) => (
              <div key={user._id} className="user-itemss" onClick={() => handleGroupChats(user._id)}>
                <button className='pop-btn'>{user.name}</button>
                {checkedUsers.includes(user._id) && <h2 className="fa-solid fa-check"></h2>}
              </div>
            ))}

            <div className='creategroupb'>
              <button onClick={handleCreateGroup}>Create Group</button>
              <button onClick={() => setPopup(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Search Users */}
      <div className='searchdiv'>
        <input type="text" placeholder="Search by name or email" onChange={(e) => setValue(e.target.value)} />
        <button type='submit'><i className="fa-solid fa-magnifying-glass"></i></button>
      </div>

      {/* User List */}
      <div className="search-results">
  {data.map((user) => (
    <div key={user._id} className="user-item">
      <button>{user.name}</button>
    </div>
  ))}
</div>


      {/* Chat List */}
      <div>
        {fetchData.map((user) => (
          <div key={user._id} className="user-item">
            <button className='bfetchchats' onClick={() => handleSelectUser(user)}>
              {!user.isGroupChat && user.users
                ? user.users[0]?._id === loggedInUserId
                  ? user.users[1]?.name || "Unknown User"
                  : user.users[0]?.name || "Unknown User"
                : user.chatname || "Unknown Chat"}
            </button>
          </div>
        ))}
      </div>

      {/* Chat Component */}
      <div className='chatting-cont'>
        <Chating selecteduser={selectedUser} LoggedInUser={loggedInUserId} />
      </div>
    </div>
  );
};

export default Users;
