import axios from "axios";
import "../styles/message.css";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/auth.context";

type UserCredentials = {
  id: number;
  username: string;
  fullname: string;
  userProfilePic: string;
};

type Message = {
  id: number;
  senderId: number;
  receiverId: number;
  message: string;
  createdAt: string;
};

export default function Message() {
  const [friends, setFriends] = useState<UserCredentials[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [InputMessage, setInputMessage] = useState("");
  const { isAuthenticated } = useAuth();

  // Fetch all friends
  const fetchFriends = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5001/api/request/friends",
        {
          headers: { Authorization: `Bearer ${isAuthenticated}` },
        }
      );
      setFriends(response.data.friends);
    } catch (error) {
      console.error("Error fetching friends:", error);
      setFriends([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (friendId: number) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5001/api/message/get-message/${friendId}`,
        {
          headers: { Authorization: `Bearer ${isAuthenticated}` },
        }
      );
      setMessages(response.data.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInput = async () => {
    const response = await axios.post(
      `http://localhost:5001/api/message/send-Message`,
      {
        receiverId: selectedFriendId,
        message: InputMessage,
      },
      {
        headers: {
          Authorization: `Bearer ${isAuthenticated}`,
        },
      }
    );
    console.log(response);
  };

  useEffect(() => {
    handleInput();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFriends();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedFriendId !== null) {
      fetchMessages(selectedFriendId);
    }
  }, [selectedFriendId]);

  return (
    <div className="message_container">
      <div className="sidebar_for_message">
        <h1 className="text-center font-serif text-4xl mt-3">Messages</h1>
        <input type="text" id="Search-text" placeholder="Search a Person" />
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="messages-section">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className={`message-box ${
                  selectedFriendId === friend.id ? "selected" : ""
                }`}
                onClick={() => setSelectedFriendId(friend.id)}
              >
                <img
                  src={friend.userProfilePic || "default_pic_url"}
                  alt={`${friend.username || "User"}'s profile`}
                  className="user-profile-pic"
                />
                <span id="username">{friend.username || "Anonymous"}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <div className="message-navbar">
          <img
            src={
              friends.find((friend) => friend.id === selectedFriendId)
                ?.userProfilePic || "default_profile_pic_url" // Replace with an actual default image URL
            }
            alt="Navbar profile"
            id="navbar-image"
          />
          <span className="username-text">
            {friends.find((friend) => friend.id === selectedFriendId)
              ?.fullname || "Select a friend"}
          </span>
        </div>
        <div className="text-area">
          <div className="message_inside-chat">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={
                    msg.senderId === selectedFriendId
                      ? "messageOthers"
                      : "messageSelf"
                  }
                >
                  <span>{msg.message}</span>
                  <small>{new Date(msg.createdAt).toLocaleTimeString()}</small>
                </div>
              ))
            ) : (
              <div>No messages found</div>
            )}
          </div>
        </div>
        <input
          type="text"
          placeholder="Enter a Message"
          className="w-full"
          onChange={(e) => setInputMessage(e.target.value)}
          
        />
        <button onClick={handleInput} className="send-button">
            Send
        </button>
      </div>
    </div>
  );
}
