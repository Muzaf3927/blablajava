"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { useTrips } from "@/hooks/use-trips"
import { useBookings } from "@/hooks/use-bookings"
import BookTripModal from "@/components/bookings/book-trip-modal"
import TripBookingsModal from "@/components/bookings/trip-bookings-modal"

export default function TestBookingPage() {
  const { user, isAuthenticated } = useAuth()
  const { trips, fetchAllTrips } = useTrips()
  const { bookings, fetchBookings } = useBookings()
  
  const [selectedTrip, setSelectedTrip] = useState<any>(null)
  const [showBookModal, setShowBookModal] = useState(false)
  const [showBookingsModal, setShowBookingsModal] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllTrips()
      fetchBookings()
    }
  }, [isAuthenticated, fetchAllTrips, fetchBookings])

  const handleBookTrip = (trip: any) => {
    setSelectedTrip(trip)
    setShowBookModal(true)
  }

  const handleViewBookings = (trip: any) => {
    setSelectedTrip(trip)
    setShowBookingsModal(true)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Тест бронирования</h1>
          <p className="text-gray-600">Пожалуйста, войдите в систему для тестирования</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Тест логики бронирования</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Доступные поездки */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Доступные поездки</h2>
            <div className="space-y-4">
              {trips.map((trip) => (
                <Card key={trip.id} className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-medium text-gray-900">
                          {trip.from_city} → {trip.to_city}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(trip.date).toLocaleDateString("ru-RU")} в {trip.time}
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        {trip.price} ₽
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Водитель: {trip.driver?.name || 'Неизвестно'}
                      </div>
                      <div className="flex space-x-2">
                        {trip.user_id !== user?.id ? (
                          <Button 
                            size="sm" 
                            onClick={() => handleBookTrip(trip)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Забронировать
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewBookings(trip)}
                            className="border-green-200 text-green-600 hover:bg-green-50"
                          >
                            Мои заявки
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Мои бронирования */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Мои бронирования</h2>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id} className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-medium text-gray-900">
                          {booking.trip?.from_city} → {booking.trip?.to_city}
                        </div>
                        <div className="text-sm text-gray-600">
                          {booking.trip?.date && new Date(booking.trip.date).toLocaleDateString("ru-RU")} в {booking.trip?.time}
                        </div>
                      </div>
                      <Badge 
                        className={
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }
                      >
                        {booking.status === 'pending' ? 'Ожидает' :
                         booking.status === 'approved' ? 'Подтверждено' :
                         booking.status === 'rejected' ? 'Отклонено' : booking.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        {booking.seats} мест • {(booking.trip?.price || 0) * booking.seats} ₽
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(booking.created_at).toLocaleDateString("ru-RU")}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {bookings.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  У вас пока нет бронирований
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Информация о пользователе */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Информация о тесте</h3>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Текущий пользователь:</strong> {user?.name} (ID: {user?.id})
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Всего поездок:</strong> {trips.length}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Мои бронирования:</strong> {bookings.length}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Инструкция:</strong> Создайте поездку под другим пользователем, затем забронируйте её здесь и проверьте управление заявками.
          </p>
        </div>
      </div>

      {/* Модальные окна */}
      {selectedTrip && (
        <>
          <BookTripModal
            isOpen={showBookModal}
            trip={selectedTrip}
            onClose={() => {
              setShowBookModal(false)
              setSelectedTrip(null)
            }}
            onSuccess={() => {
              setShowBookModal(false)
              setSelectedTrip(null)
              fetchBookings() // Обновляем список бронирований
            }}
          />
          
          <TripBookingsModal
            isOpen={showBookingsModal}
            trip={selectedTrip}
            onClose={() => {
              setShowBookingsModal(false)
              setSelectedTrip(null)
            }}
          />
        </>
      )}
    </div>
  )
} 