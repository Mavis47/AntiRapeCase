import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Layout() {
  
  const navigate = useNavigate();

    const handleLogout = async() => {
        await axios.post("http://localhost:5001/api/auth/logout",{},{
          withCredentials: true
        });
        alert("logged-out Successfully");
        navigate('/login');
    }

    const handleImInTrouble = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            console.log("Latitude & Longitude:", latitude, longitude);
  
            try {
              // Send the location to the backend
              await axios.post(
                "http://localhost:5001/api/location/add-location",
                { latitude, longitude },
                { withCredentials: true }
              );
              navigate("/dashboard");
              alert("Your location has been sent successfully.");
            } catch (error) {
              console.error("Error sending location:", error);
              alert("Failed to send location. Please try again.");
            }
          },
          (error) => {
            console.error("Error fetching location:", error);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    }

  return (
    <div>
        <button type="submit" onClick={handleLogout}>Logout</button>
        <button><Link to="/dashboard">Dashboard</Link></button>
        <button onClick={handleImInTrouble}>I'm In Trouble</button>
    </div>
  )
}
