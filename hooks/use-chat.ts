"use client"

import { useState } from "react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

interface ChatMessage {
  id: number
  trip_id: number
  sender_id: number
  receiver_id: number
  message: string
  is_read: boolean
  created_at: string
  updated_at: string
}

interface Chat {
  trip_id: number
  chat_partner_id: number
  last_message_at: string
  unread_count: number
  partner: {
    id: number
    name: string
    avatar?: string
  }
  trip: {
    id: number
    from_city: string
    to_city: string
    date: string
    time: string
    price: number
  }
}

export function useChat() {
  const [chats, setChats] = useState<Chat[]>([])
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

  const fetchChats = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/chats`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Ошибка получения чатов")
      }

      const data = await response.json()
      setChats(data.chats || [])
    } catch (error) {
      console.error("Fetch chats error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/chats/unread-count`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Ошибка получения количества непрочитанных")
      }

      const data = await response.json()
      setUnreadCount(data.unread_count || 0)
    } catch (error) {
      console.error("Fetch unread count error:", error)
    }
  }

  const fetchChatMessages = async (tripId: number, partnerId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/trips/${tripId}/chat/${partnerId}`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Ошибка получения сообщений")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Fetch messages error:", error)
      throw error
    }
  }

  const sendMessage = async (tripId: number, receiverId: number, message: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/trips/${tripId}/chat`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          receiver_id: receiverId,
          message: message,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Ошибка отправки сообщения")
      }

      return data
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    chats,
    unreadCount,
    loading,
    isLoading,
    fetchChats,
    fetchUnreadCount,
    fetchChatMessages,
    sendMessage,
  }
}
