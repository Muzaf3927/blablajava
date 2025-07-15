"use client"

import { useState } from "react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

interface Setting {
  id: number
  key: string
  value: string | null
  created_at: string
  updated_at: string
}

export function useSettings() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const getAuthHeaders = () => {
    const token = localStorage.getItem("auth_token")
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  }

  const fetchSettings = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/settings`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Ошибка загрузки настроек")
      }

      const data = await response.json()
      setSettings(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching settings:", error)
      setSettings([])
    } finally {
      setIsLoading(false)
    }
  }

  const getSetting = async (key: string): Promise<Setting | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/${key}`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error("Ошибка получения настройки")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching setting:", error)
      return null
    }
  }

  const createSetting = async (key: string, value: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ key, value }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Ошибка создания настройки")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error creating setting:", error)
      throw error
    }
  }

  const updateSetting = async (key: string, value: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ key, value }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Ошибка обновления настройки")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error updating setting:", error)
      throw error
    }
  }

  const deleteSetting = async (key: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/${key}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Ошибка удаления настройки")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error deleting setting:", error)
      throw error
    }
  }

  return {
    settings,
    isLoading,
    fetchSettings,
    getSetting,
    createSetting,
    updateSetting,
    deleteSetting,
  }
}
