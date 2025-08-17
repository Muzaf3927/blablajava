"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, MapPin, Calendar, Clock, X } from "lucide-react"
import { useChat } from "@/hooks/use-chat"

interface ChatWindowProps {
  chat: any
  onClose?: () => void
  onMessageSent?: () => void
}

export default function ChatWindow({ chat, onClose, onMessageSent }: ChatWindowProps) {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { fetchChatMessages, sendMessage, isLoading } = useChat()

  useEffect(() => {
    if (chat) {
      loadMessages()
    }
  }, [chat])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    setLoading(true)
    try {
      const messages = await fetchChatMessages(chat.trip_id, chat.chat_partner_id)
      setMessages(messages || [])
    } catch (error) {
      console.error("Load messages error:", error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      await sendMessage(chat.trip_id, chat.chat_partner_id, newMessage.trim())
      setNewMessage("")
      await loadMessages()
      onMessageSent?.()
    } catch (error) {
      console.error("Send message error:", error)
    }
  }

  const getCurrentUserId = () => {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user).id : null
  }

  const currentUserId = getCurrentUserId()

  return (
    <Card className="bg-white/80 backdrop-blur-lg shadow-lg border-0 h-full flex flex-col">
      {/* Header */}
      <CardHeader className="pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={
                  chat.partner?.avatar
                    ? `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/storage/${chat.partner.avatar}`
                    : undefined
                }
                alt={chat.partner?.name}
              />
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm">
                {chat.partner?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">{chat.partner?.name}</h3>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <MapPin className="w-3 h-3" />
                <span>
                  {chat.trip?.from_city} → {chat.trip?.to_city}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(chat.trip?.date).toLocaleDateString("ru-RU")}</span>
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <Clock className="w-3 h-3" />
                <span>{chat.trip?.time}</span>
              </div>
            </div>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-2">Начните общение</div>
            <div className="text-sm text-gray-400">Отправьте первое сообщение</div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender_id === currentUserId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.sender_id === currentUserId
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <div className="text-sm">{message.message}</div>
                <div
                  className={`text-xs mt-1 ${message.sender_id === currentUserId ? "text-blue-100" : "text-gray-500"}`}
                >
                  {new Date(message.created_at).toLocaleTimeString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-100">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Введите сообщение..."
            className="flex-1 h-10 rounded-lg border-2 border-gray-200 focus:border-blue-500"
            maxLength={1000}
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || isLoading}
            className="h-10 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    </Card>
  )
}
