import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Phone, Users } from 'lucide-react';

export function SeatReservation({ restaurantId, seatReservationOffered = false }) {
  const [reservations, setReservations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    seats: '',
    phone_number: '',
    date: '',
    time: ''
  });

  useEffect(() => {
    if (seatReservationOffered) {
      fetchReservations();
    }
  }, [seatReservationOffered]);

  const fetchReservations = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/restromap/restaurant/${restaurantId}/seatreservation/`);
      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:8000/restromap/restaurant/${restaurantId}/seatreservation/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        fetchReservations();
        setShowForm(false);
        setFormData({ seats: '', phone_number: '', date: '', time: '' });
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/restromap/restaurant/${restaurantId}/seatreservation/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchReservations();
      }
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

  if (!seatReservationOffered) return null;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          Seat Reservations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {reservations.length === 0 ? (
          <Alert className="bg-gray-50">
            <AlertTitle className="text-gray-700">No reservations</AlertTitle>
            <AlertDescription>You have not reserved any seats.</AlertDescription>
          </Alert>
        ) : (
          <div className="grid gap-4">
            {reservations.map((reservation) => (
              <div key={reservation.id} 
                   className="flex justify-between items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{reservation.seats} seats</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{reservation.date}</span>
                    <Clock className="w-4 h-4 ml-2" />
                    <span>{reservation.time}</span>
                  </div>
                  <div className="text-sm font-medium" style={{
                    color: reservation.status === 'C' ? 'green' : 
                           reservation.status === 'ARR' ? 'blue' : 'orange'
                  }}>
                    Status: {reservation.status}
                  </div>
                </div>
                {reservation.status !== 'C' && reservation.status !== 'ARR' && (
                  <Button 
                    onClick={() => handleDelete(reservation.id)} 
                    variant="destructive"
                    className="ml-4"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {!showForm ? (
          <Button 
            onClick={() => setShowForm(true)}
            className="w-full md:w-auto"
          >
            Make New Reservation
          </Button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="seats" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Number of Seats
                </Label>
                <Input
                  id="seats"
                  type="number"
                  value={formData.seats}
                  onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                  className="bg-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone_number" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  className="bg-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="bg-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="bg-white"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1 md:flex-none">Submit Reservation</Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowForm(false)}
                className="flex-1 md:flex-none"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}