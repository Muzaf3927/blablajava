"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Star, Check, X, Hourglass, AlertCircle } from "lucide-react"
import { useBookings } from "@/hooks/use-bookings"
import ChatButton from "@/components/chat/chat-button"
import RateUserModal from "@/components/ratings/rate-user-modal"

interface TripBookingsModalProps {
  isOpen: boolean
  trip: any
  onClose: () => void
}

export default function TripBookingsModal({ isOpen, trip, onClose }: TripBookingsModalProps) {
  const [bookings, setBookings] = useState<any[]>([])
  const { fetchTripBookings, updateBookingStatus, isLoading } = useBookings()
  const [ratingUser, setRatingUser] = useState<any>(null)

  useEffect(() => {
    if (isOpen && trip) {
      loadBookings()
    }
  }, [isOpen, trip])

  const loadBookings = async () => {
    try {
      const data = await fetchTripBookings(trip.id)
      setBookings(data.bookings || [])
    } catch (error) {
      console.error("Load bookings error:", error)
    }
  }

  const handleStatusUpdate = async (bookingId: number, status: 'approved' | 'rejected') => {
    try {
      await updateBookingStatus(bookingId, status)
      await loadBookings() // Reload bookings
    } catch (error) {
      console.error("Update status error:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "declined":
        return "bg-red-100 text-red-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Ожидает"
      case "confirmed":
        return "Подтверждена"
      case "declined":
        return "Отклонена"
      case "cancelled":
        return "Отменена"
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Hourglass className="w-4 h-4" />
      case "confirmed":
        return <Check className="w-4 h-4" />
      case "declined":
        return <X className="w-4 h-4" />
      case "cancelled":
        return <AlertCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  if (!trip) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-white/95 backdrop-blur-lg border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Заявки на поездку
          </DialogTitle>
          <p className="text-center text-gray-600">
            {trip.from_city} → {trip.to_city}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Пока нет заявок</h3>
              <p className="text-gray-600">Заявки на вашу поездку появятся здесь</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={
                          booking.user?.avatar
                            ? `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/storage/${booking.user.avatar}`
                            : undefined
                        }
                        alt={booking.user?.name}
                      />
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        {booking.user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900">{booking.user?.name}</div>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span>{booking.user?.rating?.toFixed(1) || "0.0"}</span>
                        <span>({booking.user?.rating_count || 0})</span>
                      </div>
                    </div>
                  </div>

                  <Badge className={`${getStatusColor(booking.status)} border-0 flex items-center space-x-1`}>
                    {getStatusIcon(booking.status)}
                    <span>{getStatusText(booking.status)}</span>
                  </Badge>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{booking.seats} мест</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {(trip.price * booking.seats).toLocaleString("ru-RU")} ₽
                    </div>
                    <div className="text-xs text-gray-600">
                      {trip.price} ₽ × {booking.seats} мест
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  Заявка отправлена: {new Date(booking.created_at).toLocaleString("ru-RU")}
                </div>

                {booking.status === "pending" && (
                  <div className="flex space-x-2 mb-3">
                                          <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(booking.id, "approved")}
                        disabled={isLoading}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Подтвердить
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(booking.id, "rejected")}
                        disabled={isLoading}
                        className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Отклонить
                      </Button>
                  </div>
                )}

                {booking.status === "confirmed" && (
                  <div className="space-y-2">
                    <ChatButton
                      tripId={trip.id}
                      partnerId={booking.user?.id}
                      partnerName={booking.user?.name}
                      className="w-full"
                    />
                    <Button
                      variant="outline"
                      onClick={() => setRatingUser({ trip: trip, user: booking.user })}
                      className="w-full border-yellow-200 text-yellow-600 hover:bg-yellow-50 bg-transparent"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Оценить пассажира
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose} className="bg-transparent">
            Закрыть
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl bg-white/95 backdrop-blur-lg border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Заявки на поездку
            </DialogTitle>
            <p className="text-center text-gray-600">
              {trip.from_city} → {trip.to_city}
            </p>
          </DialogHeader>

          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Пока нет заявок</h3>
                <p className="text-gray-600">Заявки на вашу поездку появятся здесь</p>
              </div>
            ) : (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={
                            booking.user?.avatar
                              ? `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/storage/${booking.user.avatar}`
                              : undefined
                          }
                          alt={booking.user?.name}
                        />
                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                          {booking.user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900">{booking.user?.name}</div>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span>{booking.user?.rating?.toFixed(1) || "0.0"}</span>
                          <span>({booking.user?.rating_count || 0})</span>
                        </div>
                      </div>
                    </div>

                    <Badge className={`${getStatusColor(booking.status)} border-0 flex items-center space-x-1`}>
                      {getStatusIcon(booking.status)}
                      <span>{getStatusText(booking.status)}</span>
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{booking.seats} мест</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {(trip.price * booking.seats).toLocaleString("ru-RU")} ₽
                      </div>
                      <div className="text-xs text-gray-600">
                        {trip.price} ₽ × {booking.seats} мест
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-4">
                    Заявка отправлена: {new Date(booking.created_at).toLocaleString("ru-RU")}
                  </div>

                  {booking.status === "pending" && (
                    <div className="flex space-x-2 mb-3">
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(booking.id, "confirmed")}
                        disabled={isLoading}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Подтвердить
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(booking.id, "declined")}
                        disabled={isLoading}
                        className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Отклонить
                      </Button>
                    </div>
                  )}

                  {booking.status === "confirmed" && (
                    <div className="space-y-2">
                      <ChatButton
                        tripId={trip.id}
                        partnerId={booking.user?.id}
                        partnerName={booking.user?.name}
                        className="w-full"
                      />
                      <Button
                        variant="outline"
                        onClick={() => setRatingUser({ trip: trip, user: booking.user })}
                        className="w-full border-yellow-200 text-yellow-600 hover:bg-yellow-50 bg-transparent"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Оценить пассажира
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={onClose} className="bg-transparent">
              Закрыть
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {ratingUser && (
        <RateUserModal
          isOpen={!!ratingUser}
          trip={ratingUser.trip}
          user={ratingUser.user}
          onClose={() => setRatingUser(null)}
          onSuccess={() => {
            setRatingUser(null)
            // Можно добавить уведомление об успешной отправке отзыва
          }}
        />
      )}
    </>
  )
}
