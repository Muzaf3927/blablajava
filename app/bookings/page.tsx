"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Calendar, Clock, Users, Star, X, CheckCircle } from "lucide-react"

interface Booking {
  id: number
  status: "confirmed" | "completed" | "cancelled"
  seats: number
  total_price: number
  rated: boolean
  trip?: {
    from_city: string
    to_city: string
    date: string
    time: string
    user_id: number
    driver?: {
      name: string
      rating: number
      rating_count: number
      avatar?: string
    }
  }
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("auth_token")
      const userData = localStorage.getItem("user")
      
      if (token && userData) {
        setIsAuthenticated(true)
        fetchBookings()
      } else {
        window.location.href = "/"
      }
    }

    checkAuth()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      // TODO: Заменить на реальный API вызов
      const mockBookings: Booking[] = []
      setBookings(mockBookings)
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const activeBookings = bookings.filter((booking) => booking.status === "confirmed")
  const completedBookings = bookings.filter((booking) => booking.status === "completed")
  const cancelledBookings = bookings.filter((booking) => booking.status === "cancelled")

  // Показываем загрузку, если пользователь не аутентифицирован
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Проверка аутентификации...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка бронирований...</p>
          </div>
        </div>
    )
  }

  const BookingCard = ({ booking }: { booking: Booking }) => (
      <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          {/* Driver Info */}
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="w-12 h-12 border-2 border-white shadow-lg">
              <AvatarImage src="/placeholder.svg?height=48&width=48" />
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold">
                {booking.trip?.driver?.name?.charAt(0)?.toUpperCase() || "D"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{booking.trip?.driver?.name || "Водитель"}</h3>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm text-gray-600">
                {booking.trip?.driver?.rating || 0} ({booking.trip?.driver?.rating_count || 0})
              </span>
              </div>
            </div>
          </div>

          {/* Route */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-900">{booking.trip?.from_city || "Откуда"}</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="font-medium text-gray-900">{booking.trip?.to_city || "Куда"}</span>
              </div>
            </div>
            <MapPin className="w-5 h-5 text-gray-400" />
          </div>

          {/* Date & Time */}
          <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>
              {booking.trip?.date ? new Date(booking.trip.date).toLocaleDateString("ru-RU") : "Дата не указана"}
            </span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{booking.trip?.time || "Время не указано"}</span>
            </div>
          </div>

          {/* Booking Details */}
          <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">{booking.seats} мест забронировано</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-900">{booking.total_price} ₽</div>
              <div className="text-xs text-blue-700">к оплате</div>
            </div>
          </div>

          {/* Status & Actions */}
          <div className="flex items-center justify-between">
            <Badge
                variant={
                  booking.status === "confirmed" ? "default" : booking.status === "completed" ? "secondary" : "destructive"
                }
                className={
                  booking.status === "confirmed"
                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                      : booking.status === "completed"
                          ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                }
            >
              {booking.status === "confirmed"
                  ? "Подтверждено"
                  : booking.status === "completed"
                      ? "Завершено"
                      : "Отменено"}
            </Badge>

            <div className="flex space-x-2">
              {booking.status === "confirmed" && (
                  <Button size="sm" variant="outline" className="bg-white/80 text-red-600 hover:text-red-700">
                    <X className="w-4 h-4 mr-1" />
                    Отменить
                  </Button>
              )}

              {booking.status === "completed" && !booking.rated && (
                  <Button
                      size="sm"
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                  >
                    <Star className="w-4 h-4 mr-1" />
                    Оценить
                  </Button>
              )}

              {booking.status === "completed" && booking.rated && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Оценено
                  </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
  )

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Мои бронирования</h1>
            <p className="text-gray-600">Управляйте своими бронированиями и оценивайте поездки</p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-lg border-0 shadow-lg">
              <TabsTrigger value="active" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Активные ({activeBookings.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Завершенные ({completedBookings.length})
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Отмененные ({cancelledBookings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-6">
              {activeBookings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeBookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
              ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Нет активных бронирований</h3>
                    <p className="text-gray-600">Забронируйте поездку, чтобы начать путешествие</p>
                  </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              {completedBookings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedBookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
              ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Нет завершенных поездок</h3>
                    <p className="text-gray-600">Здесь будут отображаться ваши завершенные поездки</p>
                  </div>
              )}
            </TabsContent>

            <TabsContent value="cancelled" className="mt-6">
              {cancelledBookings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cancelledBookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
              ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <X className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Нет отмененных бронирований</h3>
                    <p className="text-gray-600">Здесь будут отображаться отмененные бронирования</p>
                  </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
  )
}
