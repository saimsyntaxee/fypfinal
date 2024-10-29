import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../src/components/ui/card"
import { Input } from "../src/components/ui/input"
import { Button } from "../src/components/ui/button"
import { Checkbox } from "../src/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../src/components/ui/select"

export default function RestaurantList({ city }) {
  const [restaurants, setRestaurants] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [seatReservation, setSeatReservation] = useState(false)
  const [eventBooking, setEventBooking] = useState(false)
  const [sortOrder, setSortOrder] = useState('')

  useEffect(() => {
    fetchRestaurants()
  }, [searchTerm, seatReservation, eventBooking, sortOrder])

  const fetchRestaurants = async () => {
    try {
      let url = `/restromap/restaurant/?city=${city}`
      if (searchTerm) url += `&search=${searchTerm}`
      if (seatReservation) url += '&seat_reservation=true'
      if (eventBooking) url += '&event_booking=true'
      if (sortOrder) url += `&ordering=${sortOrder === 'asc' ? '' : '-'}rating`

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setRestaurants(data)
      } else {
        console.error('Failed to fetch restaurants')
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Restaurants in {city}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4 mb-6">
          <Input
            placeholder="Search restaurants"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <Checkbox
              id="seatReservation"
              checked={seatReservation}
              onCheckedChange={setSeatReservation}
            />
            <label htmlFor="seatReservation">Offers Seat Reservation</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="eventBooking"
              checked={eventBooking}
              onCheckedChange={setEventBooking}
            />
            <label htmlFor="eventBooking">Offers Event Booking</label>
          </div>
          <Select onValueChange={setSortOrder}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Rating (Low to High)</SelectItem>
              <SelectItem value="desc">Rating (High to Low)</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchRestaurants}>Apply Filters</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {restaurants.map((restaurant) => (
            <Card key={restaurant.id}>
              <CardContent  className="p-4">
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