"use client"

import { useState } from "react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

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

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        throw new Error("No auth token")
      }

      const response = await fetch(`${API_BASE_URL}/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch bookings")
      }

      const data = await response.json()
      setBookings(data.bookings || [])
    } catch (error) {
      console.error("Error fetching bookings:", error)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  return {
    bookings,
    loading,
    fetchBookings,
  }
}
