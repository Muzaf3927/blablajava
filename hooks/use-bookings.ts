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
      const response = await apiClient.getMyBookings()
      setBookings(response || [])
    } catch (err) {
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
      const bookingData: BookingForm = { seats }
      const response = await apiClient.createBooking(tripId, bookingData)
      
      // Добавляем новое бронирование в список
      setBookings((prev: Booking[]) => [response, ...prev])
      
      return response
    } catch (err) {
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
      const response = await apiClient.getTripBookings(tripId)
      return { bookings: response?.bookings || [] }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки бронирований поездки")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: number, status: 'confirmed' | 'declined') => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.updateBooking(bookingId, { status })
      
      // Обновляем бронирование в списке
      setBookings((prev: Booking[]) => prev.map((booking: Booking) => 
        booking.id === bookingId ? response : booking
      ))
      
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка обновления статуса бронирования")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const approveBooking = async (bookingId: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.approveBooking(bookingId)
      
      // Обновляем бронирование в списке - backend возвращает { message, status }
      setBookings((prev: Booking[]) => prev.map((booking: Booking) => 
        booking.id === bookingId ? { ...booking, status: response.status } : booking
      ))
      
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка подтверждения бронирования")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const rejectBooking = async (bookingId: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.rejectBooking(bookingId)
      
      // Обновляем бронирование в списке - backend возвращает { message, status }
      setBookings((prev: Booking[]) => prev.map((booking: Booking) => 
        booking.id === bookingId ? { ...booking, status: response.status } : booking
      ))
      
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка отклонения бронирования")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const cancelBooking = async (bookingId: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.cancelBooking(bookingId)
      
      // Обновляем бронирование в списке
      setBookings((prev: Booking[]) => prev.map((booking: Booking) => 
        booking.id === bookingId ? response : booking
      ))
      
      return response
    } catch (err) {
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
    approveBooking,
    rejectBooking,
    cancelBooking,
  }
}
