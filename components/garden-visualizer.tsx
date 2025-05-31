"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Leaf, Droplets, Sun, SunMedium, CloudRain } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Plant {
  id: string
  name: string
  type: string
  emoji: string
  waterNeeds: "low" | "medium" | "high"
  sunNeeds: "shade" | "partial" | "full"
  soilType: string
}

interface GardenVisualizerProps {
  width: number
  height: number
  onPlantPlaced?: (plant: Plant, x: number, y: number) => void
  onPlantRemoved?: (x: number, y: number) => void
  initialPlants?: Array<Plant & { x: number; y: number }>
  selectedPlant?: Plant | null
  className?: string
  lockedSoilType?: string | null
}

export function GardenVisualizer({
  width,
  height,
  onPlantPlaced,
  onPlantRemoved,
  initialPlants = [],
  selectedPlant,
  className,
  lockedSoilType,
}: GardenVisualizerProps) {
  const [grid, setGrid] = useState<Array<Array<(Plant & { x: number; y: number }) | null>>>([])
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null)

  // Initialize grid
  useEffect(() => {
    const newGrid = Array(height)
      .fill(null)
      .map(() => Array(width).fill(null))

    // Place initial plants
    initialPlants.forEach((plant) => {
      if (plant.x >= 0 && plant.x < width && plant.y >= 0 && plant.y < height) {
        newGrid[plant.y][plant.x] = plant
      }
    })

    setGrid(newGrid)
  }, [width, height, initialPlants])

  // Handle cell click
  const handleCellClick = (x: number, y: number) => {
    const existingPlant = grid[y][x]

    if (existingPlant) {
      // Remove existing plant
      const newGrid = [...grid]
      newGrid[y][x] = null
      setGrid(newGrid)
      onPlantRemoved?.(x, y)
    } else if (selectedPlant) {
      // Check soil type compatibility
      if (lockedSoilType && selectedPlant.soilType !== lockedSoilType) {
        // Don't place incompatible plants
        return
      }

      // Add new plant
      const plantWithPosition = {
        ...selectedPlant,
        x,
        y,
      }
      const newGrid = [...grid]
      newGrid[y][x] = plantWithPosition
      setGrid(newGrid)
      onPlantPlaced?.(selectedPlant, x, y)
    }
  }

  // Get soil background color
  const getSoilBackground = (soilType: string | null) => {
    if (!soilType) return "#8B4513" // Default brown

    switch (soilType) {
      case "red":
        return "#CD853F" // Sandy brown with red tint
      case "black":
        return "#2F2F2F" // Dark soil
      case "alluvial":
        return "#DEB887" // Burlywood
      case "sandy":
        return "#F4A460" // Sandy brown
      case "clay":
        return "#A0522D" // Sienna
      case "loamy":
        return "#8B7355" // Dark khaki
      default:
        return "#8B4513" // Default brown
    }
  }

  // Get water need icon
  const getWaterIcon = (waterNeeds: string) => {
    switch (waterNeeds) {
      case "low":
        return <Droplets className="h-3 w-3 text-yellow-600" />
      case "medium":
        return <Droplets className="h-3 w-3 text-blue-600" />
      case "high":
        return <CloudRain className="h-3 w-3 text-blue-800" />
      default:
        return null
    }
  }

  // Get sun need icon
  const getSunIcon = (sunNeeds: string) => {
    switch (sunNeeds) {
      case "shade":
        return <div className="h-3 w-3 bg-purple-600 rounded-full" />
      case "partial":
        return <SunMedium className="h-3 w-3 text-orange-500" />
      case "full":
        return <Sun className="h-3 w-3 text-yellow-500" />
      default:
        return null
    }
  }

  // Check if garden is empty
  const isGardenEmpty = !initialPlants || initialPlants.length === 0

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-medium">
            Garden Plot ({width}×{height}m²)
          </h3>
          {lockedSoilType && (
            <Badge variant="outline" className="capitalize">
              {lockedSoilType} Soil Garden
            </Badge>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => (window.location.href = "/garden-planner")}
          className="flex items-center gap-1"
        >
          Edit Garden <span className="ml-1">→</span>
        </Button>
      </div>

      {isGardenEmpty ? (
        <div className="border-2 border-green-600 dark:border-green-700 rounded-md overflow-hidden bg-amber-50 dark:bg-amber-900/20 flex flex-col items-center justify-center py-16">
          <div className="text-gray-400 mb-4">
            <Leaf className="h-16 w-16 mx-auto opacity-30" />
          </div>
          <p className="text-muted-foreground mb-6">No plants in your garden yet</p>
          <Button
            onClick={() => (window.location.href = "/garden-planner")}
            className="bg-green-600 hover:bg-green-700"
          >
            Plan Your Garden
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Garden Grid */}
          <div className="border-2 border-green-600 dark:border-green-700 rounded-md overflow-hidden shadow-lg">
            <div
              className="grid gap-1 p-2"
              style={{
                gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
                backgroundColor: getSoilBackground(lockedSoilType),
              }}
            >
              {grid.map((row, y) =>
                row.map((cell, x) => {
                  const isHovered = hoveredCell?.x === x && hoveredCell?.y === y
                  const canPlaceHere =
                    !cell && selectedPlant && (!lockedSoilType || selectedPlant.soilType === lockedSoilType)

                  return (
                    <div
                      key={`cell-${x}-${y}`}
                      className={`
                        relative aspect-square border border-green-200/30 dark:border-green-800/30 rounded-sm
                        cursor-pointer transition-all duration-200 min-h-[40px] min-w-[40px]
                        ${cell ? "bg-green-100/80 dark:bg-green-900/40" : "bg-white/20 dark:bg-black/20"}
                        ${isHovered ? "ring-2 ring-green-400" : ""}
                        ${canPlaceHere ? "bg-green-200/60 dark:bg-green-800/40" : ""}
                      `}
                      onClick={() => handleCellClick(x, y)}
                      onMouseEnter={() => setHoveredCell({ x, y })}
                      onMouseLeave={() => setHoveredCell(null)}
                      title={
                        cell
                          ? `${cell.name} (Click to remove)`
                          : selectedPlant
                            ? `Place ${selectedPlant.name} here`
                            : "Empty plot"
                      }
                    >
                      {cell ? (
                        <div className="w-full h-full flex flex-col items-center justify-center p-1">
                          <div className="text-lg sm:text-xl md:text-2xl mb-1">{cell.emoji}</div>
                          <div className="flex gap-1 items-center">
                            {getWaterIcon(cell.waterNeeds)}
                            {getSunIcon(cell.sunNeeds)}
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {canPlaceHere && isHovered && (
                            <div className="text-lg opacity-60">{selectedPlant?.emoji}</div>
                          )}
                        </div>
                      )}

                      {/* Grid coordinates for debugging */}
                      <div className="absolute top-0 left-0 text-xs text-gray-500 opacity-50 p-0.5">
                        {x},{y}
                      </div>
                    </div>
                  )
                }),
              )}
            </div>
          </div>

          {/* Garden Legend */}
          <div className="bg-muted/50 rounded-md p-3">
            <h4 className="text-sm font-medium mb-2">Garden Legend</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Droplets className="h-3 w-3 text-yellow-600" />
                <span>Low Water</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="h-3 w-3 text-blue-600" />
                <span>Medium Water</span>
              </div>
              <div className="flex items-center gap-2">
                <CloudRain className="h-3 w-3 text-blue-800" />
                <span>High Water</span>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="h-3 w-3 text-yellow-500" />
                <span>Full Sun</span>
              </div>
              <div className="flex items-center gap-2">
                <SunMedium className="h-3 w-3 text-orange-500" />
                <span>Partial Sun</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-purple-600 rounded-full" />
                <span>Shade</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-sm border"
                  style={{ backgroundColor: getSoilBackground(lockedSoilType) }}
                />
                <span>{lockedSoilType ? `${lockedSoilType} soil` : "Garden soil"}</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-sm text-muted-foreground text-center">
            {selectedPlant ? (
              <p>
                Click on empty plots to place <strong>{selectedPlant.name}</strong> • Click on plants to remove them
              </p>
            ) : (
              <p>Select a plant from the Plant List to start planting • Click on existing plants to remove them</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
