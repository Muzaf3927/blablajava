"use client"

import { useState } from "react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

interface Notification {
  id: number
  user_id: number
  sender_id?: number
  type: string
  message: string
  data?: string
  is_read: boolean
  created_at: string
  updated_at: string
  sender?: {
    id: number
    name: string
    avatar?: string
  }
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const getAuthHeaders = () => {
    const token = localStorage.getItem("auth_token")
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  }

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Ошибка получения уведомлений")
      }

      const data = await response.json()
      const notificationsList = data.notifications || []
      setNotifications(notificationsList)
      setUnreadCount(notificationsList.filter((n: Notification) => !n.is_read).length)
    } catch (error) {
      console.error("Fetch notifications error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Ошибка отметки уведомления")
      }

      // Обновляем локальное состояние
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId ? { ...notification, is_read: true } : notification,
        ),
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Mark as read error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const markAllAsRead = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Ошибка отметки всех уведомлений")
      }

      // Обновляем локальное состояние
      setNotifications((prev) => prev.map((notification) => ({ ...notification, is_read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Mark all as read error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    notifications,
    unreadCount,
    loading,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  }
}
