'use client'

import { useState, useEffect } from 'react'
import { Button } from "../src/components/ui/button"
import { Input } from "../src/components/ui/input"
import { Label } from "../src/components/ui/label"
import { Textarea } from "../src/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "../src/components/ui/alert"


export default function EventBooking({ restaurantId, eventBookingOffered = false }) {
  const [bookings, setBookings] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    event_name: '',
    number_of_people: '',
    description: '',
    date: '',
    start_time: '',
    end_time: '',
    phone_number: ''
  })

  useEffect(() => {
    if (eventBookingOffered) {
      fetchBookings()
    }
  }, [eventBookingOffered])

  const fetchBookings = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/restromap/restaurant/${restaurantId}/eventbooking/`)
      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      } else {
        console.error('Failed to fetch event bookings')
      }
    } catch (error) {
      console.error('Error fetching event bookings:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (new Date(`2000-01-01T${formData.start_time}`) >= new Date(`2000-01-01T${formData.end_time}`)) {
      alert('Start time must be before end time')
      return
    }
    try {
      const response = await fetch(`http://127.0.0.1:8000/restromap/restaurant/${restaurantId}/eventbooking/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        fetchBookings()
        setShowForm(false)
        setFormData({ event_name: '', number_of_people: '', description: '', date: '', start_time: '', end_time: '', phone_number: '' })
      } else {
        console.error('Failed to create event booking')
      }
    } catch (error) {
      console.error('Error creating event booking:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/restromap/restaurant/${restaurantId}/eventbooking/${id}/`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchBookings()
      } else {
        console.error('Failed to delete event booking')
      }
    } catch (error) {
      console.error('Error deleting event booking:', error)
    }
  }

  if (!eventBookingOffered) {
    return null
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Event Bookings</h2>
      {bookings.length === 0 ? (
        <Alert>
          <AlertTitle>No event bookings</AlertTitle>
          <AlertDescription>You haven't uploaded any Event Booking.</AlertDescription>
        </Alert>
      ) : (
        <ul className="space-y-2">
          {bookings.map((booking) => (
            <li key={booking.id} className="p-2 border rounded">
              <p>Event: {booking.event_name}</p>
              <p>People: {booking.number_of_people}</p>
              <p>Description: {booking.description}</p>
              <p>Date: {booking.date}</p>
              <p>Time: {booking.start_time} - {booking.end_time}</p>
              <p>Phone: {booking.phone_number}</p>
              <p>Status: {booking.status}</p>
              {booking.status !== 'C' && booking.status !== 'ARR' && (
                <Button onClick={() => handleDelete(booking.id)} variant="destructive">Delete</Button>
              )}
            </li>
          ))}
        </ul>
      )}
      {!showForm ? (
        <Button onClick={() => setShowForm(true)}>Book Event</Button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="event_name">Event Name</Label>
            <Input
              id="event_name"
              value={formData.event_name}
              onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="number_of_people">Number of People</Label>
            <Input
              id="number_of_people"
              type="number"
              value={formData.number_of_people}
              onChange={(e) => setFormData({ ...formData, number_of_people: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="start_time">Start Time</Label>
            <Input
              id="start_time"
              type="time"
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="end_time">End Time</Label>
            <Input
              id="end_time"
              type="time"
              value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              id="phone_number"
              type="tel"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              required
            />
          </div>
          <Button type="submit">Submit Event Booking</Button>
        </form>
      )}
    </div>
  )
}