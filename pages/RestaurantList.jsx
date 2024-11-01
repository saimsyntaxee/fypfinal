import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "../src/components/ui/card";
import { Input } from "../src/components/ui/input";
import { Button } from "../src/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../src/components/ui/select";

const apiurl = import.meta.env.VITE_API_URL;

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]); // Initialize as an empty array
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [dishName, setDishName] = useState('');
  const [seatReservation, setSeatReservation] = useState(false);
  const [eventBooking, setEventBooking] = useState(false);
  const [sortOrder, setSortOrder] = useState('');
  const [cities, setCities] = useState([]); // Initialize cities as an empty array
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${apiurl}/restromap/city/`);
        setCities(response.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    if (selectedCity && dishName) {
      fetchRestaurantsByDish();
    }
  }, [selectedCity, dishName]);

  const fetchRestaurantsByDish = async () => {
    try {
      const url = `${apiurl}/restromap/search_by_dish/?city=${selectedCity}&search_term=${dishName}`;
      const response = await axios.get(url);
      if (response.status === 200) {
        setRestaurants(response.data);
      } else {
        console.error('Failed to fetch restaurants by dish');
      }
    } catch (error) {
      setError('Error fetching restaurants');
      console.error('Error fetching restaurants:', error);
    }
  };

  const handleRestaurantClick = async (restaurantId) => {
    try {
      const response = await axios.get(`${apiurl}/restromap/restaurant/${restaurantId}/`);
      if (response.status === 200) {
        const restaurantDetails = response.data;
        // Handle restaurant details as needed (e.g., show modal or navigate to details page)
        console.log(restaurantDetails);
      } else {
        console.error('Failed to fetch restaurant details');
      }
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Search Restaurants by Dish</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4 mb-6">
          <Select onValueChange={setSelectedCity}>
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map(city => (
                <SelectItem key={city.id} value={city.id}>{city.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Enter dish name"
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
          />
          <Button onClick={fetchRestaurantsByDish}>Search</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.isArray(restaurants) && restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <Card key={restaurant.id} onClick={() => handleRestaurantClick(restaurant.id)}>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                  <p className="text-sm text-gray-600">{restaurant.address}</p>
                  <div className="flex items-center mt-2">
                    {/* Additional restaurant details */}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No restaurants available</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}