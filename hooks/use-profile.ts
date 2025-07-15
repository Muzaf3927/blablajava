"use client"

import { useState } from "react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

interface User {
  id: number
  name: string
  phone: string
  avatar?: string
  role?: string
  balance: number
  rating: number
  rating_count: number
  created_at: string
}

export function useProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const getAuthHeaders = () => {
    const token = localStorage.getItem("auth_token")
    return {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    }
  }

  const fetchUser = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/user`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Ошибка получения данных пользователя")
      }

      const userData = await response.json()
      setUser(userData)

      localStorage.setItem("user", JSON.stringify(userData))
    } catch (error) {
      console.error("Fetch user error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (formData: FormData) => {
    setIsLoading(true)
    try {
      const headers = getAuthHeaders()
      delete (headers as any)["Content-Type"]

      const response = await fetch(`${API_BASE_URL}/user`, {
        method: "PATCH",
        headers,
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Ошибка обновления профиля")
      }

      setUser(data.user)
      localStorage.setItem("user", JSON.stringify(data.user))

      return data
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user,
    loading,
    isLoading,
    fetchUser,
    updateProfile,
  }
}
