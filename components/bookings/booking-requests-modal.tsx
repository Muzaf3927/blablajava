"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, MapPin, Check, X } from "lucide-react"
import { useBookings } from "@/hooks/use-bookings"
import { Booking, Trip } from "@/lib/types"

interface BookingRequestsModalProps {
  isOpen: boolean
  trip: Trip
  onClose: () => void
  onUpdate: () => void
}

export default function BookingRequestsModal({ 
  isOpen, 
  trip, 
  onClose, 
  onUpdate 
}: BookingRequestsModalProps) {
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [processingBooking, setProcessingBooking] = useState<number | null>(null)

  const { fetchTripBookings, approveBooking, rejectBooking } = useBookings()

  useEffect(() => {
    if (isOpen) {
      loadPendingBookings()
    }
  }, [isOpen, trip.id])

  const loadPendingBookings = async () => {
    setIsLoading(true)
    try {
      const response = await fetchTripBookings(trip.id)
      const pending = response.bookings.filter((booking: Booking) => 
        booking.status === 'pending'
      )
      setPendingBookings(pending)
    } catch (error) {
      console.error("Error loading pending bookings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (bookingId: number) => {
    setProcessingBooking(bookingId)
    try {
      await approveBooking(bookingId)
      await loadPendingBookings()
      onUpdate()
    } catch (error) {
      console.error("Error approving booking:", error)
    } finally {
      setProcessingBooking(null)
    }
  }

  const handleReject = async (bookingId: number) => {
    setProcessingBooking(bookingId)
    try {
      await rejectBooking(bookingId)
      await loadPendingBookings()
      onUpdate()
    } catch (error) {
      console.error("Error rejecting booking:", error)
    } finally {
      setProcessingBooking(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Ожидает</Badge>
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800">Подтверждено</Badge>
      case 'rejected':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Отклонено</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-white/95 backdrop-blur-lg border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Запросы на бронирование
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Trip Info */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-gray-900">
                  {trip.from_city} → {trip.to_city}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(trip.date).toLocaleDateString("ru-RU")}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{trip.time}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{trip.seats} мест</span>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* No Requests */}
          {!isLoading && pendingBookings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Нет запросов на бронирование</p>
            </div>
          )}

          {/* Booking Requests */}
          {!isLoading && pendingBookings.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">
                Ожидающие подтверждения ({pendingBookings.length})
              </h3>
              
              {pendingBookings.map((booking) => (
                <div key={booking.id} className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
                  {/* User Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={booking.user?.avatar}
                          alt={booking.user?.name}
                        />
                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                          {booking.user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900">{booking.user?.name}</div>
                        <div className="text-sm text-gray-500">
                          Забронировал {booking.seats} {booking.seats === 1 ? 'место' : 'места'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {trip.price * booking.seats} ₽
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(booking.created_at).toLocaleDateString("ru-RU")}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-2">
                    <Button
                      onClick={() => handleReject(booking.id)}
                      disabled={processingBooking === booking.id}
                      variant="outline"
                      className="flex-1 h-10 border-red-200 text-red-600 hover:bg-red-50"
                    >
                      {processingBooking === booking.id ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <X className="w-4 h-4 mr-2" />
                          Отклонить
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handleApprove(booking.id)}
                      disabled={processingBooking === booking.id}
                      className="flex-1 h-10 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      {processingBooking === booking.id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Подтвердить
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="px-6 h-10 rounded-xl"
            >
              Закрыть
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 