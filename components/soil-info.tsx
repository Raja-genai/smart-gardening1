"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"

interface SoilInfoProps {
  selectedSoilType?: string
  onSoilTypeSelect?: (soilType: string) => void
}

const SOIL_TYPES = {
  red: {
    name: "Red Soil",
    color: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300",
    description: "Rich in iron oxide, well-drained, suitable for drought-resistant crops",
    characteristics: [
      "High iron content gives reddish color",
      "Good drainage properties",
      "Low fertility but can be improved",
      "Acidic to neutral pH (5.5-7.0)",
    ],
    regions: ["Tamil Nadu", "Karnataka", "Andhra Pradesh", "Odisha", "Jharkhand"],
    bestCrops: [
      { name: "Tomato", emoji: "🍅", reason: "Thrives in well-drained acidic soil" },
      { name: "Chili", emoji: "🌶️", reason: "Heat-loving crop, tolerates iron-rich soil" },
      { name: "Groundnut", emoji: "🥜", reason: "Deep roots access nutrients in red soil" },
      { name: "Ragi", emoji: "🌾", reason: "Drought-resistant millet perfect for red soil" },
      { name: "Cashew", emoji: "🌰", reason: "Tree crop that thrives in lateritic red soil" },
    ],
    tips: [
      "Add organic matter to improve fertility",
      "Use lime to reduce acidity if needed",
      "Mulching helps retain moisture",
      "Choose drought-resistant varieties",
    ],
  },
  black: {
    name: "Black Soil (Regur)",
    color: "bg-gray-800 text-white dark:bg-gray-700 dark:text-gray-100",
    description: "Rich in clay, high water retention, excellent for cotton and cereals",
    characteristics: [
      "High clay content (40-60%)",
      "Excellent water retention",
      "Rich in calcium and magnesium",
      "Self-plowing when wet",
    ],
    regions: ["Maharashtra", "Madhya Pradesh", "Gujarat", "Rajasthan", "Andhra Pradesh"],
    bestCrops: [
      { name: "Cotton", emoji: "🌾", reason: "Traditional black soil crop, loves clay content" },
      { name: "Soybean", emoji: "🫘", reason: "Benefits from high water retention" },
      { name: "Wheat", emoji: "🌾", reason: "Winter crop that thrives in fertile black soil" },
      { name: "Jowar", emoji: "🌾", reason: "Sorghum adapted to black soil conditions" },
      { name: "Sunflower", emoji: "🌻", reason: "Deep roots penetrate clay soil effectively" },
    ],
    tips: [
      "Ensure proper drainage during monsoon",
      "Deep plowing when soil is at optimum moisture",
      "Avoid working when too wet or too dry",
      "Crop rotation maintains soil health",
    ],
  },
  alluvial: {
    name: "Alluvial Soil",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
    description: "Fertile river-deposited soil, ideal for intensive agriculture",
    characteristics: [
      "Deposited by rivers over time",
      "High fertility and nutrient content",
      "Good water retention and drainage",
      "Suitable for multiple cropping",
    ],
    regions: ["Gangetic Plains", "Punjab", "Haryana", "Uttar Pradesh", "West Bengal"],
    bestCrops: [
      { name: "Rice", emoji: "🌾", reason: "Staple crop of alluvial plains, loves water retention" },
      { name: "Sugarcane", emoji: "🎋", reason: "High water and nutrient requirements met" },
      { name: "Maize", emoji: "🌽", reason: "Benefits from fertile, well-drained alluvial soil" },
      { name: "Banana", emoji: "🍌", reason: "Tropical fruit thrives in fertile alluvial soil" },
      { name: "Jute", emoji: "🌿", reason: "Fiber crop suited to alluvial soil of Bengal" },
    ],
    tips: [
      "Ideal for intensive farming",
      "Regular organic matter addition",
      "Proper water management essential",
      "Multiple cropping possible",
    ],
  },
  sandy: {
    name: "Sandy Soil",
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300",
    description: "Well-drained, easy to work, suitable for root vegetables and fruits",
    characteristics: [
      "Large particle size, good drainage",
      "Easy to cultivate and work",
      "Low water and nutrient retention",
      "Warms up quickly in spring",
    ],
    regions: ["Rajasthan", "Gujarat", "Coastal areas", "Parts of Haryana", "Western UP"],
    bestCrops: [
      { name: "Watermelon", emoji: "🍉", reason: "Deep roots access water, loves drainage" },
      { name: "Millet", emoji: "🌾", reason: "Drought-resistant crop perfect for sandy soil" },
      { name: "Carrot", emoji: "🥕", reason: "Root vegetable grows well in loose sandy soil" },
      { name: "Radish", emoji: "🌶️", reason: "Quick-growing root crop suited to sandy soil" },
      { name: "Coconut", emoji: "🥥", reason: "Coastal palm thrives in sandy coastal soil" },
    ],
    tips: [
      "Frequent irrigation needed",
      "Add organic matter regularly",
      "Mulching prevents water loss",
      "Choose drought-tolerant varieties",
    ],
  },
  clay: {
    name: "Clay Soil",
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300",
    description: "Heavy soil with excellent nutrient retention, challenging to work",
    characteristics: [
      "Small particle size, poor drainage",
      "High nutrient and water retention",
      "Difficult to work when wet or dry",
      "Slow to warm up in spring",
    ],
    regions: ["Parts of Tamil Nadu", "Kerala", "Assam", "Some areas of Bihar"],
    bestCrops: [
      { name: "Cabbage", emoji: "🥬", reason: "Cool season crop tolerates heavy clay soil" },
      { name: "Broccoli", emoji: "🥦", reason: "Benefits from nutrient-rich clay soil" },
      { name: "Brussels Sprouts", emoji: "🥬", reason: "Hardy brassica suited to clay conditions" },
      { name: "Apple", emoji: "🍎", reason: "Tree fruit with deep roots for clay soil" },
      { name: "Pear", emoji: "🍐", reason: "Fruit tree that tolerates heavy clay soil" },
    ],
    tips: [
      "Improve drainage with organic matter",
      "Work soil at correct moisture level",
      "Raised beds help with drainage",
      "Avoid compaction from heavy machinery",
    ],
  },
  loamy: {
    name: "Loamy Soil",
    color: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
    description: "Perfect balance of sand, silt, and clay - ideal for most crops",
    characteristics: [
      "Balanced mixture of sand, silt, clay",
      "Excellent drainage and water retention",
      "High fertility and nutrient availability",
      "Easy to work and cultivate",
    ],
    regions: ["Kashmir Valley", "Parts of Punjab", "Hill stations", "Some river valleys"],
    bestCrops: [
      { name: "Potato", emoji: "🥔", reason: "Tuber crop loves well-drained fertile loamy soil" },
      { name: "Onion", emoji: "🧅", reason: "Bulb formation excellent in loose loamy soil" },
      { name: "Lettuce", emoji: "🥬", reason: "Leafy green thrives in fertile, well-drained soil" },
      { name: "Strawberry", emoji: "🍓", reason: "Berry crop benefits from perfect loamy conditions" },
      { name: "Rose", emoji: "🌹", reason: "Ornamental flower loves balanced loamy soil" },
    ],
    tips: [
      "Maintain organic matter levels",
      "Regular but not excessive watering",
      "Most crops will thrive here",
      "Ideal for kitchen gardens",
    ],
  },
}

export function SoilInfo({ selectedSoilType, onSoilTypeSelect }: SoilInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Indian Soil Types Guide</h3>
        <p className="text-muted-foreground text-sm">
          Learn about different soil types found across India and which crops grow best in each type.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(SOIL_TYPES).map(([key, soil]) => (
          <Card
            key={key}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedSoilType === key ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => onSoilTypeSelect?.(key)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{soil.name}</CardTitle>
                <Badge className={soil.color}>{soil.name}</Badge>
              </div>
              <CardDescription>{soil.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Found in:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {soil.regions.map((region) => (
                    <Badge key={region} variant="outline" className="text-xs">
                      {region}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Best Crops:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {soil.bestCrops.slice(0, 4).map((crop) => (
                    <div key={crop.name} className="flex items-center gap-2 text-sm">
                      <span>{crop.emoji}</span>
                      <span>{crop.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Key Characteristics:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {soil.characteristics.slice(0, 2).map((char, index) => (
                    <li key={index}>• {char}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h4 className="font-medium mb-3">💡 Soil Selection Tips</h4>
          <div className="grid gap-3 md:grid-cols-2 text-sm">
            <div>
              <strong>Know Your Region:</strong> Different parts of India have different predominant soil types. Check
              your local agricultural department for soil maps.
            </div>
            <div>
              <strong>Test Your Soil:</strong> Simple home tests can help determine your soil type - squeeze test for
              texture, pH strips for acidity.
            </div>
            <div>
              <strong>Improve Any Soil:</strong> Most soils can be improved with organic matter, proper drainage, and
              appropriate amendments.
            </div>
            <div>
              <strong>Choose Suitable Crops:</strong> Select plants that naturally thrive in your soil type for better
              success and lower maintenance.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
