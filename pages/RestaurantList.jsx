import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../src/components/ui/card"
import { Input } from "../src/components/ui/input"
import { Button } from "../src/components/ui/button"
import { Checkbox } from "../src/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../src/components/ui/select"

export default function RestaurantList({ cityOptions }) { // Pass city options as a prop
  const [restaurants, setRestaurants] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [dishName, setDishName] = useState('')
  const [seatReservation, setSeatReservation] = useState(false)
  const [eventBooking, setEventBooking] = useState(false)
  const [sortOrder, setSortOrder] = useState('')

  useEffect(() => {
    if (selectedCity && dishName) {
      fetchRestaurantsByDish()
    }
  }, [selectedCity, dishName])

  const fetchRestaurantsByDish = async () => {
    try {
      const url = `http://127.0.0.1:8000/restromap/search_by_dish/?city=${selectedCity}&search_term=${dishName}`
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setRestaurants(data)
      } else {
        console.error('Failed to fetch restaurants by dish')
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error)
    }
  }

  const handleRestaurantClick = async (restaurantId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/restromap/restaurant/${restaurantId}/`)
      if (response.ok) {
        const restaurantDetails = await response.json()
        // Handle restaurant details as needed (e.g., show modal or navigate to details page)
        console.log(restaurantDetails)
      } else {
        console.error('Failed to fetch restaurant details')
      }
    } catch (error) {
      console.error('Error fetching restaurant details:', error)
    }
  }

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
              {cityOptions.map(city => (
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
          {restaurants.map((restaurant) => (
            <Card key={restaurant.id} onClick={() => handleRestaurantClick(restaurant.id)}>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                <p className="text-sm text-gray-600">{restaurant.address}</p>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span>{restaurant.rating.toFixed(1)}</span>
                </div>
                {restaurant.seat_reservation && (
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-2 mr-2">
                    Seat Reservation
                  </span>
                )}
                {restaurant.event_booking && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-2">
                    Event Booking
                  </span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
