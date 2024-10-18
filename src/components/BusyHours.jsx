import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../src/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../src/components/ui/select"

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

export default function BusyHours({ restaurantId }) {
  const [busyHours, setBusyHours] = useState([])
  const [selectedDay, setSelectedDay] = useState('ALL')

  useEffect(() => {
    fetchBusyHours()
  }, [selectedDay])

  const fetchBusyHours = async () => {
    try {
      let url = `/restromap/restaurant/${restaurantId}/busyhours/`
      if (selectedDay !== 'ALL') {
        url += `?day_of_week=${selectedDay}`
      }
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setBusyHours(data)
      } else {
        console.error('Failed to fetch busy hours')
      }
    } catch (error) {
      console.error('Error fetching busy hours:', error)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Busy Hours</CardTitle>
      </CardHeader>
      <CardContent>
        <Select onValueChange={setSelectedDay} defaultValue={selectedDay}>
          <SelectTrigger className="w-full mb-4">
            <SelectValue placeholder="Select day" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Days</SelectItem>
            {daysOfWeek.map(day => (
              <SelectItem key={day} value={day}>{day}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="space-y-4">
          {busyHours.map((hour) => (
            <div key={hour.id} className="flex flex-col">
              <div className="flex justify-between mb-1">
                <span>{hour.day_of_week}</span>
                <span>{hour.time_from.slice(0, 5)} - {hour.time_to.slice(0, 5)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(hour.rate / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}