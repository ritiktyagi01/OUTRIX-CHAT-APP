import React, { useState, useEffect } from 'react';
import './Chating.css';
import axios from 'axios';
import Scroblefeed from './Scroblefeed';
import io from 'socket.io-client';

const ENDPOINT = "http://localhost:5000"; // Backend URL
let socket;

const Chating = ({ selecteduser: initialSelectedUser, LoggedInUser }) => {
  const [view, setView] = useState(false);
  const [editGroup, setEditGroup] = useState(false);
  const [gname, setGname] = useState("");
  const [uname, setUname] = useState("");
  const [data, setData] = useState([]);
  const [selecteduser, setSelectedUser] = useState(initialSelectedUser);
  const [msgdata, setmsgdata] = useState("");
  const [fetchmsgchats, setFetchMsgChats] = useState([]);

  useEffect(() => {
    setSelectedUser(initialSelectedUser); // ✅ Ensure selected user updates
  }, [initialSelectedUser]);

  console.log(LoggedInUser);
  console.log(fetchmsgchats);
  
  
  

  useEffect(() => {
    socket = io(ENDPOINT);
 
      socket.emit("setup", LoggedInUser);
      socket.on("connected", () => console.log("Socket Connected"));
    
  }, [LoggedInUser]);

  useEffect(() => {
    if (selecteduser?._id) {
       setFetchMsgChats([]); // ✅ Clear old messages before fetching new ones
      socket.emit("join room", selecteduser._id);
      fetchMessages();
      // console.log("fetchmsgchats:", JSON.stringify(fetchmsgchats, null, 2));
setEditGroup(false);
    }
  }, [selecteduser]); 
  

  useEffect(() => {
    socket.on("message received", (newMessage) => {
      console.log("New Message Received:", newMessage);
    
      // if (!selecteduser || selecteduser?._id !== newMessage.chat._id) {
      //   return;
      // }
    
      setFetchMsgChats((prev) => [...prev, newMessage]); // ✅ Append message instantly
    });
    
  });

  const handleView = () => setView(!view);
  const handleGroup = () => setEditGroup(!editGroup);

  const handleFunction = async () => {
    if (!uname.trim()) {
      setData([]);
      return;
    }

    const token = localStorage.getItem("userToken");
    if (!token) return;

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(
        `http://localhost:5000/api/user?search=${uname}`,
        config
      );
      setData(response.data.length ? response.data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleFunction();
  }, [uname]);

  const changeName = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(
        `http://localhost:5000/api/chat/rename`,
        { chatId: selecteduser._id, newname: gname },
        config
      );

      setSelectedUser((prev) => ({ ...prev, chatname: gname }));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMessages = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `http://localhost:5000/api/message/${selecteduser._id}`,
        config
      );
    
      console.log("Selected User Id: ",selecteduser._id);
      console.log("selected user " ,selecteduser);
console.log(response.data);

      setFetchMsgChats(response.data); 
      // ✅ Update state with fetched messages


    } catch (error) {
      console.error(error);
    }
  };

  const handlemessage = async (e) => {
    if (e.key === "Enter" && msgdata.trim()) {
      const token = localStorage.getItem("userToken");
      if (!token || !selecteduser?._id) return;
  
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
  
        const response = await axios.post(
          `http://localhost:5000/api/message/sendmessage`,
          { chatId: selecteduser?._id, content: msgdata },
          config
        );
  
        setmsgdata(""); // ✅ Clear input
        console.log("Handld Message: ",response.data);
        socket.emit("new message", response.data);

        
        
        setFetchMsgChats((prev) => [...prev, response.data]); 
        console.log("setFetchMsgChats: ", fetchmsgchats);
        
      } catch (error) {
        console.error(error);
      }
    }
  };
  
  const deleteUser = async (userId) => {
    const token = localStorage.getItem("userToken");
    if (!token || userId === selecteduser.groupAdmin) return;

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(
        `http://localhost:5000/api/chat/removefromgroup`,
        { chatId: selecteduser._id, UserId: userId },
        config
      );

      setSelectedUser((prev) => ({
        ...prev,
        users: prev.users.filter((user) => user._id !== userId),
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const addToGroup = async (userId) => {
    const token = localStorage.getItem("userToken");
    if (!token || selecteduser.users.some((user) => user._id === userId)) return;

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.put(
        "http://localhost:5000/api/chat/addtogroup",
        { chatId: selecteduser._id, UserId: userId },
        config
      );

      setSelectedUser((prev) => ({
        ...prev,
        users: response.data.users,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="chatingcontainer">
      <div className="chat-content-header">
        <h2 onClick={handleView}>
          {selecteduser
            ? selecteduser.isGroupChat
              ? selecteduser.chatname
              : selecteduser.users?.[1]?.name
            : "Select a user to start chatting"}
        </h2>
        <div className="itag" onClick={handleGroup}>
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </div>
      </div>

      {selecteduser?  <hr></hr> : null}
      

      {view && selecteduser?.users?.[1] && (
        <div className="userprofile">
          <img src={selecteduser.users[1].pic} alt="User Profile" />
          <i className="fa-solid fa-xmark" onClick={handleView}></i>
        </div>
      )}

      {editGroup && (
        <div className="groupdiv">
          <div className="groupdivinput">
            <input
              placeholder="Enter new group name"
              onChange={(e) => setGname(e.target.value)}
            />
            <button onClick={changeName}>Change</button>
          </div>
          <div className="adduserdiv">
            <input
              placeholder="Enter user name to add"
              onChange={(e) => setUname(e.target.value)}
            />
            <button>Add</button>
          </div>

          <div className='ser-users'>
            {data.map((user) => (
              <div key={user._id} className="user-item" onClick={() => addToGroup(user._id)}>
                <button>{user.name}</button>
              </div>
            ))}
          </div>

          <div className="editgp">
            {selecteduser?.users?.map((user) => (
              <div key={user._id} className="user-item">
                {user.name}
                <i className="fa-solid fa-xmark" onClick={() => deleteUser(user._id)}></i>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className='scrolablediv'>
        {console.log(fetchmsgchats)
        }
      <Scroblefeed selecteduser={selecteduser} msgdata={fetchmsgchats} />
      <input className='inpmain' placeholder='Enter Message' onChange={(e) => setmsgdata(e.target.value)} onKeyDown={handlemessage} value={msgdata} />
      </div>
    </div>
  );
};

export default Chating;
