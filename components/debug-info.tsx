"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff } from "lucide-react"

export function DebugInfo() {
  const [showDebug, setShowDebug] = useState(false)

  if (!showDebug) {
    return (
      <Button variant="outline" size="sm" onClick={() => setShowDebug(true)} className="fixed bottom-4 right-4 z-50">
        <Eye className="h-4 w-4 mr-2" />
        Debug
      </Button>
    )
  }

  const envVars = {
    NEXT_PUBLIC_OPENWEATHER_API_KEY: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
  }

  const localStorageData = {
    "openweather-api-key": typeof window !== "undefined" ? localStorage.getItem("openweather-api-key") : null,
    "selected-city": typeof window !== "undefined" ? localStorage.getItem("selected-city") : null,
    "last-weather-city": typeof window !== "undefined" ? localStorage.getItem("last-weather-city") : null,
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 max-h-96 overflow-y-auto">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Debug Information</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setShowDebug(false)}>
            <EyeOff className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h4 className="text-xs font-medium mb-2">Environment Variables:</h4>
          {Object.entries(envVars).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between text-xs">
              <span className="font-mono">{key}:</span>
              <Badge variant={value ? "default" : "secondary"}>{value ? "Set" : "Not Set"}</Badge>
            </div>
          ))}
        </div>

        <div>
          <h4 className="text-xs font-medium mb-2">Local Storage:</h4>
          {Object.entries(localStorageData).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between text-xs">
              <span className="font-mono">{key}:</span>
              <Badge variant={value ? "default" : "secondary"}>{value ? "Set" : "Not Set"}</Badge>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            console.log("Environment Variables:", envVars)
            console.log("Local Storage:", localStorageData)
          }}
          className="w-full"
        >
          Log to Console
        </Button>
      </CardContent>
    </Card>
  )
}
