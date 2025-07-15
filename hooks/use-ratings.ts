"use client"

import { useState } from "react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

interface Rating {
  id: number
  from_user_id: number
  to_user_id: number
  trip_id: number
  rating: number
  comment?: string
  created_at: string
  from_user?: {
    id: number
    name: string
    avatar?: string
  }
  to_user?: {
    id: number
    name: string
    avatar?: string
  }
  trip?: {
    id: number
    from_address: string
    to_address: string
    departure_time: string
  }
}

interface RatingStats {
  average_rating: number
  total_received: number
  total_given: number
  this_month: number
  distribution: { [key: number]: number }
}

export function useRatings() {
  const [receivedRatings, setReceivedRatings] = useState<Rating[]>([])
  const [givenRatings, setGivenRatings] = useState<Rating[]>([])
  const [userRatings, setUserRatings] = useState<Rating[]>([])
  const [stats, setStats] = useState<RatingStats | null>(null)
  const [loading, setLoading] = useState(false)

  const getAuthHeaders = () => {
    const token = localStorage.getItem("auth_token")
    return {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    }
  }

  const fetchReceivedRatings = async () => {
    setLoading(true)
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      const response = await fetch(`${API_BASE_URL}/ratings/user/${user.id}`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Ошибка получения отзывов")
      }

      const data = await response.json()
      setReceivedRatings(data.ratings.data || [])

      if (data.average_rating !== undefined) {
        setStats((prev) => ({
          ...prev,
          average_rating: data.average_rating,
          total_received: data.ratings.total || 0,
        }))
      }
    } catch (error) {
      console.error("Fetch received ratings error:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchGivenRatings = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/ratings/my-given`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Ошибка получения данных")
      }

      const data = await response.json()
      setGivenRatings(data.ratings_given.data || [])
    } catch (error) {
      console.error("Fetch given ratings error:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserRatings = async (userId: number) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/ratings/user/${userId}`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Ошибка получения отзывов пользователя")
      }

      const data = await response.json()
      setUserRatings(data.ratings.data || [])
      return data
    } catch (error) {
      console.error("Fetch user ratings error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")

      // Получаем полученные отзывы
      const receivedResponse = await fetch(`${API_BASE_URL}/ratings/user/${user.id}`, {
        headers: getAuthHeaders(),
      })

      // Получаем данные отзывы
      const givenResponse = await fetch(`${API_BASE_URL}/ratings/my-given`, {
        headers: getAuthHeaders(),
      })

      if (receivedResponse.ok && givenResponse.ok) {
        const receivedData = await receivedResponse.json()
        const givenData = await givenResponse.json()

        // Подсчитываем распределение
        const distribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        receivedData.ratings.data?.forEach((rating: Rating) => {
          distribution[rating.rating] = (distribution[rating.rating] || 0) + 1
        })

        // Подсчитываем отзывы за этот месяц
        const thisMonth = new Date()
        thisMonth.setDate(1)
        const thisMonthCount =
          receivedData.ratings.data?.filter((rating: Rating) => new Date(rating.created_at) >= thisMonth).length || 0

        setStats({
          average_rating: receivedData.average_rating || 0,
          total_received: receivedData.ratings.total || 0,
          total_given: givenData.ratings_given.total || 0,
          this_month: thisMonthCount,
          distribution,
        })
      }
    } catch (error) {
      console.error("Fetch stats error:", error)
    }
  }

  const rateUser = async (tripId: number, userId: number, rating: number, comment?: string) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/ratings/trip/${tripId}/user/${userId}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          rating,
          comment: comment || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Ошибка при оценке пользователя")
      }

      return data
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    receivedRatings,
    givenRatings,
    userRatings,
    stats,
    loading,
    fetchReceivedRatings,
    fetchGivenRatings,
    fetchUserRatings,
    fetchStats,
    rateUser,
  }
}
