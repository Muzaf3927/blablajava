"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Calendar } from "lucide-react"
import { useRatings } from "@/hooks/use-ratings"

interface RateUserModalProps {
  isOpen: boolean
  onClose: () => void
  user: {
    id: number
    name: string
    avatar?: string
  }
  trip: {
    id: number
    from_address: string
    to_address: string
    departure_time: string
  }
  onSuccess?: () => void
}

export default function RateUserModal({ isOpen, onClose, user, trip, onSuccess }: RateUserModalProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const { rateUser, loading } = useRatings()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return

    try {
      await rateUser(trip.id, user.id, rating, comment)
      onSuccess?.()
      onClose()
      setRating(0)
      setComment("")
    } catch (error) {
      console.error("Rate user error:", error)
    }
  }

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1:
        return "Очень плохо"
      case 2:
        return "Плохо"
      case 3:
        return "Нормально"
      case 4:
        return "Хорошо"
      case 5:
        return "Отлично"
      default:
        return "Выберите оценку"
    }
  }

  const getRatingColor = (rating: number) => {
    switch (rating) {
      case 1:
        return "text-red-600"
      case 2:
        return "text-orange-600"
      case 3:
        return "text-yellow-600"
      case 4:
        return "text-blue-600"
      case 5:
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Оценить пользователя</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Info */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={
                  user.avatar
                    ? `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/storage/${user.avatar}`
                    : undefined
                }
                alt={user.name}
              />
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-600">Участник поездки</p>
            </div>
          </div>

          {/* Trip Info */}
          <div className="p-4 bg-blue-50 rounded-lg space-y-2">
            <div className="flex items-center text-sm text-blue-800">
              <MapPin className="w-4 h-4 mr-2" />
              <span>
                {trip.from_address} → {trip.to_address}
              </span>
            </div>
            <div className="flex items-center text-sm text-blue-800">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{new Date(trip.departure_time).toLocaleString("ru-RU")}</span>
            </div>
          </div>

          {/* Rating Stars */}
          <div className="text-center space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Как прошла поездка?</p>
              <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-1 transition-all duration-200 hover:scale-110"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={`w-8 h-8 transition-colors duration-200 ${
                        star <= (hoveredRating || rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <p className={`text-sm font-medium ${getRatingColor(hoveredRating || rating)}`}>
              {getRatingText(hoveredRating || rating)}
            </p>
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Комментарий (необязательно)
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Поделитесь впечатлениями о поездке..."
              rows={3}
              maxLength={1000}
              className="resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">{comment.length}/1000 символов</p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
              disabled={loading}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={rating === 0 || loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {loading ? "Сохранение..." : "Оценить"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
