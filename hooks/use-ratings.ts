"use client"

import { useState } from "react"
import { apiClient } from "@/lib/api"
import { Rating } from "@/lib/types"

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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReceivedRatings = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      const response = await apiClient.getUserRatings(user.id)
      setReceivedRatings(response.ratings.data || [])

      if (response.average_rating !== undefined) {
        setStats((prev) => ({
          ...prev,
          average_rating: response.average_rating,
          total_received: response.ratings.total || 0,
        }))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка получения отзывов")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchGivenRatings = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.getMyRatingsGiven()
      setGivenRatings(response.ratings_given.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка получения данных")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserRatings = async (userId: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.getUserRatings(userId)
      setUserRatings(response.ratings.data || [])
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка получения отзывов пользователя")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")

      // Получаем полученные отзывы
      const receivedResponse = await apiClient.getUserRatings(user.id)

      // Получаем данные отзывы
      const givenResponse = await apiClient.getMyRatingsGiven()

      // Подсчитываем распределение
      const distribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      receivedResponse.ratings.data?.forEach((rating: Rating) => {
        distribution[rating.rating] = (distribution[rating.rating] || 0) + 1
      })

      // Подсчитываем отзывы за этот месяц
      const thisMonth = new Date()
      thisMonth.setDate(1)
      const thisMonthCount =
        receivedResponse.ratings.data?.filter((rating: Rating) => new Date(rating.created_at) >= thisMonth).length || 0

      setStats({
        average_rating: receivedResponse.average_rating || 0,
        total_received: receivedResponse.ratings.total || 0,
        total_given: givenResponse.ratings_given.total || 0,
        this_month: thisMonthCount,
        distribution,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка получения статистики")
    }
  }

  const rateUser = async (tripId: number, userId: number, rating: number, comment?: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.rateUser(tripId, userId, {
        rating,
        comment: comment || undefined,
      })

      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка при оценке пользователя")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    receivedRatings,
    givenRatings,
    userRatings,
    stats,
    isLoading,
    error,
    fetchReceivedRatings,
    fetchGivenRatings,
    fetchUserRatings,
    fetchStats,
    rateUser,
  }
}
