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
      console.log('=== TRIPS: Fetching all trips ===')
      const response = await apiClient.getAllTrips()
      console.log('=== TRIPS: All trips response ===', response)
      if (response?.trips) {
        setTrips(response.trips)
        console.log('=== TRIPS: Set trips ===', response.trips)
      } else {
        console.log('=== TRIPS: No trips in response ===')
        setTrips([])
      }
    } catch (err) {
      console.error('=== TRIPS: Error fetching all trips ===', err)
      setError(err instanceof Error ? err.message : "Ошибка загрузки поездок")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchMyTrips = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      console.log('=== TRIPS: Fetching my trips ===')
      const response = await apiClient.getMyTrips()
      console.log('=== TRIPS: My trips response ===', response)
      if (response?.trips) {
        setMyTrips(response.trips)
        console.log('=== TRIPS: Set my trips ===', response.trips)
      } else {
        console.log('=== TRIPS: No my trips in response ===')
        setMyTrips([])
      }
    } catch (err) {
      console.error('=== TRIPS: Error fetching my trips ===', err)
      setError(err instanceof Error ? err.message : "Ошибка загрузки моих поездок")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createTrip = async (tripData: TripForm) => {
    setIsLoading(true)
    setError(null)
    try {
      console.log('=== TRIPS: Creating trip ===', tripData)
      const response = await apiClient.createTrip(tripData)
      console.log('=== TRIPS: Create trip response ===', response)
      if (response?.trip) {
        setMyTrips((prev: Trip[]) => [response.trip, ...prev])
        setTrips((prev: Trip[]) => [response.trip, ...prev])
        console.log('=== TRIPS: Trip created successfully ===')
      }
      return response
    } catch (err) {
      console.error('=== TRIPS: Error creating trip ===', err)
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
      console.log('=== TRIPS: Updating trip ===', tripId, tripData)
      const response = await apiClient.updateTrip(tripId, tripData)
      console.log('=== TRIPS: Update trip response ===', response)
      if (response?.trip) {
        setMyTrips(prev => prev.map(trip => 
          trip.id === tripId ? response.trip : trip
        ))
        setTrips(prev => prev.map(trip => 
          trip.id === tripId ? response.trip : trip
        ))
        console.log('=== TRIPS: Trip updated successfully ===')
      }
      return response
    } catch (err) {
      console.error('=== TRIPS: Error updating trip ===', err)
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
  }
}
