"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Edit2, Trash2, RefreshCw, Info, MapPin } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getMethodsForPlant } from "@/data/gardening-methods"
import { SoilInfo } from "@/components/soil-info"

interface Plant {
  id: string
  name: string
  type: string
  emoji: string
  growthDays: number
  description: string
  waterNeeds: "low" | "medium" | "high"
  sunNeeds: "shade" | "partial" | "full"
  soilType: "red" | "black" | "alluvial" | "sandy" | "clay" | "loamy" | "any"
  soilPH: "acidic" | "neutral" | "alkaline" | "any"
}

interface PlacedPlant {
  id: string
  plantId: string
  x: number
  y: number
  plantedDate: string
}

// Refined plant data - only efficient garden plants
const HARDCODED_PLANTS: Plant[] = [
  // RED SOIL PLANTS - Garden Efficient
  {
    id: "tomato",
    name: "Tomato",
    type: "Vegetables",
    emoji: "🍅",
    growthDays: 75,
    description: "Juicy red tomatoes perfect for home gardens in red soil",
    waterNeeds: "medium",
    sunNeeds: "full",
    soilType: "red",
    soilPH: "acidic",
  },
  {
    id: "chili",
    name: "Chili",
    type: "Vegetables",
    emoji: "🌶️",
    growthDays: 75,
    description: "Spicy chilies that thrive in red soil gardens",
    waterNeeds: "medium",
    sunNeeds: "full",
    soilType: "red",
    soilPH: "acidic",
  },
  {
    id: "okra",
    name: "Okra (Bhindi)",
    type: "Vegetables",
    emoji: "🌶️",
    growthDays: 60,
    description: "Easy-to-grow okra for red soil gardens",
    waterNeeds: "medium",
    sunNeeds: "full",
    soilType: "red",
    soilPH: "neutral",
  },
  {
    id: "drumstick",
    name: "Drumstick (Moringa)",
    type: "Vegetables",
    emoji: "🌿",
    growthDays: 180,
    description: "Nutritious drumstick tree for red soil",
    waterNeeds: "low",
    sunNeeds: "full",
    soilType: "red",
    soilPH: "neutral",
  },

  // BLACK SOIL PLANTS - Garden Efficient
  {
    id: "eggplant",
    name: "Eggplant (Brinjal)",
    type: "Vegetables",
    emoji: "🍆",
    growthDays: 80,
    description: "Purple eggplant perfect for black soil gardens",
    waterNeeds: "medium",
    sunNeeds: "full",
    soilType: "black",
    soilPH: "neutral",
  },
  {
    id: "onion",
    name: "Onion",
    type: "Vegetables",
    emoji: "🧅",
    growthDays: 105,
    description: "Essential onions for black soil gardens",
    waterNeeds: "low",
    sunNeeds: "full",
    soilType: "black",
    soilPH: "neutral",
  },
  {
    id: "garlic",
    name: "Garlic",
    type: "Vegetables",
    emoji: "🧄",
    growthDays: 180,
    description: "Flavorful garlic bulbs for black soil",
    waterNeeds: "low",
    sunNeeds: "full",
    soilType: "black",
    soilPH: "neutral",
  },
  {
    id: "sunflower",
    name: "Sunflower",
    type: "Flowers",
    emoji: "🌻",
    growthDays: 85,
    description: "Bright sunflowers perfect for black soil gardens",
    waterNeeds: "medium",
    sunNeeds: "full",
    soilType: "black",
    soilPH: "neutral",
  },

  // ALLUVIAL SOIL PLANTS - Garden Efficient
  {
    id: "spinach",
    name: "Spinach (Palak)",
    type: "Vegetables",
    emoji: "🥬",
    growthDays: 45,
    description: "Leafy spinach for alluvial soil gardens",
    waterNeeds: "medium",
    sunNeeds: "partial",
    soilType: "alluvial",
    soilPH: "neutral",
  },
  {
    id: "fenugreek",
    name: "Fenugreek (Methi)",
    type: "Vegetables",
    emoji: "🌿",
    growthDays: 40,
    description: "Nutritious fenugreek leaves for alluvial soil",
    waterNeeds: "medium",
    sunNeeds: "partial",
    soilType: "alluvial",
    soilPH: "neutral",
  },
  {
    id: "bottle-gourd",
    name: "Bottle Gourd (Lauki)",
    type: "Vegetables",
    emoji: "🥒",
    growthDays: 90,
    description: "Climbing bottle gourd for alluvial soil",
    waterNeeds: "high",
    sunNeeds: "full",
    soilType: "alluvial",
    soilPH: "neutral",
  },
  {
    id: "bitter-gourd",
    name: "Bitter Gourd (Karela)",
    type: "Vegetables",
    emoji: "🥒",
    growthDays: 85,
    description: "Medicinal bitter gourd for alluvial soil",
    waterNeeds: "medium",
    sunNeeds: "full",
    soilType: "alluvial",
    soilPH: "neutral",
  },

  // SANDY SOIL PLANTS - Garden Efficient
  {
    id: "carrot",
    name: "Carrot",
    type: "Vegetables",
    emoji: "🥕",
    growthDays: 75,
    description: "Crunchy carrots perfect for sandy soil",
    waterNeeds: "medium",
    sunNeeds: "full",
    soilType: "sandy",
    soilPH: "neutral",
  },
  {
    id: "radish",
    name: "Radish (Mooli)",
    type: "Vegetables",
    emoji: "🌶️",
    growthDays: 25,
    description: "Quick-growing radish for sandy soil",
    waterNeeds: "medium",
    sunNeeds: "partial",
    soilType: "sandy",
    soilPH: "acidic",
  },
  {
    id: "beetroot",
    name: "Beetroot",
    type: "Vegetables",
    emoji: "🧃",
    growthDays: 60,
    description: "Sweet beetroot for sandy soil gardens",
    waterNeeds: "medium",
    sunNeeds: "full",
    soilType: "sandy",
    soilPH: "neutral",
  },
  {
    id: "turnip",
    name: "Turnip (Shalgam)",
    type: "Vegetables",
    emoji: "🥔",
    growthDays: 50,
    description: "Root vegetable turnip for sandy soil",
    waterNeeds: "medium",
    sunNeeds: "full",
    soilType: "sandy",
    soilPH: "neutral",
  },
  {
    id: "sweet-potato",
    name: "Sweet Potato",
    type: "Vegetables",
    emoji: "🍠",
    growthDays: 105,
    description: "Nutritious sweet potatoes for sandy soil",
    waterNeeds: "medium",
    sunNeeds: "full",
    soilType: "sandy",
    soilPH: "acidic",
  },

  // CLAY SOIL PLANTS - Garden Efficient
  {
    id: "cabbage",
    name: "Cabbage (Patta Gobi)",
    type: "Vegetables",
    emoji: "🥬",
    growthDays: 90,
    description: "Leafy cabbage for clay soil gardens",
    waterNeeds: "medium",
    sunNeeds: "full",
    soilType: "clay",
    soilPH: "acidic",
  },
  {
    id: "broccoli",
    name: "Broccoli",
    type: "Vegetables",
    emoji: "🥦",
    growthDays: 90,
    description: "Nutritious broccoli for clay soil",
    waterNeeds: "medium",
    sunNeeds: "full",
    soilType: "clay",
    soilPH: "acidic",
  },
  {
    id: "cauliflower",
    name: "Cauliflower (Phool Gobi)",
    type: "Vegetables",
    emoji: "🥬",
    growthDays: 93,
    description: "White cauliflower for clay soil",
    waterNeeds: "medium",
    sunNeeds: "full",
    soilType: "clay",
    soilPH: "acidic",
  },
  {
    id: "kale",
    name: "Kale",
    type: "Vegetables",
    emoji: "🥬",
    growthDays: 65,
    description: "Superfood kale for clay soil gardens",
    waterNeeds: "medium",
    sunNeeds: "full",
    soilType: "clay",
    soilPH: "acidic",
  },

  // LOAMY SOIL PLANTS - Garden Efficient
  {
    id: "potato",
    name: "Potato (Aloo)",
    type: "Vegetables",
    emoji: "🥔",
    growthDays: 105,
    description: "Versatile potatoes for loamy soil",
    waterNeeds: "medium",
    sunNeeds: "full",
    soilType: "loamy",
    soilPH: "acidic",
  },
  {
    id: "lettuce",
    name: "Lettuce",
    type: "Vegetables",
    emoji: "🥬",
    growthDays: 53,
    description: "Fresh lettuce for loamy soil gardens",
    waterNeeds: "medium",
    sunNeeds: "partial",
    soilType: "loamy",
    soilPH: "neutral",
  },
  {
    id: "cucumber",
    name: "Cucumber (Kheera)",
    type: "Vegetables",
    emoji: "🥒",
    growthDays: 60,
    description: "Crisp cucumbers for loamy soil",
    waterNeeds: "high",
    sunNeeds: "full",
    soilType: "loamy",
    soilPH: "acidic",
  },
  {
    id: "bell-pepper",
    name: "Bell Pepper (Shimla Mirch)",
    type: "Vegetables",
    emoji: "🌶️",
    growthDays: 75,
    description: "Colorful peppers for loamy soil",
    waterNeeds: "medium",
    sunNeeds: "full",
    soilType: "loamy",
    soilPH: "acidic",
  },
  {
    id: "green-beans",
    name: "Green Beans (French Beans)",
    type: "Vegetables",
    emoji: "🌿",
    growthDays: 55,
    description: "Fresh green beans for loamy soil",
    waterNeeds: "medium",
    sunNeeds: "full",
    soilType: "loamy",
    soilPH: "acidic",
  },
  {
    id: "peas",
    name: "Green Peas (Matar)",
    type: "Vegetables",
    emoji: "🌱",
    growthDays: 65,
    description: "Sweet peas for loamy soil gardens",
    waterNeeds: "medium",
    sunNeeds: "full",
    soilType: "loamy",
    soilPH: "neutral",
  },
  {
    id: "zucchini",
    name: "Zucchini",
    type: "Vegetables",
    emoji: "🥒",
    growthDays: 50,
    description: "Fast-growing zucchini for loamy soil",
    waterNeeds: "medium",
    sunNeeds: "full",
    soilType: "loamy",
    soilPH: "neutral",
  },

  // FRUITS - Garden Efficient Only
  {
    id: "strawberry",
    name: "Strawberry",
    type: "Fruits",
    emoji: "🍓",
    growthDays: 90,
    description: "Sweet strawberries for container/garden growing",
    waterNeeds: "medium",
    sunNeeds: "full",
    soilType: "loamy",
    soilPH: "acidic",
  },
  {
    id: "lemon",
    name: "Lemon",
    type: "Fruits",
    emoji: "🍋",
    growthDays: 730,
    description: "Dwarf lemon tree for home gardens",
    waterNeeds: "medium",
    sunNeeds: "full",
    soilType: "sandy",
    soilPH: "acidic",
  },
  {
    id: "pomegranate",
    name: "Pomegranate (Anar)",
    type: "Fruits",
    emoji: "🍎",
    growthDays: 545,
    description: "Antioxidant-rich pomegranate for gardens",
    waterNeeds: "low",
    sunNeeds: "full",
    soilType: "red",
    soilPH: "neutral",
  },
  {
    id: "guava",
    name: "Guava (Amrud)",
    type: "Fruits",
    emoji: "🍈",
    growthDays: 365,
    description: "Vitamin C rich guava for home gardens",
    waterNeeds: "medium",
    sunNeeds: "full",
    soilType: "alluvial",
    soilPH: "neutral",
  },

  // HERBS - Garden Efficient
  {
    id: "basil",
    name: "Basil (Tulsi)",
    type: "Herbs",
    emoji: "🌿",
    growthDays: 60,
    description: "Sacred basil for loamy soil gardens",
    waterNeeds: "medium",
    sunNeeds: "full",
    soilType: "loamy",
    soilPH: "acidic",
  },
  {
    id: "mint",
    name: "Mint (Pudina)",
    type: "Herbs",
    emoji: "🌱",
    growthDays: 80,
    description: "Refreshing mint for clay soil",
    waterNeeds: "medium",
    sunNeeds: "partial",
    soilType: "clay",
    soilPH: "acidic",
  },
  {
    id: "coriander",
    name: "Coriander (Dhania)",
    type: "Herbs",
    emoji: "🌿",
    growthDays: 43,
    description: "Essential coriander for sandy soil",
    waterNeeds: "medium",
    sunNeeds: "partial",
    soilType: "sandy",
    soilPH: "neutral",
  },
  {
    id: "curry-leaves",
    name: "Curry Leaves (Kadi Patta)",
    type: "Herbs",
    emoji: "🌿",
    growthDays: 180,
    description: "Aromatic curry leaves for gardens",
    waterNeeds: "medium",
    sunNeeds: "partial",
    soilType: "red",
    soilPH: "acidic",
  },
  {
    id: "green-chili",
    name: "Green Chili (Hari Mirch)",
    type: "Herbs",
    emoji: "🌶️",
    growthDays: 70,
    description: "Spicy green chilies for cooking",
    waterNeeds: "medium",
    sunNeeds: "full",
    soilType: "black",
    soilPH: "neutral",
  },
  {
    id: "ginger",
    name: "Ginger (Adrak)",
    type: "Herbs",
    emoji: "🫚",
    growthDays: 240,
    description: "Medicinal ginger for alluvial soil",
    waterNeeds: "medium",
    sunNeeds: "partial",
    soilType: "alluvial",
    soilPH: "neutral",
  },

  // FLOWERS - Garden Efficient
  {
    id: "marigold",
    name: "Marigold (Genda)",
    type: "Flowers",
    emoji: "🌼",
    growthDays: 48,
    description: "Pest-repelling marigolds for sandy soil",
    waterNeeds: "low",
    sunNeeds: "full",
    soilType: "sandy",
    soilPH: "acidic",
  },
  {
    id: "rose",
    name: "Rose (Gulab)",
    type: "Flowers",
    emoji: "🌹",
    growthDays: 365,
    description: "Beautiful roses for loamy soil gardens",
    waterNeeds: "medium",
    sunNeeds: "full",
    soilType: "loamy",
    soilPH: "acidic",
  },
  {
    id: "jasmine",
    name: "Jasmine (Chameli)",
    type: "Flowers",
    emoji: "🌼",
    growthDays: 180,
    description: "Fragrant jasmine for clay soil",
    waterNeeds: "medium",
    sunNeeds: "partial",
    soilType: "clay",
    soilPH: "acidic",
  },
  {
    id: "hibiscus",
    name: "Hibiscus (Japa)",
    type: "Flowers",
    emoji: "🌺",
    growthDays: 365,
    description: "Tropical hibiscus for loamy soil",
    waterNeeds: "medium",
    sunNeeds: "full",
    soilType: "loamy",
    soilPH: "acidic",
  },
]

export default function GardenPlannerPage() {
  const [gardenName, setGardenName] = useState("My First Garden")
  const [location, setLocation] = useState("")
  const [selectedCity, setSelectedCity] = useState<{ name: string; state: string; lat: string; lon: string } | null>(
    null,
  )
  const [gardenWidth, setGardenWidth] = useState(5)
  const [gardenHeight, setGardenHeight] = useState(5)
  const [activeTab, setActiveTab] = useState("visualizer")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null)
  const [placedPlants, setPlacedPlants] = useState<PlacedPlant[]>([])
  const [isEditingSizeDialogOpen, setIsEditingSizeDialogOpen] = useState(false)
  const [tempWidth, setTempWidth] = useState(5)
  const [tempHeight, setTempHeight] = useState(5)
  const [plants, setPlants] = useState<Plant[]>(HARDCODED_PLANTS)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [activeSoilFilter, setActiveSoilFilter] = useState("All Soils")
  const [lockedSoilType, setLockedSoilType] = useState<string | null>(null)

  // Listen for location changes from CitySelector and other components
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "selected-city" && e.newValue) {
        try {
          const cityData = JSON.parse(e.newValue)
          setSelectedCity(cityData)
          setLocation(`${cityData.name}, ${cityData.state}`)

          toast({
            title: "Location Updated",
            description: `Garden location updated to ${cityData.name}, ${cityData.state}`,
          })
        } catch (error) {
          console.error("Error parsing city data:", error)
        }
      }
    }

    // Custom event listener for immediate updates from CitySelector
    const handleCityUpdate = (event: CustomEvent) => {
      const cityData = event.detail
      setSelectedCity(cityData)
      setLocation(`${cityData.name}, ${cityData.state}`)

      // Also save to localStorage for persistence
      localStorage.setItem("selected-city", JSON.stringify(cityData))

      toast({
        title: "Location Updated",
        description: `Garden location updated to ${cityData.name}, ${cityData.state}`,
      })
    }

    // Listen for storage events (cross-tab sync)
    window.addEventListener("storage", handleStorageChange)

    // Listen for custom city update events (same-tab sync)
    window.addEventListener("cityUpdated", handleCityUpdate as EventListener)

    // Check for existing city data on mount
    const existingCityData = localStorage.getItem("selected-city")
    if (existingCityData && !selectedCity) {
      try {
        const cityData = JSON.parse(existingCityData)
        setSelectedCity(cityData)
        setLocation(`${cityData.name}, ${cityData.state}`)
      } catch (error) {
        console.error("Error parsing existing city data:", error)
      }
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("cityUpdated", handleCityUpdate as EventListener)
    }
  }, [toast, selectedCity])

  // Load garden data from localStorage on component mount
  useEffect(() => {
    const storedGarden = localStorage.getItem("garden-planner-data")
    if (storedGarden) {
      try {
        const parsedGarden = JSON.parse(storedGarden)
        if (parsedGarden.gardenName) setGardenName(parsedGarden.gardenName)
        if (parsedGarden.location) setLocation(parsedGarden.location)
        if (parsedGarden.dimensions) {
          setGardenWidth(parsedGarden.dimensions.width || 5)
          setGardenHeight(parsedGarden.dimensions.height || 5)
          setTempWidth(parsedGarden.dimensions.width || 5)
          setTempHeight(parsedGarden.dimensions.height || 5)
        }
        if (parsedGarden.placedPlants) setPlacedPlants(parsedGarden.placedPlants)
        if (parsedGarden.selectedCity) setSelectedCity(parsedGarden.selectedCity)
        if (parsedGarden.lockedSoilType) setLockedSoilType(parsedGarden.lockedSoilType)
      } catch (error) {
        console.error("Error parsing garden data:", error)
      }
    }
  }, [])

  // Save garden data whenever it changes
  useEffect(() => {
    const gardenData = {
      gardenName,
      location,
      selectedCity,
      dimensions: {
        width: gardenWidth,
        height: gardenHeight,
      },
      placedPlants,
      lockedSoilType,
      lastUpdated: new Date().toISOString(),
    }
    localStorage.setItem("garden-planner-data", JSON.stringify(gardenData))
  }, [gardenName, location, gardenWidth, gardenHeight, placedPlants, selectedCity, lockedSoilType])

  // Auto-determine locked soil type from existing plants
  useEffect(() => {
    if (placedPlants.length > 0 && !lockedSoilType) {
      // Get the first plant's soil type
      const firstPlant = getPlantById(placedPlants[0].plantId)
      if (firstPlant) {
        setLockedSoilType(firstPlant.soilType)
      }
    }
  }, [placedPlants, lockedSoilType])

  // Filter plants based on search term, plant type, and soil type
  const filteredPlants = plants.filter((plant) => {
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = activeFilter === "All" || plant.type === activeFilter

    // STRICT ENFORCEMENT: If soil type is locked, ONLY show plants for that soil type
    if (lockedSoilType) {
      const matchesLockedSoil = plant.soilType === lockedSoilType
      return matchesSearch && matchesFilter && matchesLockedSoil
    }

    // If no soil is locked yet, apply normal soil filtering
    let matchesSoil = true
    if (activeSoilFilter !== "All Soils") {
      const soilTypeMap: Record<string, string> = {
        "Red Soil": "red",
        "Black Soil": "black",
        Alluvial: "alluvial",
        Sandy: "sandy",
        Clay: "clay",
        Loamy: "loamy",
      }

      const targetSoilType = soilTypeMap[activeSoilFilter]
      matchesSoil = plant.soilType === targetSoilType
    }

    return matchesSearch && matchesFilter && matchesSoil
  })

  // Handle plant placement in the garden
  const handlePlantPlacement = (x: number, y: number) => {
    if (!selectedPlant) return

    // Lock soil type on first plant placement
    if (placedPlants.length === 0 && !lockedSoilType) {
      setLockedSoilType(selectedPlant.soilType)
    }

    // Check if plant matches locked soil type
    if (lockedSoilType && selectedPlant.soilType !== lockedSoilType) {
      toast({
        title: "Soil Type Mismatch",
        description: `Your garden is set for ${lockedSoilType} soil. You can only plant crops suitable for ${lockedSoilType} soil.`,
        variant: "destructive",
      })
      return
    }

    // Check if there's already a plant at this position
    const existingPlantIndex = placedPlants.findIndex((plant) => plant.x === x && plant.y === y)

    if (existingPlantIndex >= 0) {
      // Replace the existing plant
      const updatedPlants = [...placedPlants]
      updatedPlants[existingPlantIndex] = {
        id: `${selectedPlant.id}-${Date.now()}`,
        plantId: selectedPlant.id,
        x,
        y,
        plantedDate: new Date().toISOString(),
      }
      setPlacedPlants(updatedPlants)
    } else {
      // Add a new plant
      setPlacedPlants([
        ...placedPlants,
        {
          id: `${selectedPlant.id}-${Date.now()}`,
          plantId: selectedPlant.id,
          x,
          y,
          plantedDate: new Date().toISOString(),
        },
      ])
    }

    toast({
      title: "Plant Added",
      description: `${selectedPlant.name} has been added to your garden.`,
    })
  }

  // Handle removing a plant from the garden
  const handleRemovePlant = (x: number, y: number) => {
    setPlacedPlants(placedPlants.filter((plant) => !(plant.x === x && plant.y === y)))
  }

  // Clear the entire garden
  const clearGarden = () => {
    if (confirm("Are you sure you want to clear all plants from your garden?")) {
      setPlacedPlants([])
      setLockedSoilType(null)

      // Also clear from localStorage immediately
      const gardenData = {
        gardenName,
        location,
        selectedCity,
        dimensions: {
          width: gardenWidth,
          height: gardenHeight,
        },
        placedPlants: [],
        lockedSoilType: null,
        lastUpdated: new Date().toISOString(),
      }
      localStorage.setItem("garden-planner-data", JSON.stringify(gardenData))

      toast({
        title: "Garden Cleared",
        description: "All plants have been removed from your garden. You can now choose a new soil type.",
      })
    }
  }

  // Handle garden size update
  const handleSizeUpdate = () => {
    setGardenWidth(tempWidth)
    setGardenHeight(tempHeight)
    setIsEditingSizeDialogOpen(false)

    toast({
      title: "Garden Size Updated",
      description: `Garden dimensions set to ${tempWidth}×${tempHeight}.`,
    })
  }

  // Get plant by ID
  const getPlantById = (id: string) => {
    return plants.find((plant) => plant.id === id) || null
  }

  // Count plants by type
  const countPlantsByType = () => {
    const counts: Record<string, number> = {}

    placedPlants.forEach((placedPlant) => {
      const plant = getPlantById(placedPlant.plantId)
      if (plant) {
        counts[plant.type] = (counts[plant.type] || 0) + 1
      }
    })

    return counts
  }

  // Get soil type counts
  const getSoilTypeCounts = () => {
    return {
      red: plants.filter((p) => p.soilType === "red").length,
      black: plants.filter((p) => p.soilType === "black").length,
      alluvial: plants.filter((p) => p.soilType === "alluvial").length,
      sandy: plants.filter((p) => p.soilType === "sandy").length,
      clay: plants.filter((p) => p.soilType === "clay").length,
      loamy: plants.filter((p) => p.soilType === "loamy").length,
    }
  }

  const plantCounts = countPlantsByType()
  const soilCounts = getSoilTypeCounts()

  // Render garden grid
  const renderGardenGrid = () => {
    const grid = []

    for (let y = 0; y < gardenHeight; y++) {
      const row = []
      for (let x = 0; x < gardenWidth; x++) {
        const placedPlant = placedPlants.find((plant) => plant.x === x && plant.y === y)
        const plant = placedPlant ? getPlantById(placedPlant.plantId) : null

        let cellContent
        if (plant) {
          cellContent = (
            <div
              className="w-full h-full flex items-center justify-center text-2xl cursor-pointer"
              onClick={() => handleRemovePlant(x, y)}
              title={`${plant.name} (Click to remove)`}
            >
              {plant.emoji}
            </div>
          )
        } else {
          cellContent = (
            <div
              className="w-full h-full bg-green-100 dark:bg-green-900/20 cursor-pointer"
              onClick={() => selectedPlant && handlePlantPlacement(x, y)}
            />
          )
        }

        row.push(
          <div key={`cell-${x}-${y}`} className="border border-green-200 dark:border-green-800 aspect-square">
            {cellContent}
          </div>,
        )
      }
      grid.push(
        <div key={`row-${y}`} className="grid grid-cols-5">
          {row}
        </div>,
      )
    }

    return <div className="border-2 border-green-300 dark:border-green-700 rounded-md overflow-hidden">{grid}</div>
  }

  // Helper functions for soil type styling
  const getSoilTypeColor = (soilType: string) => {
    switch (soilType) {
      case "red":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
      case "black":
        return "bg-gray-800 text-white dark:bg-gray-700 dark:text-gray-100"
      case "alluvial":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
      case "sandy":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "clay":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300"
      case "loamy":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-300"
    }
  }

  const getSoilTypeLabel = (soilType: string) => {
    switch (soilType) {
      case "red":
        return "Red"
      case "black":
        return "Black"
      case "alluvial":
        return "Alluvial"
      case "sandy":
        return "Sandy"
      case "clay":
        return "Clay"
      case "loamy":
        return "Loamy"
      default:
        return "Any"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Garden Planner</h1>
          <p className="text-muted-foreground">Design your garden layout and plan your plantings by soil type</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Input
                      value={gardenName}
                      onChange={(e) => setGardenName(e.target.value)}
                      className="text-lg font-medium w-64"
                    />
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setIsEditingSizeDialogOpen(true)}>
                    <Edit2 className="h-4 w-4 mr-2" /> Edit Size
                  </Button>
                </div>

                <div className="space-y-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{location || "Location will be set from dashboard"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>
                      {gardenWidth} × {gardenHeight} ({gardenWidth * gardenHeight}m²)
                    </span>
                  </div>
                  {!location && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-3 rounded-md text-sm">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        <p>Select a location in the dashboard weather widget to set your garden location.</p>
                      </div>
                    </div>
                  )}
                  {lockedSoilType && (
                    <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-3 rounded-md text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getSoilTypeColor(lockedSoilType).split(" ")[0]}`}></div>
                        <p>
                          <strong>Garden Soil Type:</strong> {getSoilTypeLabel(lockedSoilType)} Soil - You can only
                          plant crops suitable for this soil type.
                        </p>
                      </div>
                    </div>
                  )}
                  {lockedSoilType && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 p-3 rounded-md text-sm">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        <p>
                          <strong>Soil Type Locked:</strong> Your garden is set for {getSoilTypeLabel(lockedSoilType)}{" "}
                          soil. Only plants suitable for this soil type are shown. Clear your garden to change soil
                          types.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <Tabs defaultValue="visualizer" onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="visualizer">Garden Visualizer</TabsTrigger>
                    <TabsTrigger value="plantlist">Plant List</TabsTrigger>
                    <TabsTrigger value="soilinfo">Soil Guide</TabsTrigger>
                  </TabsList>

                  <TabsContent value="visualizer" className="pt-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Select a plant from the Plant List tab to place it on the grid
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="font-medium">Garden Plot</div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={clearGarden} title="Clear Garden">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" title="Refresh">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {renderGardenGrid()}

                    <div className="mt-4 text-sm text-muted-foreground">
                      Select a plant from the Plant List tab to place it on the grid
                    </div>
                  </TabsContent>

                  <TabsContent value="plantlist" className="pt-4">
                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search plants..."
                          className="pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>

                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {["All", "Vegetables", "Fruits", "Flowers", "Herbs"].map((filter) => (
                          <Button
                            key={filter}
                            variant={activeFilter === filter ? "default" : "outline"}
                            size="sm"
                            onClick={() => setActiveFilter(filter)}
                          >
                            {filter}
                          </Button>
                        ))}
                      </div>

                      <div className="flex gap-2 overflow-x-auto pb-2">
                        <div className="text-sm font-medium mr-2 flex items-center">Soil Type:</div>
                        <Button
                          variant={activeSoilFilter === "All Soils" ? "default" : "outline"}
                          size="sm"
                          onClick={() => !lockedSoilType && setActiveSoilFilter("All Soils")}
                          className="whitespace-nowrap"
                          disabled={lockedSoilType !== null}
                        >
                          All Soils
                          <Badge variant="outline" className="ml-1">
                            {plants.length}
                          </Badge>
                        </Button>
                        <Button
                          variant={activeSoilFilter === "Red Soil" ? "default" : "outline"}
                          size="sm"
                          onClick={() => !lockedSoilType && setActiveSoilFilter("Red Soil")}
                          className="whitespace-nowrap"
                          disabled={lockedSoilType !== null && lockedSoilType !== "red"}
                        >
                          Red Soil
                          <Badge variant="outline" className="ml-1">
                            {soilCounts.red}
                          </Badge>
                        </Button>
                        <Button
                          variant={activeSoilFilter === "Black Soil" ? "default" : "outline"}
                          size="sm"
                          onClick={() => !lockedSoilType && setActiveSoilFilter("Black Soil")}
                          className="whitespace-nowrap"
                          disabled={lockedSoilType !== null && lockedSoilType !== "black"}
                        >
                          Black Soil
                          <Badge variant="outline" className="ml-1">
                            {soilCounts.black}
                          </Badge>
                        </Button>
                        <Button
                          variant={activeSoilFilter === "Alluvial" ? "default" : "outline"}
                          size="sm"
                          onClick={() => !lockedSoilType && setActiveSoilFilter("Alluvial")}
                          className="whitespace-nowrap"
                          disabled={lockedSoilType !== null && lockedSoilType !== "alluvial"}
                        >
                          Alluvial
                          <Badge variant="outline" className="ml-1">
                            {soilCounts.alluvial}
                          </Badge>
                        </Button>
                        <Button
                          variant={activeSoilFilter === "Sandy" ? "default" : "outline"}
                          size="sm"
                          onClick={() => !lockedSoilType && setActiveSoilFilter("Sandy")}
                          className="whitespace-nowrap"
                          disabled={lockedSoilType !== null && lockedSoilType !== "sandy"}
                        >
                          Sandy
                          <Badge variant="outline" className="ml-1">
                            {soilCounts.sandy}
                          </Badge>
                        </Button>
                        <Button
                          variant={activeSoilFilter === "Clay" ? "default" : "outline"}
                          size="sm"
                          onClick={() => !lockedSoilType && setActiveSoilFilter("Clay")}
                          className="whitespace-nowrap"
                          disabled={lockedSoilType !== null && lockedSoilType !== "clay"}
                        >
                          Clay
                          <Badge variant="outline" className="ml-1">
                            {soilCounts.clay}
                          </Badge>
                        </Button>
                        <Button
                          variant={activeSoilFilter === "Loamy" ? "default" : "outline"}
                          size="sm"
                          onClick={() => !lockedSoilType && setActiveSoilFilter("Loamy")}
                          className="whitespace-nowrap"
                          disabled={lockedSoilType !== null && lockedSoilType !== "loamy"}
                        >
                          Loamy
                          <Badge variant="outline" className="ml-1">
                            {soilCounts.loamy}
                          </Badge>
                        </Button>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        Showing {filteredPlants.length} plants
                        {activeSoilFilter !== "All Soils" && ` suitable for ${activeSoilFilter.toLowerCase()}`}
                      </div>

                      <div className="bg-muted p-4 rounded-md text-center italic">
                        "The right plant in the right soil creates a thriving garden."
                      </div>

                      {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                      ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {filteredPlants.map((plant) => {
                            const methods = getMethodsForPlant(plant.name)

                            return (
                              <Card
                                key={plant.id}
                                className={`cursor-pointer hover:border-primary ${
                                  selectedPlant?.id === plant.id ? "border-primary" : ""
                                }`}
                                onClick={() => setSelectedPlant(plant)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-2xl">{plant.emoji}</span>
                                    <div className="flex-1">
                                      <div className="font-medium">{plant.name}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {plant.type} • {plant.growthDays} Days
                                      </div>
                                    </div>
                                    {methods.length > 0 && (
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-8 w-8"
                                              onClick={(e) => e.stopPropagation()}
                                            >
                                              <Info className="h-4 w-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent className="w-64 p-3">
                                            <div className="space-y-2">
                                              <p className="font-medium">Recommended Gardening Methods:</p>
                                              {methods.map((method) => (
                                                <div key={method.id} className="flex items-start gap-2">
                                                  <span>{method.icon}</span>
                                                  <div>
                                                    <p className="font-medium">{method.method}</p>
                                                    <p className="text-xs">{method.description}</p>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    )}
                                  </div>

                                  <p className="text-sm mt-2">{plant.description}</p>

                                  <div className="flex gap-2 mt-3 flex-wrap">
                                    <Badge
                                      variant="outline"
                                      className={`${
                                        plant.waterNeeds === "low"
                                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
                                          : plant.waterNeeds === "medium"
                                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                                            : "bg-blue-200 text-blue-900 dark:bg-blue-900/50 dark:text-blue-200"
                                      }`}
                                    >
                                      {plant.waterNeeds === "low"
                                        ? "low water"
                                        : plant.waterNeeds === "medium"
                                          ? "medium water"
                                          : "high water"}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className={`${
                                        plant.sunNeeds === "shade"
                                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                                          : plant.sunNeeds === "partial"
                                            ? "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300"
                                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
                                      }`}
                                    >
                                      {plant.sunNeeds === "shade"
                                        ? "shade"
                                        : plant.sunNeeds === "partial"
                                          ? "partial sun"
                                          : "full sun"}
                                    </Badge>
                                    <Badge variant="outline" className={`${getSoilTypeColor(plant.soilType)}`}>
                                      {getSoilTypeLabel(plant.soilType)} soil
                                    </Badge>
                                  </div>
                                </CardContent>
                              </Card>
                            )
                          })}
                        </div>
                      )}

                      {!isLoading && filteredPlants.length === 0 && (
                        <div className="text-sm text-muted-foreground text-center py-8">
                          <p>No plants found matching your search criteria.</p>
                          <p className="mt-2">Try adjusting your soil type or plant category filters.</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="soilinfo" className="pt-4">
                    <SoilInfo
                      selectedSoilType={
                        activeSoilFilter === "All Soils"
                          ? undefined
                          : activeSoilFilter.toLowerCase().replace(" soil", "").replace(" ", "")
                      }
                      onSoilTypeSelect={(soilType) => {
                        const filterMap: Record<string, string> = {
                          red: "Red Soil",
                          black: "Black Soil",
                          alluvial: "Alluvial",
                          sandy: "Sandy",
                          clay: "Clay",
                          loamy: "Loamy",
                        }
                        setActiveSoilFilter(filterMap[soilType] || "All Soils")
                        setActiveTab("plantlist")
                      }}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Garden Summary</CardTitle>
                <CardDescription>Overview of your garden plants by soil type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-y-2">
                  <div className="text-sm">Total Plants:</div>
                  <div className="text-sm font-medium text-right">{placedPlants.length}</div>

                  <div className="text-sm">Garden Area:</div>
                  <div className="text-sm font-medium text-right">{gardenWidth * gardenHeight}m²</div>

                  <div className="text-sm">Plant Types:</div>
                  <div className="text-sm font-medium text-right">{Object.keys(plantCounts).length}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Soil Type Distribution:</div>
                  {Object.entries(soilCounts).map(([soilType, count]) => (
                    <div key={soilType} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getSoilTypeColor(soilType).split(" ")[0]}`}></div>
                        <span className="capitalize">{soilType} Soil</span>
                      </div>
                      <span>{count} plants</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Plants by Type:</div>

                  {Object.entries(plantCounts).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            type === "Vegetables"
                              ? "bg-green-500"
                              : type === "Fruits"
                                ? "bg-pink-500"
                                : type === "Flowers"
                                  ? "bg-blue-500"
                                  : "bg-green-300"
                          }`}
                        ></div>
                        <span>{type}</span>
                      </div>
                      <span>{count}</span>
                    </div>
                  ))}

                  {placedPlants.length === 0 && (
                    <div className="text-sm text-muted-foreground text-center py-2">No plants in your garden yet</div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Recently Added Plants:</div>

                  {placedPlants
                    .sort((a, b) => new Date(b.plantedDate).getTime() - new Date(a.plantedDate).getTime())
                    .slice(0, 5)
                    .map((placedPlant) => {
                      const plant = getPlantById(placedPlant.plantId)
                      if (!plant) return null

                      return (
                        <div key={placedPlant.id} className="flex items-center gap-2">
                          <span className="text-green-600 dark:text-green-400">{plant?.emoji || "🌱"}</span>
                          <div className="flex-1">
                            <div className="text-sm">{plant?.name || "Unknown Plant"}</div>
                            <div className="text-xs text-muted-foreground">
                              {plant?.soilType} soil • Added {new Date(placedPlant.plantedDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      )
                    })}

                  {placedPlants.length === 0 && (
                    <div className="text-sm text-muted-foreground text-center py-2">No plants added yet</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Garden Size Dialog */}
      <Dialog open={isEditingSizeDialogOpen} onOpenChange={setIsEditingSizeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Garden Size</DialogTitle>
            <DialogDescription>
              Adjust the dimensions of your garden plot. Note that reducing the size may remove plants outside the new
              boundaries.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">Width (meters)</Label>
                <Input
                  id="width"
                  type="number"
                  min="1"
                  max="20"
                  value={tempWidth}
                  onChange={(e) => setTempWidth(Number.parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (meters)</Label>
                <Input
                  id="height"
                  type="number"
                  min="1"
                  max="20"
                  value={tempHeight}
                  onChange={(e) => setTempHeight(Number.parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">Total area: {tempWidth * tempHeight}m²</div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingSizeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSizeUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
