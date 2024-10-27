import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../src/components/ui/card"
import { Input } from "../src/components/ui/input"
import { Button } from "../src/components/ui/button"
import { Heart } from 'lucide-react'

export default function Menu({ restaurantId }) {
  const [categories, setCategories] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  useEffect(() => {
    fetchCategories()
    fetchMenuItems()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch(`/restromap/restaurant/${restaurantId}/itemcategory/`)
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      } else {
        console.error('Failed to fetch categories')
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchMenuItems = async () => {
    try {
      let url = `/restromap/restaurant/${restaurantId}/menu/`
      if (searchTerm) {
        url += `?search=${searchTerm}`
      }
      if (minPrice && maxPrice) {
        url += `${searchTerm ? '&' : '?'}price__gt=${minPrice}&price__lt=${maxPrice}`
      }
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setMenuItems(data)
      } else {
        console.error('Failed to fetch menu items')
      }
    } catch (error) {
      console.error('Error fetching menu items:', error)
    }
  }

  const handleLike = async (menuId) => {
    try {
      const response = await fetch(`/restromap/restaurant/${restaurantId}/menu/${menuId}/likes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        fetchMenuItems()
      } else {
        console.error('Failed to like menu item')
      }
    } catch (error) {
      console.error('Error liking menu item:', error)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Menu</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="Search dishes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Input
            placeholder="Min price"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <Input
            placeholder="Max price"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <Button onClick={fetchMenuItems}>Search</Button>
        </div>
        {categories.map((category) => (
          <div key={category.id} className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuItems
                .filter((item) => item.itemcategory.id === category.id)
                .map((item) => (
                  <Card key={item.id} className="flex flex-col">
                    <img src={item.menu_item_picture} alt={item.name} className="h-40 object-cover" />
                    <CardContent className="flex-grow flex flex-col justify-between p-4">
                      <div>
                        <h4 className="text-lg font-semibold">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        {item.tag && (
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-2">
                            {item.tag.name}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <span className="font-bold">
                          ${item.discounted_price.toFixed(2)}
                          {item.discount !== "0.00" && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              ${parseFloat(item.price).toFixed(2)}
                            </span>
                          )}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleLike(item.id)}
                        >
                          <Heart className={item.likes > 0 ? "text-red-500 fill-current" : ""} />
                          <span className="ml-1">{item.likes}</span>
                        </Button>
                      </div>
                      {item.variation && (
                        <div className="mt-2">
                          <h5 className="font-semibold mb-1">Variations:</h5>
                          <ul className="space-y-1">
                            {item.menu_variation.map((variation) => (
                              <li key={variation.id} className="flex justify-between text-sm">
                                <span>{variation.name}</span>
                                <span>${variation.discounted_price.toFixed(2)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

