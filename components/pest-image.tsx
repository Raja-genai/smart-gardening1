import Image from "next/image"

interface PestImageProps {
  name?: string
  src?: string
  alt?: string
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export function PestImage({ name, src, alt, size = "md", className = "" }: PestImageProps) {
  // Use name, or fall back to alt if name is not provided
  const displayName = name || alt || "Pest"

  // Default pest image
  const defaultImage = "/placeholder.svg?height=300&width=400"

  // Use src if provided, otherwise use defaultImage
  const imageSrc = src || defaultImage

  // Size mapping
  const sizeMap = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-24 w-24",
    xl: "h-32 w-32",
  }

  const sizeClass = sizeMap[size]

  return (
    <div className={`${className} relative overflow-hidden ${size ? sizeClass : ""}`}>
      <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100 dark:bg-gray-800">
        {displayName.charAt(0).toUpperCase()}
      </div>
      <Image
        src={imageSrc || "/placeholder.svg"}
        alt={displayName}
        width={400}
        height={300}
        className="object-cover w-full h-full"
        onError={(e) => {
          e.currentTarget.src = "/placeholder.svg?height=300&width=400"
        }}
      />
    </div>
  )
}
