import { Button } from "./ui/button";
import { Input } from "./ui/input";
import React, { useState, useEffect } from "react";

export default function Hero() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [cities, setCities] = useState([
    { id: 1, name: "New York" },
    { id: 2, name: "Los Angeles" },
    { id: 3, name: "Chicago" },
    { id: 4, name: "Houston" },
    { id: 5, name: "Phoenix" },
    { id: 6, name: "Philadelphia" },
    { id: 7, name: "San Antonio" },
    { id: 8, name: "San Diego" },
    { id: 9, name: "Dallas" },
    { id: 10, name: "San Jose" },
  ]);
  
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    address: "",
    city: null,
  });

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          console.log("Geolocation successful:", position);
          setLocation({
            ...location,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => {
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
    setLocation({ ...location, city: selectedCityId });
  };

  const handleSaveLocation = () => {
    console.log("Location data to be sent:", location);
    fetch("http://127.0.0.1:8000/restromap/location/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(location),
    })
      .then(response => {
        if (response.ok) {
          alert("Location saved successfully");
          setModalOpen(false);
        } else {
          alert("Failed to save location");
          console.error("Error response:", response);
        }
      })
      .catch(error => {
        console.error("Error posting location:", error);
        alert("An error occurred while saving your location.");
      });
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
              <select id="city" className="w-full mt-1 border rounded p-2" onChange={handleCitySelect}>
                <option value="">Select your city</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>

            <Button variant="outline" className="w-full bg-white border-blue-500 text-blue-500" onClick={getCurrentLocation}>
              Use Current Location
            </Button>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button variant="default" onClick={handleSaveLocation}>OK</Button>
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
