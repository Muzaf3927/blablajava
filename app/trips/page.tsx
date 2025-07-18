"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useTrips } from "@/hooks/use-trips"

export default function TripsPage() {
  const { user, isAuthenticated } = useAuth()
  const { trips, isLoading, fetchAllTrips } = useTrips()
  const router = useRouter()
  const hasFetched = useRef(false)

  useEffect(() => {
    console.log('=== TRIPS PAGE: useEffect triggered ===')
    console.log('TripsPage: isAuthenticated =', isAuthenticated)
    console.log('TripsPage: user =', user)
    
    if (!isAuthenticated) {
      console.log('=== TRIPS PAGE: Not authenticated, redirecting to /')
      router.push("/")
      return
    }
    
    // Загружаем поездки только один раз при первой аутентификации
    if (isAuthenticated && !hasFetched.current) {
      console.log('=== TRIPS PAGE: Authenticated, fetching trips (first time)')
      hasFetched.current = true
      fetchAllTrips()
    }
  }, [isAuthenticated, fetchAllTrips])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Поездки</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Информация о пользователе</h2>
          <p><strong>ID:</strong> {user?.id}</p>
          <p><strong>Имя:</strong> {user?.name}</p>
          <p><strong>Телефон:</strong> {user?.phone}</p>
          <p><strong>Аутентифицирован:</strong> {isAuthenticated ? 'Да' : 'Нет'}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Список поездок</h2>
          {trips.length === 0 ? (
            <p className="text-gray-600">Поездки не найдены</p>
          ) : (
            <div className="space-y-4">
              {trips.map((trip) => (
                <div key={trip.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold">{trip.from_city} → {trip.to_city}</h3>
                  <p>Дата: {trip.date}</p>
                  <p>Время: {trip.time}</p>
                  <p>Цена: {trip.price} ₽</p>
                  <p>Мест: {trip.seats}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6">
          <button 
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    </div>
  )
}
