"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Calendar, Clock, Users, Plus, Edit, Trash2, Car, MessageCircle, Search, LogOut } from "lucide-react"
import { useTrips } from "@/hooks/use-trips"
import { CreateTripModal } from "@/components/trips/create-trip-modal"
import EditTripModal from "@/components/trips/edit-trip-modal"
import DeleteTripModal from "@/components/trips/delete-trip-modal"
import TripBookingsModal from "@/components/bookings/trip-bookings-modal"
import BookingRequestsModal from "@/components/bookings/booking-requests-modal"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export default function MyTripsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showBookingsModal, setShowBookingsModal] = useState(false)
  const [showRequestsModal, setShowRequestsModal] = useState(false)
  const [selectedTrip, setSelectedTrip] = useState<any>(null)
  const hasFetched = useRef(false)

  const { myTrips, isLoading, fetchMyTrips } = useTrips()
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Проверяем, что мы на клиенте
    if (typeof window === 'undefined') return
    
    // Проверяем localStorage напрямую
    const token = localStorage.getItem("auth_token")
    const userData = localStorage.getItem("user")
    
    if (!isAuthenticated && (!token || !userData)) {
      router.push("/")
      return
    }
    
    // Если есть данные в localStorage, но хук еще не обновился, ждем
    if (!isAuthenticated && token && userData) {
      return
    }
    
    // Загружаем поездки только один раз при первой аутентификации
    if (isAuthenticated && !hasFetched.current) {
      hasFetched.current = true
      fetchMyTrips()
    }
  }, [isAuthenticated, fetchMyTrips, router])

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleEditTrip = (trip: any) => {
    setSelectedTrip(trip)
    setShowEditModal(true)
  }

  const handleDeleteTrip = (trip: any) => {
    setSelectedTrip(trip)
    setShowDeleteModal(true)
  }

  const handleViewBookings = (trip: any) => {
    setSelectedTrip(trip)
    setShowBookingsModal(true)
  }

  const handleViewRequests = (trip: any) => {
    setSelectedTrip(trip)
    setShowRequestsModal(true)
  }

  const activeTrips = myTrips?.filter((trip) => trip?.status === "active") || []
  const completedTrips = myTrips?.filter((trip) => trip?.status === "completed") || []

  // Показываем загрузку, если пользователь не аутентифицирован, но есть данные в localStorage
  if (!isAuthenticated && typeof window !== 'undefined') {
    const token = localStorage.getItem("auth_token")
    const userData = localStorage.getItem("user")
    
    if (token && userData) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Проверка аутентификации...</p>
          </div>
        </div>
      )
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка ваших поездок...</p>
        </div>
      </div>
    )
  }

  const TripCard = ({ trip }: { trip: any }) => {
    // Проверяем, что trip существует и имеет необходимые поля
    if (!trip || !trip.from_city || !trip.to_city) {
      return null
    }

    return (
      <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          {/* Route */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-900">{trip.from_city}</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="font-medium text-gray-900">{trip.to_city}</span>
              </div>
            </div>
            <MapPin className="w-5 h-5 text-gray-400" />
          </div>

        {/* Date & Time */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(trip.date).toLocaleDateString("ru-RU")}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{trip.time}</span>
          </div>
        </div>

        {/* Car Info */}
        {(trip.carModel || trip.carColor || trip.numberCar) && (
          <div className="flex items-center space-x-2 mb-4 p-3 bg-gray-50 rounded-lg">
            <Car className="w-4 h-4 text-gray-500" />
            <div className="text-sm text-gray-600">
              {[trip.carModel, trip.carColor, trip.numberCar].filter(Boolean).join(" • ")}
            </div>
          </div>
        )}

        {/* Note */}
        {trip.note && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">{trip.note}</p>
          </div>
        )}

        {/* Price & Seats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{trip.seats} мест</span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{trip.price} ₽</div>
            <div className="text-sm text-gray-600">за место</div>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center justify-between">
          <Badge
            variant={trip.status === "active" ? "default" : "secondary"}
            className={
              trip.status === "active" ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-gray-100 text-gray-800"
            }
          >
            {trip.status === "active" ? "Активна" : "Завершена"}
          </Badge>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => handleViewRequests(trip)} size="sm" variant="outline" className="bg-white/80">
              <MessageCircle className="w-4 h-4 mr-1" />
              Запросы
            </Button>
            <Button onClick={() => handleViewBookings(trip)} size="sm" variant="outline" className="bg-white/80">
              <MessageCircle className="w-4 h-4 mr-1" />
              Бронирования
            </Button>
            {trip.status === "active" && (
              <>
                <Button onClick={() => handleEditTrip(trip)} size="sm" variant="outline" className="bg-white/80">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleDeleteTrip(trip)}
                  size="sm"
                  variant="outline"
                  className="bg-white/80 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Добро пожаловать, {user?.name || 'Пользователь'}!</h1>
            <p className="text-gray-600">Управляйте своими поездками и найдите попутчиков</p>
          </div>
          <Button 
            onClick={handleLogout} 
            variant="outline"
            className="bg-white/80 backdrop-blur-lg border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Выйти
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Plus className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Создать поездку</h3>
                  <p className="text-blue-100 mb-4">Предложите поездку и найдите попутчиков</p>
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-white text-blue-600 hover:bg-blue-50"
                  >
                    Создать поездку
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Search className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Найти поездку</h3>
                  <p className="text-purple-100 mb-4">Найдите подходящую поездку и забронируйте место</p>
                  <Button
                    onClick={() => router.push("/trips")}
                    className="bg-white text-purple-600 hover:bg-purple-50"
                  >
                    Найти поездку
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Trips Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Мои поездки</h2>
              <p className="text-gray-600">Управляйте своими поездками и просматривайте бронирования</p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-lg border-0 shadow-lg">
              <TabsTrigger value="active" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Активные ({activeTrips.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Завершенные ({completedTrips.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-6">
              {activeTrips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeTrips.map((trip) => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Car className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Нет активных поездок</h3>
                  <p className="text-gray-600 mb-6">Создайте свою первую поездку и найдите попутчиков</p>
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Создать поездку
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              {completedTrips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedTrips.map((trip) => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Car className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Нет завершенных поездок</h3>
                  <p className="text-gray-600">Завершенные поездки появятся здесь</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Navigation */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => router.push("/trips")}
            variant="outline"
            className="bg-white/80 backdrop-blur-lg border-gray-200"
          >
            Все поездки
          </Button>
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="bg-white/80 backdrop-blur-lg border-gray-200"
          >
            Вернуться на главную
          </Button>
        </div>
      </div>

      {/* Modals */}
      <CreateTripModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
      {selectedTrip && (
        <EditTripModal
          isOpen={showEditModal}
          trip={selectedTrip}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false)
            fetchMyTrips()
          }}
        />
      )}
      {selectedTrip && (
        <DeleteTripModal
          isOpen={showDeleteModal}
          trip={selectedTrip}
          onClose={() => setShowDeleteModal(false)}
          onSuccess={() => {
            setShowDeleteModal(false)
            fetchMyTrips()
          }}
        />
      )}
      {selectedTrip && (
        <TripBookingsModal
          isOpen={showBookingsModal}
          trip={selectedTrip}
          onClose={() => setShowBookingsModal(false)}
        />
      )}
      {selectedTrip && (
        <BookingRequestsModal
          isOpen={showRequestsModal}
          trip={selectedTrip}
          onClose={() => setShowRequestsModal(false)}
          onUpdate={() => {
            setShowRequestsModal(false)
            fetchMyTrips()
          }}
        />
      )}
    </div>
  )
}
