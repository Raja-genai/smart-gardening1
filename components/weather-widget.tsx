"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CitySelector } from "@/components/city-selector"
import { Cloud, CloudRain, Droplets, Wind } from "lucide-react"
import { ApiKeyDialog } from "@/components/api-key-dialog"

interface WeatherData {
  location: string
  temperature: number
  condition: string
  description: string
  humidity: number
  rainfall: number
  windSpeed: number
  icon: string
  timestamp: string
  season: string
}

interface WeatherWidgetProps {
  onError?: () => void
  onCitySelect?: (city: string, lat?: string, lon?: string) => void
}

const WeatherWidget = ({ onError, onCitySelect }: WeatherWidgetProps) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [unit, setUnit] = useState("celsius")
  const [isLoading, setIsLoading] = useState(true)
  const [city, setCity] = useState("Delhi, Delhi")
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false)
  const { toast } = useToast()

  const handleCitySelect = (selectedCity: any) => {
    const cityFullName = `${selectedCity.name}, ${selectedCity.state}`
    setCity(cityFullName)
    getWeather(cityFullName)

    if (onCitySelect) {
      onCitySelect(cityFullName, selectedCity.lat, selectedCity.lon)
    }
  }

  useEffect(() => {
    // Check if we have API keys
    const hasApiKey = !!process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || !!process.env.NEXT_PUBLIC_WEATHER_API_KEY

    if (!hasApiKey) {
      console.log("No API key found in environment variables")
    }

    // Load saved city with validation
    const savedCityData = localStorage.getItem("selected-city")
    if (savedCityData) {
      try {
        const cityData = JSON.parse(savedCityData)
        if (cityData.name && cityData.state) {
          const cityFullName = `${cityData.name}, ${cityData.state}`
          setCity(cityFullName)
          getWeather(cityFullName)
          return
        }
      } catch (error) {
        console.error("Invalid saved city data:", error)
        localStorage.removeItem("selected-city")
      }
    }

    // Default to Delhi if no valid saved city
    setCity("Delhi, Delhi")
    getWeather("Delhi, Delhi")
  }, [])

  const getWeather = async (city: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`, {
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.statusText}`)
      }

      const data = await response.json()
      setWeatherData(data)
    } catch (error: any) {
      console.error("Error fetching weather:", error.message)
      toast({
        title: "Error",
        description: "Failed to fetch weather data. Please try again.",
        variant: "destructive",
      })
      if (onError) {
        onError()
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!city) {
      toast({
        title: "Error",
        description: "Please enter a location.",
        variant: "destructive",
      })
      return
    }
    getWeather(city)
  }

  // Convert temperature based on selected unit
  const getTemperature = () => {
    if (!weatherData) return "--"
    if (unit === "celsius") return Math.round(weatherData.temperature)
    return Math.round((weatherData.temperature * 9) / 5 + 32)
  }

  // Get weather icon URL from OpenWeather
  const getWeatherIconUrl = () => {
    if (!weatherData || !weatherData.icon) return "/placeholder.svg?height=50&width=50"
    return `https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Weather Forecast</CardTitle>
        <CardDescription>{weatherData ? weatherData.location : "Loading weather data..."}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="space-y-2">
            <Label htmlFor="location">Select Location</Label>
            <CitySelector
              value={city}
              onChange={(cityName) => {
                setCity(cityName)
                // Automatically fetch weather when city is selected
                if (cityName) {
                  getWeather(cityName)
                }
              }}
              onCitySelect={handleCitySelect}
            />
          </div>
        </form>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ) : weatherData ? (
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={getWeatherIconUrl() || "/placeholder.svg"}
                  alt={weatherData.condition}
                  className="h-16 w-16"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=50&width=50"
                  }}
                />
                <div>
                  <p className="text-3xl font-semibold">
                    {getTemperature()}°{unit === "celsius" ? "C" : "F"}
                  </p>
                  <p className="text-muted-foreground capitalize">{weatherData.description}</p>
                </div>
              </div>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="celsius">Celsius</SelectItem>
                  <SelectItem value="fahrenheit">Fahrenheit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="flex flex-col items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Droplets className="h-5 w-5 text-blue-500 mb-1" />
                <span className="text-xs text-muted-foreground">Humidity</span>
                <span className="font-medium">{weatherData.humidity}%</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Wind className="h-5 w-5 text-blue-500 mb-1" />
                <span className="text-xs text-muted-foreground">Wind</span>
                <span className="font-medium">{weatherData.windSpeed} km/h</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <CloudRain className="h-5 w-5 text-blue-500 mb-1" />
                <span className="text-xs text-muted-foreground">Rain</span>
                <span className="font-medium">{weatherData.rainfall} mm</span>
              </div>
            </div>

            <div className="text-sm text-muted-foreground mt-2">
              <p>
                Current Season: <span className="font-medium">{weatherData.season}</span>
              </p>
              <p className="text-xs mt-1">Last updated: {new Date(weatherData.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center">
            <Cloud className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p>Unable to load weather data</p>
            <button onClick={() => getWeather(city)} className="text-sm text-blue-500 hover:text-blue-700 mt-2">
              Try again
            </button>
          </div>
        )}
      </CardContent>

      {showApiKeyDialog && (
        <ApiKeyDialog
          open={showApiKeyDialog}
          onOpenChange={setShowApiKeyDialog}
          onSave={() => {
            toast({
              title: "API Key Saved",
              description: "Your OpenWeather API key has been saved.",
            })
            getWeather(city)
          }}
        />
      )}
    </Card>
  )
}

export default WeatherWidget
