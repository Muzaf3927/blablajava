"use client"

import { useState } from "react"
import { apiClient } from "@/lib/api"
import { Booking, BookingForm } from "@/lib/types"

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = async () => {
    setIsLoading(true)
    setError(null)
    try {
      console.log('=== BOOKINGS: Fetching my bookings ===')
      const response = await apiClient.getMyBookings()
      console.log('=== BOOKINGS: My bookings response ===', response)
      setBookings(response || [])
    } catch (err) {
      console.error('=== BOOKINGS: Error fetching bookings ===', err)
      setError(err instanceof Error ? err.message : "Ошибка загрузки бронирований")
      setBookings([])
    } finally {
      setIsLoading(false)
    }
  }

  const createBooking = async (tripId: number, seats: number) => {
    setIsLoading(true)
    setError(null)
    try {
      console.log('=== BOOKINGS: Creating booking ===', { tripId, seats })
      const bookingData: BookingForm = { seats }
      const response = await apiClient.createBooking(tripId, bookingData)
      console.log('=== BOOKINGS: Create booking response ===', response)
      
      // Добавляем новое бронирование в список
      setBookings((prev: Booking[]) => [response, ...prev])
      
      console.log('=== BOOKINGS: Booking created successfully ===')
      return response
    } catch (err) {
      console.error('=== BOOKINGS: Error creating booking ===', err)
      setError(err instanceof Error ? err.message : "Ошибка создания бронирования")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTripBookings = async (tripId: number) => {
    setIsLoading(true)
    setError(null)
    try {
      console.log('=== BOOKINGS: Fetching trip bookings ===', tripId)
      const response = await apiClient.getTripBookings(tripId)
      console.log('=== BOOKINGS: Trip bookings response ===', response)
      return { bookings: response || [] }
    } catch (err) {
      console.error('=== BOOKINGS: Error fetching trip bookings ===', err)
      setError(err instanceof Error ? err.message : "Ошибка загрузки бронирований поездки")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: number, status: 'approved' | 'rejected') => {
    setIsLoading(true)
    setError(null)
    try {
      console.log('=== BOOKINGS: Updating booking status ===', { bookingId, status })
      const response = await apiClient.updateBooking(bookingId, { status })
      console.log('=== BOOKINGS: Update booking status response ===', response)
      
      // Обновляем бронирование в списке
      setBookings((prev: Booking[]) => prev.map((booking: Booking) => 
        booking.id === bookingId ? response : booking
      ))
      
      console.log('=== BOOKINGS: Booking status updated successfully ===')
      return response
    } catch (err) {
      console.error('=== BOOKINGS: Error updating booking status ===', err)
      setError(err instanceof Error ? err.message : "Ошибка обновления статуса бронирования")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const cancelBooking = async (bookingId: number) => {
    setIsLoading(true)
    setError(null)
    try {
      console.log('=== BOOKINGS: Cancelling booking ===', bookingId)
      const response = await apiClient.cancelBooking(bookingId)
      console.log('=== BOOKINGS: Cancel booking response ===', response)
      
      // Обновляем бронирование в списке
      setBookings((prev: Booking[]) => prev.map((booking: Booking) => 
        booking.id === bookingId ? response : booking
      ))
      
      console.log('=== BOOKINGS: Booking cancelled successfully ===')
      return response
    } catch (err) {
      console.error('=== BOOKINGS: Error cancelling booking ===', err)
      setError(err instanceof Error ? err.message : "Ошибка отмены бронирования")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    bookings,
    isLoading,
    error,
    fetchBookings,
    createBooking,
    fetchTripBookings,
    updateBookingStatus,
    cancelBooking,
  }
}
