"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, CloudRain, Sun, CloudSun, CloudFog } from "lucide-react"
import { format } from "date-fns"

interface ForecastDay {
  date: string
  temperature: number
  condition: string
  description: string
  humidity: number
  rainfall: number
  windSpeed: number
  icon: string
}

interface ForecastWidgetProps {
  city?: string
}

export function ForecastWidget({ city = "Delhi" }: ForecastWidgetProps) {
  const [forecast, setForecast] = useState<ForecastDay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchForecast = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}&forecast=true`, {
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch forecast: ${response.statusText}`)
        }

        const data = await response.json()
        if (data.forecast && Array.isArray(data.forecast)) {
          setForecast(data.forecast)
        } else {
          throw new Error("Invalid forecast data format")
        }
      } catch (err: any) {
        console.error("Error fetching forecast:", err)
        setError(err.message || "Failed to load forecast")
      } finally {
        setIsLoading(false)
      }
    }

    if (city) {
      fetchForecast()
    }
  }, [city])

  // Get weather icon based on condition
  const getWeatherIcon = (condition: string, icon: string) => {
    // If we have an OpenWeather icon code, use it
    if (icon) {
      return (
        <img
          src={`https://openweathermap.org/img/wn/${icon}.png`}
          alt={condition}
          className="h-8 w-8"
          onError={(e) => {
            // Fallback to our own icons if the image fails to load
            e.currentTarget.style.display = "none"
            const parent = e.currentTarget.parentElement
            if (parent) {
              const iconElement = document.createElement("div")
              iconElement.className = "h-8 w-8 flex items-center justify-center"
              iconElement.innerHTML = getFallbackIcon(condition)
              parent.appendChild(iconElement)
            }
          }}
        />
      )
    }

    // Fallback to our own icons
    return <div className="h-8 w-8 flex items-center justify-center">{getFallbackIcon(condition)}</div>
  }

  const getFallbackIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase()
    if (lowerCondition.includes("rain") || lowerCondition.includes("drizzle")) {
      return <CloudRain className="h-6 w-6 text-blue-500" />
    } else if (lowerCondition.includes("cloud")) {
      return <Cloud className="h-6 w-6 text-gray-500" />
    } else if (lowerCondition.includes("fog") || lowerCondition.includes("mist")) {
      return <CloudFog className="h-6 w-6 text-gray-400" />
    } else if (lowerCondition.includes("partly")) {
      return <CloudSun className="h-6 w-6 text-yellow-500" />
    } else {
      return <Sun className="h-6 w-6 text-yellow-500" />
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, "EEE, MMM d")
    } catch (err) {
      return dateString
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>5-Day Forecast</CardTitle>
        <CardDescription>{city}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <Cloud className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {forecast.map((day, index) => (
              <div key={index} className="flex items-center justify-between border-b last:border-0 pb-2 last:pb-0">
                <div className="font-medium">{formatDate(day.date)}</div>
                <div className="flex items-center">{getWeatherIcon(day.condition, day.icon)}</div>
                <div className="text-right">
                  <span className="font-medium">{Math.round(day.temperature)}°C</span>
                  <div className="text-xs text-muted-foreground capitalize">{day.condition}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
