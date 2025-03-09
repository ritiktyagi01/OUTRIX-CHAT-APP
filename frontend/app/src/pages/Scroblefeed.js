import React, { useEffect, useState } from "react";
import ScrollableFeed from "react-scrollable-feed";
import './Scroblefeed.css';
const Scroblefeed = ({ selecteduser, msgdata }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!selecteduser) return;

    // ✅ Remove duplicate messages before updating state
    const uniqueMessages = msgdata.filter(
      (msg, index, self) => index === self.findIndex((m) => m._id === msg._id)
    );

    setMessages(uniqueMessages);
  }, [msgdata, selecteduser]);

  return (
    <ScrollableFeed className="scrolable">
      {messages.length > 0 ? (
        messages.map((msg, index) => {
          const isMyMessage = msg.sender?._id === localStorage.getItem("LoggedInUser");
          const isLastFromSender =
            index === messages.length - 1 || messages[index + 1]?.sender?._id !== msg.sender?._id;

          return (
            <div
              key={msg._id || `msg-${index}`} // ✅ Use index as backup key
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: isMyMessage ? "flex-end" : "flex-start",
                padding: "5px",
              }}
            >
              {isLastFromSender && (
                <div style={{ width: "40px", height: "40px", marginRight: "8px" }}>
                  <img
                    src={msg.sender?.pic}
                    alt="User"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                    }}
                  />
                </div>
              )}

              <span
                style={{
                  backgroundColor: isMyMessage ? "#DCF8C6" : "#ECECEC",
                  padding: "8px",
                  borderRadius: "8px",
                  maxWidth: "60%",
                }}
              >
                {msg.content}
              </span>
            </div>
          );
        })
      ) : ( null
        // <div>No messages yet</div>
      )}
    </ScrollableFeed>
  );
};

export default Scroblefeed;
