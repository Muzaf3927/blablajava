"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Users, Car, Star, Wallet } from "lucide-react"
import { useBookings } from "@/hooks/use-bookings"

interface BookTripModalProps {
  isOpen: boolean
  trip: any
  onClose: () => void
  onSuccess: () => void
}

export default function BookTripModal({ isOpen, trip, onClose, onSuccess }: BookTripModalProps) {
  const [seats, setSeats] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { createBooking, isLoading } = useBookings()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}
    if (seats < 1) newErrors.seats = "Минимум 1 место"
    if (seats > trip.seats) newErrors.seats = `Максимум ${trip.seats} мест`

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await createBooking(trip.id, seats)
      onSuccess()
    } catch (error: any) {
      setErrors({ general: error.message || "Ошибка бронирования" })
    }
  }

  const totalPrice = trip.price * seats

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur-lg border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Бронирование поездки
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{errors.general}</div>
          )}

          {/* Trip Info */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-4">
            {/* Route */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-900">{trip.from_city}</span>
              </div>
              <div className="flex items-center space-x-2 ml-1">
                <div className="w-1 h-8 bg-gray-300 rounded"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="font-medium text-gray-900">{trip.to_city}</span>
              </div>
            </div>

            {/* Date and Time */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(trip.date).toLocaleDateString("ru-RU")}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{trip.time}</span>
              </div>
            </div>

            {/* Available Seats */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>{trip.seats} мест доступно</span>
            </div>
          </div>

          {/* Driver Info */}
          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={
                  trip.driver?.avatar
                    ? `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/storage/${trip.driver.avatar}`
                    : undefined
                }
                alt={trip.driver?.name}
              />
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                {trip.driver?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-medium text-gray-900">{trip.driver?.name}</div>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span>{trip.driver?.rating?.toFixed(1) || "0.0"}</span>
                <span>({trip.driver?.rating_count || 0})</span>
              </div>
            </div>
          </div>

          {/* Car Info */}
          {(trip.carModel || trip.carColor || trip.numberCar) && (
            <div className="bg-purple-50 rounded-xl p-4 space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Car className="w-4 h-4 text-purple-500" />
                <span className="font-medium text-purple-700">Автомобиль</span>
              </div>
              {trip.carModel && <div className="text-sm text-purple-600">Модель: {trip.carModel}</div>}
              {trip.carColor && <div className="text-sm text-purple-600">Цвет: {trip.carColor}</div>}
              {trip.numberCar && <div className="text-sm text-purple-600">Номер: {trip.numberCar}</div>}
            </div>
          )}

          {/* Seats Selection */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="seats" className="text-lg font-semibold text-gray-900">
                Количество мест
              </Label>
              <div className="flex items-center space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSeats(Math.max(1, seats - 1))}
                  disabled={seats <= 1}
                  className="w-10 h-10 rounded-full"
                >
                  -
                </Button>
                <Input
                  id="seats"
                  type="number"
                  min="1"
                  max={trip.seats}
                  value={seats}
                  onChange={(e) => setSeats(Number.parseInt(e.target.value) || 1)}
                  className="w-20 text-center h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSeats(Math.min(trip.seats, seats + 1))}
                  disabled={seats >= trip.seats}
                  className="w-10 h-10 rounded-full"
                >
                  +
                </Button>
              </div>
              {errors.seats && <p className="text-red-500 text-sm">{errors.seats}</p>}
            </div>

            {/* Price Calculation */}
            <div className="bg-green-50 rounded-xl p-4 space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Wallet className="w-4 h-4 text-green-500" />
                <span className="font-medium text-green-700">Стоимость</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm text-green-600">
                  <span>
                    {trip.price} ₽ × {seats} мест
                  </span>
                  <span>{totalPrice.toLocaleString("ru-RU")} ₽</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-green-800 pt-2 border-t border-green-200">
                  <span>Итого:</span>
                  <span>{totalPrice.toLocaleString("ru-RU")} ₽</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-12 rounded-xl border-2 bg-transparent"
                disabled={isLoading}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Бронирование...</span>
                  </div>
                ) : (
                  "Забронировать"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
