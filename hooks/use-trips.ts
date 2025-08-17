"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient } from "@/lib/api"
import { Trip, TripForm } from "@/lib/types"

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [myTrips, setMyTrips] = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAllTrips = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.getAllTrips()
      if (response?.trips) {
        setTrips(response.trips)
      } else {
        setTrips([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки поездок")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchMyTrips = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.getMyTrips()
      if (response?.trips) {
        setMyTrips(response.trips)
      } else {
        setMyTrips([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки моих поездок")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createTrip = async (tripData: TripForm) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.createTrip(tripData)
      if (response?.trip) {
        setMyTrips((prev: Trip[]) => [response.trip, ...prev])
        setTrips((prev: Trip[]) => [response.trip, ...prev])
      }
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка создания поездки")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateTrip = async (tripId: number, tripData: Partial<TripForm>) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.updateTrip(tripId, tripData)
      if (response?.trip) {
        setMyTrips(prev => prev.map(trip => 
          trip.id === tripId ? response.trip : trip
        ))
        setTrips(prev => prev.map(trip => 
          trip.id === tripId ? response.trip : trip
        ))
      }
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка обновления поездки")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const deleteTrip = async (tripId: number) => {
    setIsLoading(true)
    setError(null)
    try {
      await apiClient.deleteTrip(tripId)
      setMyTrips(prev => prev.filter(trip => trip.id !== tripId))
      setTrips(prev => prev.filter(trip => trip.id !== tripId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка удаления поездки")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const completeTrip = async (tripId: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.completeTrip(tripId)
      // Обновляем статус поездки в списках
      setMyTrips(prev => prev.map(trip => 
        trip.id === tripId ? { ...trip, status: 'completed' } : trip
      ))
      setTrips(prev => prev.map(trip => 
        trip.id === tripId ? { ...trip, status: 'completed' } : trip
      ))
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка завершения поездки")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    trips,
    myTrips,
    isLoading,
    error,
    fetchAllTrips,
    fetchMyTrips,
    createTrip,
    updateTrip,
    deleteTrip,
    completeTrip,
  }
}
