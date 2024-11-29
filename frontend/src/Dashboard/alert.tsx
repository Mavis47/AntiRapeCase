import axios from "axios"
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/auth.context";

interface Notification {
    id: number;
    type: string;
    message: string;
    createdAt: string;
    read: boolean;
  }
  export default function Alert() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { isAuthenticated } = useAuth();
  
    const getNotification = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/notification/get-notification",
          {
            headers: {
              Authorization: `Bearer ${isAuthenticated}`,
            },
          }
        );
        console.log(response.data);
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
  
    useEffect(() => {
      getNotification();
    }, []);
  
    const handleAction = async (notificationId: number,action: string,type: string) => {
      try {
        let url = "";
        let payload = {};
  
        if (type === "friend_request") {
          url = "http://localhost:5001/api/request/receiveRequest";
          payload = { requestId: notificationId, action }; 
        } 
        const response = await axios.post(url, payload, {
          headers: {
            Authorization: `Bearer ${isAuthenticated}`,
          },
        });
  
        console.log("Action response:", response.data);

        setNotifications((prev) =>
          prev.filter((notification) => notification.id !== notificationId)
        );
      } catch (error) {
        console.error("Error processing notification action:", error);
      }
    };
  
    const renderNotificationContent = (notification: Notification) => {
      switch (notification.type) {
        case "friend_request":
          return (
            <div>
              <p>{notification.message}</p>
              <div className="flex space-x-2 mt-2">
                <button
                  className="px-4 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() =>
                    handleAction(notification.id, "accept", "friend_request")
                  }
                >
                  Accept
                </button>
                <button
                  className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() =>
                    handleAction(notification.id, "reject", "friend_request")
                  }
                >
                  Reject
                </button>
              </div>
            </div>
          );
  
        case "message_conversation":
          return (
            <div>
              <p>{notification.message}</p>
              <button
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => console.log("Navigate to chat")}
              >
                Open Conversation
              </button>
            </div>
          );
  
        case "message":
          return (
            <div>
              <p>{notification.message}</p>
              <button
                className="px-4 py-2 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                onClick={() => handleAction(notification.id, "", "message")}
              >
                Mark as Read
              </button>
            </div>
          );

          case "friend_request_response":
            return (
              <div>
                <p>{notification.message}</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            );
  
        default:
          return <p>{notification.message}</p>;
      }
    };
  
    return (
      <div>
        <div className="p-4 bg-gray-50 dark:bg-gray-900">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Alerts
          </h1>
          <div className="space-y-3">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md"
                >
                  <h2 className="font-medium text-lg text-gray-800 dark:text-gray-200">
                    {notification.type.toUpperCase()}
                  </h2>
                  {renderNotificationContent(notification)}
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No notifications to show.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }