"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Clock, Users, Plus, Car, Search, Filter } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useTrips } from "@/hooks/use-trips"
import { CreateTripModal } from "@/components/trips/create-trip-modal"
import TripFilters from "@/components/trips/trip-filters"
import BookTripModal from "@/components/bookings/book-trip-modal"

export default function TripsPage() {
  const { user, isAuthenticated } = useAuth()
  const { trips, isLoading, fetchAllTrips } = useTrips()
  const router = useRouter()
  const hasFetched = useRef(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filteredTrips, setFilteredTrips] = useState(trips)
  const [selectedTrip, setSelectedTrip] = useState<any>(null)
  const [showBookModal, setShowBookModal] = useState(false)

  console.log('=== TRIPS PAGE: Component rendered ===')
  console.log('TripsPage: isAuthenticated =', isAuthenticated)
  console.log('TripsPage: user =', user)
  console.log('TripsPage: hasFetched.current =', hasFetched.current)
  console.log('TripsPage: isLoading =', isLoading)
  console.log('TripsPage: trips =', trips)
  console.log('TripsPage: trips.length =', trips.length)

  useEffect(() => {
    console.log('=== TRIPS PAGE: useEffect triggered ===')
    console.log('TripsPage: isAuthenticated =', isAuthenticated)
    console.log('TripsPage: user =', user)
    
    // Проверяем localStorage напрямую
    const token = localStorage.getItem("auth_token")
    const userData = localStorage.getItem("user")
    
    console.log('TripsPage: Token from localStorage:', !!token)
    console.log('TripsPage: User data from localStorage:', !!userData)
    
    if (!isAuthenticated && (!token || !userData)) {
      console.log('=== TRIPS PAGE: Not authenticated (no token or user data), redirecting to /')
      router.push("/")
      return
    }
    
    // Если есть данные в localStorage, но хук еще не обновился, ждем
    if (!isAuthenticated && token && userData) {
      console.log('=== TRIPS PAGE: Data in localStorage but hook not updated yet, waiting...')
      return
    }
    
    // Загружаем поездки только один раз при первой аутентификации
    if (isAuthenticated && !hasFetched.current) {
      console.log('=== TRIPS PAGE: Authenticated, fetching trips (first time)')
      hasFetched.current = true
      fetchAllTrips()
    }
  }, [isAuthenticated, fetchAllTrips])

  // Обновляем отфильтрованные поездки при изменении trips
  useEffect(() => {
    setFilteredTrips(trips)
  }, [trips])

  const handleFilterChange = (filters: any) => {
    let filtered = trips

    if (filters.from) {
      filtered = filtered.filter(trip => 
        trip.from_city.toLowerCase().includes(filters.from.toLowerCase())
      )
    }

    if (filters.to) {
      filtered = filtered.filter(trip => 
        trip.to_city.toLowerCase().includes(filters.to.toLowerCase())
      )
    }

    if (filters.date) {
      filtered = filtered.filter(trip => trip.date === filters.date)
    }

    if (filters.seats) {
      filtered = filtered.filter(trip => trip.seats >= parseInt(filters.seats))
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(trip => trip.price <= parseInt(filters.maxPrice))
    }

    setFilteredTrips(filtered)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка поездок...</p>
        </div>
      </div>
    )
  }

  const TripCard = ({ trip }: { trip: any }) => (
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

        {/* Driver Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">
                {trip.driver?.name?.charAt(0) || 'В'}
              </span>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {trip.driver?.name || 'Водитель'}
              </div>
              <div className="text-xs text-gray-500">
                {trip.driver?.rating ? `★ ${trip.driver.rating}` : 'Новый водитель'}
              </div>
            </div>
          </div>

          <Button 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => {
              setSelectedTrip(trip)
              setShowBookModal(true)
            }}
          >
            Забронировать
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Найти поездку</h1>
            <p className="text-gray-600">Найдите попутчиков или создайте свою поездку</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="bg-white/80 backdrop-blur-lg border-gray-200"
            >
              <Filter className="w-4 h-4 mr-2" />
              Фильтры
            </Button>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Создать поездку
            </Button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-6">
            <TripFilters onFilterChange={handleFilterChange} />
          </div>
        )}

        {/* Trips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.length > 0 ? (
            filteredTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {trips.length === 0 ? 'Нет доступных поездок' : 'Поездки не найдены'}
              </h3>
              <p className="text-gray-600 mb-6">
                {trips.length === 0 
                  ? 'Создайте свою первую поездку и найдите попутчиков'
                  : 'Попробуйте изменить фильтры поиска'
                }
              </p>
              {trips.length === 0 && (
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Создать поездку
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-center space-x-4">
          <Button
            onClick={() => router.push("/my-trips")}
            variant="outline"
            className="bg-white/80 backdrop-blur-lg border-gray-200"
          >
            Мои поездки
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

      {/* Create Trip Modal */}
      <CreateTripModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
      
      {/* Book Trip Modal */}
      {selectedTrip && (
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
            // Можно добавить уведомление об успешном бронировании
          }}
        />
      )}
    </div>
  )
}
