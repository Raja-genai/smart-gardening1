"use client"

import { useState, useEffect, useRef } from "react"
import { indianCities } from "@/data/indian-cities"
import { Check, ChevronsUpDown, MapPin, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

interface City {
  name: string
  state: string
  lat: string
  lon: string
}

interface CitySelectorProps {
  value?: string
  onChange?: (city: string, lat?: string, lon?: string) => void
  onCitySelect?: (city: City) => void
  defaultCity?: City
}

export function CitySelector({ value, onChange, onCitySelect, defaultCity }: CitySelectorProps) {
  const [open, setOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(value || "")
  const [searchTerm, setSearchTerm] = useState("")
  const [showInvalidAlert, setShowInvalidAlert] = useState(false)
  const initializationDone = useRef(false)
  const { toast } = useToast()
  const [fallbackCityUsed, setFallbackCityUsed] = useState(false)

  const useFallbackCity = () => {
    const delhiCity = indianCities.find((city) => city.name === "Delhi")
    if (delhiCity) {
      handleCitySelect(delhiCity)
    }
  }

  // Helper function to validate if a city exists in our database
  const isValidCity = (cityName: string) => {
    return indianCities.some((city) => {
      const fullName = `${city.name}, ${city.state}`
      return fullName.toLowerCase() === cityName.toLowerCase() || city.name.toLowerCase() === cityName.toLowerCase()
    })
  }

  // Helper function to find city by name
  const findCityByName = (cityName: string) => {
    return indianCities.find((city) => {
      const fullName = `${city.name}, ${city.state}`
      return fullName.toLowerCase() === cityName.toLowerCase() || city.name.toLowerCase() === cityName.toLowerCase()
    })
  }

  // Load saved city from localStorage on mount
  useEffect(() => {
    const savedCity = localStorage.getItem("selected-city")
    if (savedCity && !value) {
      try {
        const cityData = JSON.parse(savedCity)
        // Validate that the saved city still exists in our database
        if (isValidCity(`${cityData.name}, ${cityData.state}`)) {
          const cityFullName = `${cityData.name}, ${cityData.state}`
          setSelectedValue(cityFullName)

          if (onChange) {
            onChange(cityFullName, cityData.lat, cityData.lon)
          }

          if (onCitySelect) {
            onCitySelect(cityData)
          }
        } else {
          // Invalid saved city, use fallback
          localStorage.removeItem("selected-city")
          setFallbackCityUsed(true)
        }
      } catch (error) {
        console.error("Error parsing saved city:", error)
        localStorage.removeItem("selected-city")
        setFallbackCityUsed(true)
      }
    } else if (!value && !savedCity) {
      // No saved city and no value provided, use fallback
      setFallbackCityUsed(true)
    }
    initializationDone.current = true
  }, [])

  // Listen for city updates from other components
  useEffect(() => {
    const handleCityUpdate = (event: CustomEvent) => {
      const city = event.detail
      // Validate the city before using it
      if (isValidCity(`${city.name}, ${city.state}`)) {
        const cityFullName = `${city.name}, ${city.state}`
        setSelectedValue(cityFullName)
      }
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "selected-city" && event.newValue) {
        try {
          const cityData = JSON.parse(event.newValue)
          // Validate the city before using it
          if (isValidCity(`${cityData.name}, ${cityData.state}`)) {
            const cityFullName = `${cityData.name}, ${cityData.state}`
            setSelectedValue(cityFullName)
          }
        } catch (error) {
          console.error("Error parsing city from storage:", error)
        }
      }
    }

    window.addEventListener("cityUpdated", handleCityUpdate as EventListener)
    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("cityUpdated", handleCityUpdate as EventListener)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  // Filter cities based on search term
  const filteredCities = searchTerm
    ? indianCities.filter(
        (city) =>
          city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          city.state.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : indianCities

  // Handle search term change with validation
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)

    // Only show alert if user types something that doesn't match any city
    if (value.length > 2) {
      const hasExactMatches = indianCities.some(
        (city) =>
          city.name.toLowerCase().includes(value.toLowerCase()) ||
          city.state.toLowerCase().includes(value.toLowerCase()) ||
          `${city.name}, ${city.state}`.toLowerCase().includes(value.toLowerCase()),
      )
      setShowInvalidAlert(!hasExactMatches)
    } else {
      setShowInvalidAlert(false)
    }
  }

  // Handle city selection with proper validation
  const handleCitySelect = (city: City) => {
    // Double-check that this is a valid city from our database
    const validCity = indianCities.find((c) => c.name === city.name && c.state === city.state)
    if (!validCity) {
      toast({
        title: "Invalid Location",
        description: "Please select a valid Indian city from the list.",
        variant: "destructive",
      })
      return
    }

    const cityFullName = `${validCity.name}, ${validCity.state}`
    setSelectedValue(cityFullName)
    setShowInvalidAlert(false)
    setSearchTerm("")

    // Save to localStorage for persistence
    localStorage.setItem("selected-city", JSON.stringify(validCity))

    // Dispatch custom event for immediate sync
    window.dispatchEvent(new CustomEvent("cityUpdated", { detail: validCity }))

    // Also update user settings location
    const userSettings = localStorage.getItem("userSettings")
    if (userSettings) {
      try {
        const settings = JSON.parse(userSettings)
        settings.profile.location = cityFullName
        localStorage.setItem("userSettings", JSON.stringify(settings))
      } catch (error) {
        console.error("Error updating user settings:", error)
      }
    }

    if (onChange) {
      onChange(cityFullName, validCity.lat, validCity.lon)
    }

    if (onCitySelect) {
      onCitySelect(validCity)
    }

    setOpen(false)

    toast({
      title: "Location Updated",
      description: `Location set to ${cityFullName}`,
    })
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            {selectedValue ? (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{selectedValue}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>Select your city...</span>
              </div>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search city..." value={searchTerm} onValueChange={handleSearchChange} />
            <CommandList>
              {showInvalidAlert && (
                <div className="p-2">
                  <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800 dark:text-orange-200">
                      No valid Indian cities found. Please select from the available options below.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
              <CommandEmpty>
                {searchTerm.length > 0 ? (
                  <div className="p-4 text-center">
                    <p className="text-sm text-muted-foreground font-medium">No valid locations found</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Please select from the {indianCities.length} available Indian cities
                    </p>
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Start typing to search from {indianCities.length} Indian cities...
                  </div>
                )}
              </CommandEmpty>
              <CommandGroup className="max-h-[300px] overflow-y-auto">
                {filteredCities.map((city) => {
                  const cityFullName = `${city.name}, ${city.state}`
                  return (
                    <CommandItem key={cityFullName} value={cityFullName} onSelect={() => handleCitySelect(city)}>
                      <Check
                        className={cn("mr-2 h-4 w-4", selectedValue === cityFullName ? "opacity-100" : "opacity-0")}
                      />
                      {cityFullName}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
