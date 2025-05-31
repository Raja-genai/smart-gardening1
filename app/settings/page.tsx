"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { CitySelector } from "@/components/city-selector"

export default function SettingsPage() {
  const { toast } = useToast()
  const [isMetric, setIsMetric] = useState(true)
  const [selectedCity, setSelectedCity] = useState<{
    name: string
    state: string
    lat: number
    lon: number
    fullName: string
  } | null>(null)

  useEffect(() => {
    const storedCity = localStorage.getItem("selected-city")
    if (storedCity) {
      setSelectedCity(JSON.parse(storedCity))
    }

    const storedIsMetric = localStorage.getItem("is-metric")
    if (storedIsMetric) {
      setIsMetric(JSON.parse(storedIsMetric))
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "selected-city" && event.newValue) {
        setSelectedCity(JSON.parse(event.newValue))
      }
      if (event.key === "is-metric" && event.newValue) {
        setIsMetric(JSON.parse(event.newValue))
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  return (
    <div className="container max-w-4xl py-6">
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Manage your app preferences and settings.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="metric"
              checked={isMetric}
              onCheckedChange={(checked) => {
                setIsMetric(checked)
                localStorage.setItem("is-metric", JSON.stringify(checked))

                // Trigger storage event for cross-component sync
                window.dispatchEvent(
                  new StorageEvent("storage", {
                    key: "is-metric",
                    newValue: JSON.stringify(checked),
                  }),
                )

                toast({
                  title: "Measurement Updated",
                  description: `Units set to ${checked ? "metric" : "imperial"}`,
                })
              }}
            />
            <Label htmlFor="metric">Use Metric Units</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Garden Location</Label>
            <CitySelector
              value={selectedCity ? `${selectedCity.name}, ${selectedCity.state}` : ""}
              onChange={() => {}} // Handled by onCitySelect
              onCitySelect={(city) => {
                const cityData = {
                  name: city.name,
                  state: city.state,
                  lat: city.lat,
                  lon: city.lon,
                  fullName: `${city.name}, ${city.state}`,
                }

                setSelectedCity(cityData)
                localStorage.setItem("selected-city", JSON.stringify(cityData))

                // Trigger storage event for cross-component sync
                window.dispatchEvent(
                  new StorageEvent("storage", {
                    key: "selected-city",
                    newValue: JSON.stringify(cityData),
                  }),
                )

                toast({
                  title: "Location Updated",
                  description: `Garden location set to ${cityData.fullName}`,
                })
              }}
            />
            <p className="text-sm text-muted-foreground">
              Select your garden's location from verified Indian cities for accurate weather and soil data.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
