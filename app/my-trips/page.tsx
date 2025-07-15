"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Calendar, Clock, Users, Plus, Edit, Trash2, Car, MessageCircle } from "lucide-react"
import { useTrips } from "@/hooks/use-trips"
import { CreateTripModal } from "@/components/trips/create-trip-modal"
import EditTripModal from "@/components/trips/edit-trip-modal"
import DeleteTripModal from "@/components/trips/delete-trip-modal"
import TripBookingsModal from "@/components/bookings/trip-bookings-modal"

export default function MyTripsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showBookingsModal, setShowBookingsModal] = useState(false)
  const [selectedTrip, setSelectedTrip] = useState<any>(null)
  const hasFetched = useRef(false)

  const { myTrips, isLoading, fetchMyTrips } = useTrips()

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true
      fetchMyTrips()
    }
  }, [fetchMyTrips])

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

  const activeTrips = myTrips.filter((trip) => trip.status === "active")
  const completedTrips = myTrips.filter((trip) => trip.status === "completed")

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

          <div className="flex space-x-2">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Мои поездки</h1>
            <p className="text-gray-600">Управляйте своими поездками и просматривайте бронирования</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg mt-4 sm:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Создать поездку
          </Button>
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
                  <Calendar className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Нет завершенных поездок</h3>
                <p className="text-gray-600">Здесь будут отображаться ваши завершенные поездки</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <CreateTripModal
        isOpen={showCreateModal}
        onClose={() => {
          fetchMyTrips()
          setShowCreateModal(false)
        }}
      />

      <EditTripModal
        isOpen={showEditModal}
        trip={selectedTrip}
        onClose={() => {
          setShowEditModal(false)
          setSelectedTrip(null)
        }}
        onSuccess={() => {
          fetchMyTrips()
          setShowEditModal(false)
          setSelectedTrip(null)
        }}
      />

      <DeleteTripModal
        isOpen={showDeleteModal}
        trip={selectedTrip}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedTrip(null)
        }}
        onSuccess={() => {
          fetchMyTrips()
          setShowDeleteModal(false)
          setSelectedTrip(null)
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
    </div>
  )
}
