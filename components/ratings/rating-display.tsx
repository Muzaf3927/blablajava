import { Star } from "lucide-react"

interface RatingDisplayProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  showNumber?: boolean
  className?: string
}

export default function RatingDisplay({
  rating,
  maxRating = 5,
  size = "md",
  showNumber = true,
  className = "",
}: RatingDisplayProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <div className="flex items-center">
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className={`${sizeClasses[size]} text-yellow-400 fill-current`} />
        ))}

        {/* Half star */}
        {hasHalfStar && (
          <div className="relative">
            <Star className={`${sizeClasses[size]} text-gray-300`} />
            <div className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
              <Star className={`${sizeClasses[size]} text-yellow-400 fill-current`} />
            </div>
          </div>
        )}

        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className={`${sizeClasses[size]} text-gray-300`} />
        ))}
      </div>

      {showNumber && <span className={`font-medium text-gray-700 ${textSizeClasses[size]}`}>{rating.toFixed(1)}</span>}
    </div>
  )
}
