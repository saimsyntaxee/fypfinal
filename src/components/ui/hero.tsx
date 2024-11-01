import { Button } from "../ui/button";
import { Input } from "../ui/input";
import React, { useState, useEffect } from "react";
import axios from 'axios';

const apiurl = import.meta.env.VITE_API_URL;

export default function Hero() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    address: "",
    city: null,
  });
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${apiurl}/restromap/city/`);
        setCities(response.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    const fetchUserLocation = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.get(`${apiurl}/restromap/location/`, {
          headers: { Authorization: `JWT ${token}` },
        });
        if (response.data) {
          setUserLocation(response.data);
          setLocation({
            latitude: response.data.latitude,
            longitude: response.data.longitude,
            address: response.data.address,
            city: response.data.city.id,
          });
        }
      } catch (error) {
        console.error("Error fetching user location:", error);
      }
    };

    fetchCities();
    fetchUserLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log("Geolocation successful:", position);
          const { latitude, longitude } = position.coords;

          try {
            const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
              params: {
                q: `${latitude},${longitude}`,
                key: '26f8234e2ad747c5b2e6a526089c9f9f', // Replace with your OpenCage API key
              },
            });

            if (response.data.status.code === 200) {
              const address = response.data.results[0].formatted;
              setLocation((prevLocation) => ({
                ...prevLocation,
                latitude,
                longitude,
                address,
              }));
            } else {
              console.error("Geocoding error:", response.data.status.message);
              alert("Unable to retrieve your address. Please try again.");
            }
          } catch (error) {
            console.error("Geocoding error:", error);
            alert("An error occurred while retrieving your address.");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Unable to retrieve your location. Please allow location access.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleCitySelect = (e) => {
    const selectedCityId = e.target.value;
    setLocation((prevLocation) => ({
      ...prevLocation,
      city: selectedCityId,
    }));
  };

  const handleSaveLocation = async () => {
    const token = localStorage.getItem('access_token');
    setLoading(true);
    try {
      const response = await axios.get(`${apiurl}/restromap/location/`, {
        headers: { Authorization: `JWT ${token}` },
      });

      if (response.data && response.data.latitude && response.data.longitude) {
        // Update existing location
        if (response.data.latitude !== location.latitude || response.data.longitude !== location.longitude) {
          await axios.put(`${apiurl}/restromap/location/${response.data.id}/`, location, {
            headers: { Authorization: `JWT ${token}` },
          });
          alert("Location updated successfully");
        }
      } else {
        // Create new location
        await axios.post(`${apiurl}/restromap/location/`, location, {
          headers: { Authorization: `JWT ${token}` },
        });
        alert("Location saved successfully");
      }
      setModalOpen(false);
    } catch (error) {
      console.error("Error saving location:", error);
      alert("An error occurred while saving your location.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-col items-center justify-center flex-1 p-4 text-center md:flex-row md:text-left md:justify-between md:p-8">
        <div className="space-y-4 md:w-1/2">
          <h1 className="text-3xl font-bold leading-tight md:text-5xl">
            Your Intelligent Guide to Local Dining
          </h1>
          <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <Input placeholder="Your street and street number" className="w-full" />
            <Button variant="outline" className="bg-white border-pink-600 text-pink-600" onClick={() => setModalOpen(true)}>
              <LocateIcon className="h-5 w-5 mr-2" />
              Locate me
            </Button>
            <Button variant="default" className="bg-pink-600 text-white">
              Find food
            </Button>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg space-y-4">
            <h2 className="text-xl font-semibold">Enter Your Location</h2>
            
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
              <select id="city" className="w-full mt-1 border rounded p-2" onChange={handleCitySelect} value={location.city || ""}>
                <option value="">Select your city</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>

            <Button variant="outline" className="w-full bg-white border-blue-500 text-blue-500" onClick={getCurrentLocation}>
              Use Current Location
            </Button>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button variant="default" onClick={handleSaveLocation} disabled={loading}>
                {loading ? "Saving..." : "OK"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LocateIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="2" x2="5" y1="12" y2="12" />
      <line x1="19" x2="22" y1="12" y2="12" />
      <line x1="12" x2="12" y1="2" y2="5" />
      <line x1="12" x2="12" y1="19" y2="22" />
      <circle cx="12" cy="12" r="7" />
    </svg>
  );
}