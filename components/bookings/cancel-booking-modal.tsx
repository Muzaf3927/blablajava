"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertTriangle, MapPin, Calendar, Clock, Users } from "lucide-react"
import { useBookings } from "@/hooks/use-bookings"

interface CancelBookingModalProps {
  isOpen: boolean
  booking: any
  onClose: () => void
  onSuccess: () => void
}

export default function CancelBookingModal({ isOpen, booking, onClose, onSuccess }: CancelBookingModalProps) {
  const { cancelBooking, isLoading } = useBookings()

  const handleCancel = async () => {
    try {
      await cancelBooking(booking.id)
      onSuccess()
    } catch (error) {
      console.error("Cancel booking error:", error)
    }
  }

  if (!booking) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-lg border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center text-red-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 mr-2" />
            Отменить бронирование
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Вы уверены, что хотите отменить это бронирование? Это действие нельзя отменить.
            </p>
          </div>

          {/* Booking Info */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="font-medium">
                {booking.trip.from_city} → {booking.trip.to_city}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(booking.trip.date).toLocaleDateString("ru-RU")}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{booking.trip.time}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{booking.seats} мест</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">
                  {(booking.trip.price * booking.seats).toLocaleString("ru-RU")} ₽
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12 rounded-xl border-2 bg-transparent"
              disabled={isLoading}
            >
              Не отменять
            </Button>
            <Button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Отмена...</span>
                </div>
              ) : (
                "Отменить бронирование"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
