"use client"

import { useState } from "react"
import { apiClient } from "@/lib/api"
import { Chat, Message } from "@/lib/types"

export function useChat() {
  const [chats, setChats] = useState<Chat[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchChats = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.getUserChats()
      setChats(response.chats || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка получения чатов")
      setChats([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const response = await apiClient.getUnreadCount()
      setUnreadCount(response.unread_count || 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка получения количества непрочитанных")
    }
  }

  const fetchChatMessages = async (tripId: number, receiverId: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.getChatMessages(tripId, receiverId)
      return response.messages || []
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка получения сообщений")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async (tripId: number, receiverId: number, message: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.sendMessage(tripId, {
        receiver_id: receiverId,
        message: message,
      })
      
      // Обновляем количество непрочитанных сообщений
      await fetchUnreadCount()
      
      return response.message
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка отправки сообщения")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    chats,
    unreadCount,
    isLoading,
    error,
    fetchChats,
    fetchUnreadCount,
    fetchChatMessages,
    sendMessage,
  }
}
