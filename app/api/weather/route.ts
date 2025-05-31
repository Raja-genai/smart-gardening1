import { NextResponse } from "next/server"

// Mock weather data function
function getMockWeatherData(city: string, forecast = false) {
  const mockCurrentWeather = {
    location: city,
    temperature: 25,
    condition: "Sunny",
    description: "Clear sky",
    humidity: 60,
    rainfall: 0,
    windSpeed: 10,
    icon: "01d",
    timestamp: new Date().toISOString(),
    season: getCurrentSeason(),
  }

  if (forecast) {
    return {
      location: city,
      country: "India",
      forecast: Array.from({ length: 5 }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        temperature: 25 + Math.random() * 10,
        condition: ["Sunny", "Partly Cloudy", "Cloudy"][Math.floor(Math.random() * 3)],
        description: "Weather description",
        humidity: 50 + Math.random() * 30,
        rainfall: Math.random() * 5,
        windSpeed: 5 + Math.random() * 15,
        icon: "01d",
      })),
      timestamp: new Date().toISOString(),
      season: getCurrentSeason(),
    }
  }

  return mockCurrentWeather
}

function getCurrentSeason() {
  const month = new Date().getMonth()
  if (month >= 2 && month <= 4) return "Spring"
  if (month >= 5 && month <= 7) return "Summer"
  if (month >= 8 && month <= 10) return "Fall"
  return "Winter"
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city")
  const forecast = searchParams.get("forecast") === "true"
  const mock = searchParams.get("mock") === "true"

  console.log("Weather API called with:", { city, forecast, mock })

  if (!city) {
    return NextResponse.json({ error: "City parameter is required" }, { status: 400 })
  }

  // If mock data is requested, return mock data
  if (mock) {
    console.log("Returning mock data for:", city)
    return NextResponse.json(getMockWeatherData(city, forecast))
  }

  // Get API key from environment variable
  const apiKey = process.env.OPENWEATHER_API_KEY

  if (!apiKey) {
    console.log("No API key found, returning mock data")
    return NextResponse.json(getMockWeatherData(city, forecast))
  }

  console.log("Using real API key for weather data")

  try {
    let weatherUrl: string

    if (forecast) {
      // 5-day forecast
      weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
    } else {
      // Current weather
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
    }

    const response = await fetch(weatherUrl, {
      cache: "no-store",
    })

    if (!response.ok) {
      console.error(`OpenWeather API error: ${response.status} ${response.statusText}`)
      return NextResponse.json(getMockWeatherData(city, forecast))
    }

    const data = await response.json()

    if (forecast) {
      // Transform forecast data
      const transformedData = {
        location: data.city.name,
        country: data.city.country,
        forecast: data.list.slice(0, 5).map((item: any) => ({
          date: new Date(item.dt * 1000).toISOString().split("T")[0],
          temperature: Math.round(item.main.temp),
          condition: item.weather[0].main,
          description: item.weather[0].description,
          humidity: item.main.humidity,
          rainfall: item.rain?.["3h"] || 0,
          windSpeed: Math.round(item.wind.speed * 3.6), // Convert m/s to km/h
          icon: item.weather[0].icon,
        })),
        timestamp: new Date().toISOString(),
        season: getCurrentSeason(),
      }
      return NextResponse.json(transformedData)
    } else {
      // Transform current weather data
      const transformedData = {
        location: data.name,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        rainfall: data.rain?.["1h"] || 0,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        icon: data.weather[0].icon,
        timestamp: new Date().toISOString(),
        season: getCurrentSeason(),
      }
      return NextResponse.json(transformedData)
    }
  } catch (error) {
    console.error("Error fetching weather data:", error)
    return NextResponse.json(getMockWeatherData(city, forecast))
  }
}
