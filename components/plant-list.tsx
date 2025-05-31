"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getGardeningMethodsForPlant } from "@/data/gardening-methods"

interface PlantListProps {
  onPlantSelect?: (plant: Plant) => void
  className?: string
}

export interface Plant {
  id: string
  name: string
  type: string
  emoji: string
  season: string
  waterNeeds: string
  sunlight: string
  growthDuration: string
  spacing: string
  companionPlants?: string[]
  avoidPlants?: string[]
  description?: string
  harvestTime?: string
  soilType?: string
  soilPH?: string
  methods?: string[]
}

// Define the refined plant data - only garden-efficient plants
const PLANT_DATA: Plant[] = [
  // RED SOIL PLANTS - Garden Efficient
  {
    id: "tomato",
    name: "Tomato",
    type: "vegetable",
    emoji: "🍅",
    season: "summer",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "75 days",
    spacing: "45-60 cm",
    soilType: "red",
    soilPH: "slightly acidic",
    description: "Juicy red tomatoes perfect for home gardens in red soil",
  },
  {
    id: "chili",
    name: "Chili",
    type: "vegetable",
    emoji: "🌶️",
    season: "summer",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "75 days",
    spacing: "30-45 cm",
    soilType: "red",
    soilPH: "slightly acidic",
    description: "Spicy chilies that thrive in red soil gardens",
  },
  {
    id: "okra",
    name: "Okra (Bhindi)",
    type: "vegetable",
    emoji: "🌶️",
    season: "summer",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "60 days",
    spacing: "30-45 cm",
    soilType: "red",
    soilPH: "neutral",
    description: "Easy-to-grow okra for red soil gardens",
  },
  {
    id: "drumstick",
    name: "Drumstick (Moringa)",
    type: "vegetable",
    emoji: "🌿",
    season: "all",
    waterNeeds: "low",
    sunlight: "full",
    growthDuration: "180 days",
    spacing: "3-4 m",
    soilType: "red",
    soilPH: "neutral",
    description: "Nutritious drumstick tree for red soil",
  },

  // BLACK SOIL PLANTS - Garden Efficient
  {
    id: "eggplant",
    name: "Eggplant (Brinjal)",
    type: "vegetable",
    emoji: "🍆",
    season: "summer",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "80 days",
    spacing: "45-60 cm",
    soilType: "black",
    soilPH: "neutral",
    description: "Purple eggplant perfect for black soil gardens",
  },
  {
    id: "onion",
    name: "Onion",
    type: "vegetable",
    emoji: "🧅",
    season: "winter",
    waterNeeds: "low",
    sunlight: "full",
    growthDuration: "105 days",
    spacing: "10-15 cm",
    soilType: "black",
    soilPH: "neutral",
    description: "Essential onions for black soil gardens",
  },
  {
    id: "garlic",
    name: "Garlic",
    type: "vegetable",
    emoji: "🧄",
    season: "winter",
    waterNeeds: "low",
    sunlight: "full",
    growthDuration: "180 days",
    spacing: "10-15 cm",
    soilType: "black",
    soilPH: "neutral",
    description: "Flavorful garlic bulbs for black soil",
  },
  {
    id: "sunflower",
    name: "Sunflower",
    type: "flower",
    emoji: "🌻",
    season: "summer",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "85 days",
    spacing: "45-60 cm",
    soilType: "black",
    soilPH: "neutral",
    description: "Bright sunflowers perfect for black soil gardens",
  },

  // ALLUVIAL SOIL PLANTS - Garden Efficient
  {
    id: "spinach",
    name: "Spinach (Palak)",
    type: "vegetable",
    emoji: "🥬",
    season: "winter",
    waterNeeds: "moderate",
    sunlight: "partial",
    growthDuration: "45 days",
    spacing: "15-20 cm",
    soilType: "alluvial",
    soilPH: "neutral",
    description: "Leafy spinach for alluvial soil gardens",
  },
  {
    id: "fenugreek",
    name: "Fenugreek (Methi)",
    type: "vegetable",
    emoji: "🌿",
    season: "winter",
    waterNeeds: "moderate",
    sunlight: "partial",
    growthDuration: "40 days",
    spacing: "10-15 cm",
    soilType: "alluvial",
    soilPH: "neutral",
    description: "Nutritious fenugreek leaves for alluvial soil",
  },
  {
    id: "bottle-gourd",
    name: "Bottle Gourd (Lauki)",
    type: "vegetable",
    emoji: "🥒",
    season: "summer",
    waterNeeds: "high",
    sunlight: "full",
    growthDuration: "90 days",
    spacing: "1.5-2 m",
    soilType: "alluvial",
    soilPH: "neutral",
    description: "Climbing bottle gourd for alluvial soil",
  },
  {
    id: "bitter-gourd",
    name: "Bitter Gourd (Karela)",
    type: "vegetable",
    emoji: "🥒",
    season: "summer",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "85 days",
    spacing: "1.5-2 m",
    soilType: "alluvial",
    soilPH: "neutral",
    description: "Medicinal bitter gourd for alluvial soil",
  },

  // SANDY SOIL PLANTS - Garden Efficient
  {
    id: "carrot",
    name: "Carrot",
    type: "vegetable",
    emoji: "🥕",
    season: "winter",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "75 days",
    spacing: "5-8 cm",
    soilType: "sandy",
    soilPH: "neutral",
    description: "Crunchy carrots perfect for sandy soil",
  },
  {
    id: "radish",
    name: "Radish (Mooli)",
    type: "vegetable",
    emoji: "🌶️",
    season: "winter",
    waterNeeds: "moderate",
    sunlight: "partial",
    growthDuration: "25 days",
    spacing: "2-5 cm",
    soilType: "sandy",
    soilPH: "slightly acidic",
    description: "Quick-growing radish for sandy soil",
  },
  {
    id: "beetroot",
    name: "Beetroot",
    type: "vegetable",
    emoji: "🧃",
    season: "winter",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "60 days",
    spacing: "10-15 cm",
    soilType: "sandy",
    soilPH: "neutral",
    description: "Sweet beetroot for sandy soil gardens",
  },
  {
    id: "turnip",
    name: "Turnip (Shalgam)",
    type: "vegetable",
    emoji: "🥔",
    season: "winter",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "50 days",
    spacing: "10-15 cm",
    soilType: "sandy",
    soilPH: "neutral",
    description: "Root vegetable turnip for sandy soil",
  },
  {
    id: "sweet-potato",
    name: "Sweet Potato",
    type: "vegetable",
    emoji: "🍠",
    season: "summer",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "105 days",
    spacing: "30-40 cm",
    soilType: "sandy",
    soilPH: "slightly acidic",
    description: "Nutritious sweet potatoes for sandy soil",
  },

  // CLAY SOIL PLANTS - Garden Efficient
  {
    id: "cabbage",
    name: "Cabbage (Patta Gobi)",
    type: "vegetable",
    emoji: "🥬",
    season: "winter",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "90 days",
    spacing: "45-60 cm",
    soilType: "clay",
    soilPH: "slightly acidic",
    description: "Leafy cabbage for clay soil gardens",
  },
  {
    id: "broccoli",
    name: "Broccoli",
    type: "vegetable",
    emoji: "🥦",
    season: "winter",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "90 days",
    spacing: "45-60 cm",
    soilType: "clay",
    soilPH: "slightly acidic",
    description: "Nutritious broccoli for clay soil",
  },
  {
    id: "cauliflower",
    name: "Cauliflower (Phool Gobi)",
    type: "vegetable",
    emoji: "🥬",
    season: "winter",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "93 days",
    spacing: "45-60 cm",
    soilType: "clay",
    soilPH: "slightly acidic",
    description: "White cauliflower for clay soil",
  },
  {
    id: "kale",
    name: "Kale",
    type: "vegetable",
    emoji: "🥬",
    season: "winter",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "65 days",
    spacing: "30-45 cm",
    soilType: "clay",
    soilPH: "slightly acidic",
    description: "Superfood kale for clay soil gardens",
  },

  // LOAMY SOIL PLANTS - Garden Efficient
  {
    id: "potato",
    name: "Potato (Aloo)",
    type: "vegetable",
    emoji: "🥔",
    season: "winter",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "105 days",
    spacing: "30-40 cm",
    soilType: "loamy",
    soilPH: "slightly acidic",
    description: "Versatile potatoes for loamy soil",
  },
  {
    id: "lettuce",
    name: "Lettuce",
    type: "vegetable",
    emoji: "🥬",
    season: "winter",
    waterNeeds: "moderate",
    sunlight: "partial",
    growthDuration: "53 days",
    spacing: "20-30 cm",
    soilType: "loamy",
    soilPH: "neutral",
    description: "Fresh lettuce for loamy soil gardens",
  },
  {
    id: "cucumber",
    name: "Cucumber (Kheera)",
    type: "vegetable",
    emoji: "🥒",
    season: "summer",
    waterNeeds: "high",
    sunlight: "full",
    growthDuration: "60 days",
    spacing: "45-60 cm",
    soilType: "loamy",
    soilPH: "slightly acidic",
    description: "Crisp cucumbers for loamy soil",
  },
  {
    id: "bell-pepper",
    name: "Bell Pepper (Shimla Mirch)",
    type: "vegetable",
    emoji: "🌶️",
    season: "summer",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "75 days",
    spacing: "45-60 cm",
    soilType: "loamy",
    soilPH: "slightly acidic",
    description: "Colorful peppers for loamy soil",
  },
  {
    id: "green-beans",
    name: "Green Beans (French Beans)",
    type: "vegetable",
    emoji: "🌿",
    season: "summer",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "55 days",
    spacing: "10-15 cm",
    soilType: "loamy",
    soilPH: "slightly acidic",
    description: "Fresh green beans for loamy soil",
  },
  {
    id: "peas",
    name: "Green Peas (Matar)",
    type: "vegetable",
    emoji: "🌱",
    season: "winter",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "65 days",
    spacing: "5-8 cm",
    soilType: "loamy",
    soilPH: "neutral",
    description: "Sweet peas for loamy soil gardens",
  },
  {
    id: "zucchini",
    name: "Zucchini",
    type: "vegetable",
    emoji: "🥒",
    season: "summer",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "50 days",
    spacing: "60-90 cm",
    soilType: "loamy",
    soilPH: "neutral",
    description: "Fast-growing zucchini for loamy soil",
  },

  // FRUITS - Garden Efficient Only
  {
    id: "strawberry",
    name: "Strawberry",
    type: "fruit",
    emoji: "🍓",
    season: "spring",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "90 days",
    spacing: "30-45 cm",
    soilType: "loamy",
    soilPH: "slightly acidic",
    description: "Sweet strawberries for container/garden growing",
  },
  {
    id: "lemon",
    name: "Lemon",
    type: "fruit",
    emoji: "🍋",
    season: "all",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "2 years",
    spacing: "3-4 m",
    soilType: "sandy",
    soilPH: "slightly acidic",
    description: "Dwarf lemon tree for home gardens",
  },
  {
    id: "pomegranate",
    name: "Pomegranate (Anar)",
    type: "fruit",
    emoji: "🍎",
    season: "all",
    waterNeeds: "low",
    sunlight: "full",
    growthDuration: "1.5 years",
    spacing: "3-4 m",
    soilType: "red",
    soilPH: "neutral",
    description: "Antioxidant-rich pomegranate for gardens",
  },
  {
    id: "guava",
    name: "Guava (Amrud)",
    type: "fruit",
    emoji: "🍈",
    season: "all",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "1 year",
    spacing: "3-4 m",
    soilType: "alluvial",
    soilPH: "neutral",
    description: "Vitamin C rich guava for home gardens",
  },

  // HERBS - Garden Efficient
  {
    id: "basil",
    name: "Basil (Tulsi)",
    type: "herb",
    emoji: "🌿",
    season: "summer",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "60 days",
    spacing: "20-25 cm",
    soilType: "loamy",
    soilPH: "slightly acidic",
    description: "Sacred basil for loamy soil gardens",
  },
  {
    id: "mint",
    name: "Mint (Pudina)",
    type: "herb",
    emoji: "🌱",
    season: "spring",
    waterNeeds: "moderate",
    sunlight: "partial",
    growthDuration: "80 days",
    spacing: "30-45 cm",
    soilType: "clay",
    soilPH: "slightly acidic",
    description: "Refreshing mint for clay soil",
  },
  {
    id: "coriander",
    name: "Coriander (Dhania)",
    type: "herb",
    emoji: "🌿",
    season: "winter",
    waterNeeds: "moderate",
    sunlight: "partial",
    growthDuration: "43 days",
    spacing: "10-15 cm",
    soilType: "sandy",
    soilPH: "neutral",
    description: "Essential coriander for sandy soil",
  },
  {
    id: "curry-leaves",
    name: "Curry Leaves (Kadi Patta)",
    type: "herb",
    emoji: "🌿",
    season: "all",
    waterNeeds: "moderate",
    sunlight: "partial",
    growthDuration: "180 days",
    spacing: "1-2 m",
    soilType: "red",
    soilPH: "slightly acidic",
    description: "Aromatic curry leaves for gardens",
  },
  {
    id: "green-chili",
    name: "Green Chili (Hari Mirch)",
    type: "herb",
    emoji: "🌶️",
    season: "summer",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "70 days",
    spacing: "30-45 cm",
    soilType: "black",
    soilPH: "neutral",
    description: "Spicy green chilies for cooking",
  },
  {
    id: "ginger",
    name: "Ginger (Adrak)",
    type: "herb",
    emoji: "🫚",
    season: "summer",
    waterNeeds: "moderate",
    sunlight: "partial",
    growthDuration: "240 days",
    spacing: "20-30 cm",
    soilType: "alluvial",
    soilPH: "neutral",
    description: "Medicinal ginger for alluvial soil",
  },

  // FLOWERS - Garden Efficient
  {
    id: "marigold",
    name: "Marigold (Genda)",
    type: "flower",
    emoji: "🌼",
    season: "summer",
    waterNeeds: "low",
    sunlight: "full",
    growthDuration: "48 days",
    spacing: "20-30 cm",
    soilType: "sandy",
    soilPH: "slightly acidic",
    description: "Pest-repelling marigolds for sandy soil",
  },
  {
    id: "rose",
    name: "Rose (Gulab)",
    type: "flower",
    emoji: "🌹",
    season: "spring",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "1 year",
    spacing: "60-90 cm",
    soilType: "loamy",
    soilPH: "slightly acidic",
    description: "Beautiful roses for loamy soil gardens",
  },
  {
    id: "jasmine",
    name: "Jasmine (Chameli)",
    type: "flower",
    emoji: "🌼",
    season: "summer",
    waterNeeds: "moderate",
    sunlight: "partial",
    growthDuration: "180 days",
    spacing: "1.8-2.4 m",
    soilType: "clay",
    soilPH: "slightly acidic",
    description: "Fragrant jasmine for clay soil",
  },
  {
    id: "hibiscus",
    name: "Hibiscus (Japa)",
    type: "flower",
    emoji: "🌺",
    season: "summer",
    waterNeeds: "moderate",
    sunlight: "full",
    growthDuration: "1 year",
    spacing: "1-1.5 m",
    soilType: "loamy",
    soilPH: "slightly acidic",
    description: "Tropical hibiscus for loamy soil",
  },
]

export function PlantList({ onPlantSelect, className = "" }: PlantListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [plants, setPlants] = useState<Plant[]>(PLANT_DATA)
  const [isLoading, setIsLoading] = useState(false) // Set to false since we're using hardcoded data
  const [error, setError] = useState<string | null>(null)
  const [activeSoilFilter, setActiveSoilFilter] = useState("all")

  // Filter plants based on search term and active tab
  const filteredPlants = plants.filter((plant) => {
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === "all" || plant.type === activeTab
    return matchesSearch && matchesTab
  })

  // Group plants by type for counting
  const plantCounts = {
    all: plants.length,
    vegetable: plants.filter((p) => p.type === "vegetable").length,
    fruit: plants.filter((p) => p.type === "fruit").length,
    flower: plants.filter((p) => p.type === "flower").length,
    herb: plants.filter((p) => p.type === "herb").length,
  }

  // Get soil type counts
  const soilCounts = {
    red: plants.filter((p) => p.soilType === "red").length,
    black: plants.filter((p) => p.soilType === "black").length,
    alluvial: plants.filter((p) => p.soilType === "alluvial").length,
    sandy: plants.filter((p) => p.soilType === "sandy").length,
    clay: plants.filter((p) => p.soilType === "clay").length,
    loamy: plants.filter((p) => p.soilType === "loamy").length,
  }

  // Update the getFilteredPlants function to include soil filtering
  const getFilteredPlants = () => {
    let filteredPlants = [...plants]

    // Filter by tab
    if (activeTab !== "all") {
      filteredPlants = filteredPlants.filter((plant) => plant.type === activeTab)
    }

    // Filter by soil type
    if (activeSoilFilter !== "all") {
      filteredPlants = filteredPlants.filter((plant) => plant.soilType === activeSoilFilter)
    }

    // Filter by search query
    if (searchTerm.trim() !== "") {
      const query = searchTerm.toLowerCase()
      filteredPlants = filteredPlants.filter(
        (plant) =>
          plant.name.toLowerCase().includes(query) ||
          (plant.description && plant.description.toLowerCase().includes(query)) ||
          plant.type.toLowerCase().includes(query),
      )
    }

    return filteredPlants
  }

  const filteredPlants2 = getFilteredPlants()

  return (
    <Card className={`h-full ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle>Plant List</CardTitle>
        <CardDescription>Browse and select plants for your garden by soil type</CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search plants..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="pb-6 pt-2">
        {/* Soil Type Filter */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Filter by Soil Type:</div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={activeSoilFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveSoilFilter("all")}
              className="whitespace-nowrap"
            >
              All Soils
              <Badge variant="outline" className="ml-1">
                {plants.length}
              </Badge>
            </Button>
            <Button
              variant={activeSoilFilter === "red" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveSoilFilter("red")}
              className="whitespace-nowrap"
            >
              Red Soil
              <Badge variant="outline" className="ml-1">
                {soilCounts.red}
              </Badge>
            </Button>
            <Button
              variant={activeSoilFilter === "black" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveSoilFilter("black")}
              className="whitespace-nowrap"
            >
              Black Soil
              <Badge variant="outline" className="ml-1">
                {soilCounts.black}
              </Badge>
            </Button>
            <Button
              variant={activeSoilFilter === "alluvial" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveSoilFilter("alluvial")}
              className="whitespace-nowrap"
            >
              Alluvial
              <Badge variant="outline" className="ml-1">
                {soilCounts.alluvial}
              </Badge>
            </Button>
            <Button
              variant={activeSoilFilter === "sandy" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveSoilFilter("sandy")}
              className="whitespace-nowrap"
            >
              Sandy
              <Badge variant="outline" className="ml-1">
                {soilCounts.sandy}
              </Badge>
            </Button>
            <Button
              variant={activeSoilFilter === "clay" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveSoilFilter("clay")}
              className="whitespace-nowrap"
            >
              Clay
              <Badge variant="outline" className="ml-1">
                {soilCounts.clay}
              </Badge>
            </Button>
            <Button
              variant={activeSoilFilter === "loamy" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveSoilFilter("loamy")}
              className="whitespace-nowrap"
            >
              Loamy
              <Badge variant="outline" className="ml-1">
                {soilCounts.loamy}
              </Badge>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="all" className="flex-1">
              All{" "}
              <Badge variant="outline" className="ml-1">
                {plantCounts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="vegetable" className="flex-1">
              Vegetables{" "}
              <Badge variant="outline" className="ml-1">
                {plantCounts.vegetable}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="fruit" className="flex-1">
              Fruits{" "}
              <Badge variant="outline" className="ml-1">
                {plantCounts.fruit}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="flower" className="flex-1">
              Flowers{" "}
              <Badge variant="outline" className="ml-1">
                {plantCounts.flower}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="herb" className="flex-1">
              Herbs{" "}
              <Badge variant="outline" className="ml-1">
                {plantCounts.herb}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Results count */}
          <div className="text-sm text-muted-foreground mb-4">
            Showing {filteredPlants2.length} plants
            {activeSoilFilter !== "all" && ` for ${activeSoilFilter} soil`}
            {activeTab !== "all" && ` in ${activeTab} category`}
          </div>

          {filteredPlants2.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No plants found matching your criteria.</p>
              <p className="text-sm mt-2">Try adjusting your soil type or plant category filters.</p>
            </div>
          ) : (
            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {filteredPlants2.map((plant) => {
                  // Get gardening methods for this plant
                  const methods = getGardeningMethodsForPlant(plant.id)

                  // Get soil type color
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

                  return (
                    <TooltipProvider key={plant.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            className="h-auto justify-start gap-2 px-3 py-2 w-full"
                            onClick={() => onPlantSelect?.(plant)}
                          >
                            <span className="text-xl">{plant.emoji}</span>
                            <div className="flex flex-col items-start flex-1">
                              <span className="font-medium">{plant.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {plant.growthDuration} • {plant.season}
                              </span>
                              <Badge
                                variant="outline"
                                className={`text-xs mt-1 ${getSoilTypeColor(plant.soilType || "")}`}
                              >
                                {plant.soilType} soil
                              </Badge>
                            </div>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-[300px]">
                          <div>
                            <p className="font-semibold">{plant.name}</p>
                            <p className="text-xs mt-1">
                              Water: {plant.waterNeeds} • Sunlight: {plant.sunlight}
                            </p>
                            <p className="text-xs">
                              Spacing: {plant.spacing} • Season: {plant.season}
                            </p>
                            <p className="text-xs">
                              Soil: {plant.soilType} • pH: {plant.soilPH}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )
                })}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}
