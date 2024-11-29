import axios from "axios";
import "../styles/friends.css";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/auth.context";

type Friends = {
  id: number;
  username: string;
  fullname: string;
  userProfilePic: string;
}

export default function Friends() {
  const { isAuthenticated } = useAuth();
  const [friends, setFriends] = useState<Friends[]>([]);
  const [id, setId] = useState<number>();

  // Fetch and display friends
  const showFriends = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/request/friends`, {
        headers: {
          Authorization: `Bearer ${isAuthenticated}`,
        },
      });
      console.log("Friends",response.data.friends);
      setFriends(response.data.friends || []);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  // Send friend request
  const handleSendRequests = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5001/api/request/sendRequest`,
        { receiverId: id },
        {
          headers: {
            Authorization: `Bearer ${isAuthenticated}`,
          },
        }
      );
      alert("Friend request sent!");
      console.log("Request Response:", response.data);
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Failed to send request.");
    }
  };

  // Fetch friends when component mounts
  useEffect(() => {
    showFriends();
  }, []);

  return (
    <div className="friend-container">
      <div className="friend-request-form">
        <h1 className="heading">Send a Friend Request</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            className="send-request-field"
            type="number"
            placeholder="Enter User ID..."
            onChange={(e) => setId(Number(e.target.value))}
          />
          <button className="btn" onClick={handleSendRequests}>
            Send
          </button>
        </form>
        <button className="btn">Undo</button>
      </div>

      <div className="show-friends">
        <h1 className="friend-count">
          {`All Friends (${friends.length})`}
        </h1>
        <div className="friend-card-container">
          {friends.length > 0 ? (
            friends.map((friend) => (
              <div className="container2" key={friend.id}>
                <div className="friend-card">
                  <span><img src={friend.userProfilePic} className="image-profile-pic"/></span>
                  <h1 className="friend-username">{friend.username} is your friend</h1>
                </div>
                <button className="msg">Message</button>
              </div>
            ))
          ) : (
            <p>No friends to display</p>
          )}
        </div>
      </div>
    </div>
  );
}
