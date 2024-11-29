import { useEffect, useState } from "react";
import Navbar from "./navbar";
import Sidebar from "./Sidebar";
import L from "leaflet";
import "../styles/dashboard.css";
import axios from "axios";
import { useAuth } from "../contexts/auth.context";

export default function Dashboard() {
  const [locations, setLocations] = useState([]);
  const { isAuthenticated } = useAuth();

  // Fetch the locations from the backend on component mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/location/get-location", {
          headers: {
            'Authorization': `Bearer ${isAuthenticated}`
          }
        });
        console.log("Longitude and Latitude", response.data.locations);
        setLocations(response.data.locations);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, [isAuthenticated]);

  // Function to fetch address using OpenCage API
  async function getAddressFromCoords(lat: number, lon: number) {
    const apiEndPoint = "https://api.opencagedata.com/geocode/v1/json";
    const apikey = "f09f8dbdd74f4abe94dcbdd01e58a028";
    const query = `${lat},${lon}`;
    const apiurl = `${apiEndPoint}?key=${apikey}&q=${query}&pretty=1`;

    try {
      const response = await fetch(apiurl);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].formatted; 
      } else {
        return "Address not found";
      }
    } catch (error) {
      console.error(error);
      return "Error fetching address";
    }
  }

  // Function to initialize the map for a specific location
  const initializeMap = async (latitude: number, longitude: number, mapId: string) => {
    const map = L.map(mapId).setView([latitude, longitude], 10); // Set map center to location's lat/lon
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "Manish Vishwakarma",
    }).addTo(map);

    // Fetch address using the coordinates
    const address = await getAddressFromCoords(latitude, longitude);

    // Create a new marker for the location and bind the address to the marker
    L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup(address);
  };

  useEffect(() => {
    // Initialize maps for each location
    locations.forEach((location, index) => {
      const mapId = `map-${index}`; // Create a unique map ID for each map
      const { latitude, longitude } = location;

      // Initialize the map for this location
      initializeMap(latitude, longitude, mapId);
    });
  }, [locations]);

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="all-posts">
              {locations.map((location, index) => {
                const mapId = `map-${index}`;
                return (
                  <div className="main-container">
                  <div className="inner-section">
                  <div key={index}>
                    <h2>Location {index + 1}</h2>
                    <div id={mapId} style={{ height: "343px" }}></div>
                    <div className="queries">
                        <a href="query"><button className="bg-blue-400 ml-3 mt-2 w-40 h-9">Ask Queries <i className="fa-regular fa-circle-question"></i></button></a>
                    </div>
                  </div>
                  </div>
              </div>
                );
              })}
        </div>
        <Sidebar />
      </div>
    </div>
  );
}
