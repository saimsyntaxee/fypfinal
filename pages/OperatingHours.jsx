import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../src/components/ui/card"

const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

export default function OperatingHours({ restaurantId }) {
  const [hours, setHours] = useState([])

  useEffect(() => {
    const fetchOperatingHours = async () => {
      try {
        const response = await fetch(`/restromap/restaurant/${restaurantId}/operatinghours/`)
        if (response.ok) {
          const data = await response.json()
          setHours(data)
        } else {
          console.error('Failed to fetch operating hours')
        }
      } catch (error) {
        console.error('Error fetching operating hours:', error)
      }
    }

    fetchOperatingHours()
  }, [restaurantId])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Operating Hours</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {daysOfWeek.map((day) => {
            const dayHours = hours.find(h => h.day_of_week === day)
            return (
              <li key={day} className="flex justify-between items-center p-2 bg-gray-100 rounded-md">
                <span className="font-semibold">{day}</span>
                {dayHours ? (
                  <span>{dayHours.open_time.slice(0, 5)} - {dayHours.close_time.slice(0, 5)}</span>
                ) : (
                  <span className="text-gray-500">Closed</span>
                )}
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}