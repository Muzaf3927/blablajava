"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Search, MapPin, Calendar, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import ChatWindow from "@/components/chat/chat-window"
import { useChat } from "@/hooks/use-chat"

export default function ChatsPage() {
  const [selectedChat, setSelectedChat] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const { chats, unreadCount, loading, fetchChats, fetchUnreadCount } = useChat()

  useEffect(() => {
    fetchChats()
    fetchUnreadCount()

    // Обновляем каждые 30 секунд
    const interval = setInterval(() => {
      fetchChats()
      fetchUnreadCount()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const filteredChats = chats.filter(
    (chat) =>
      chat.partner?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.trip?.from_city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.trip?.to_city.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
              <MessageCircle className="w-8 h-8 mr-3 text-blue-600" />
              Сообщения
              {unreadCount > 0 && <Badge className="ml-3 bg-red-500 text-white border-0">{unreadCount}</Badge>}
            </h1>
            <p className="text-gray-600 mt-1">Общайтесь с попутчиками и водителями</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Chats List */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-lg shadow-lg border-0 h-full flex flex-col">
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Поиск чатов..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-10 rounded-lg border-2 border-gray-200 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredChats.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Нет сообщений</h3>
                    <p className="text-gray-600 text-sm">
                      {searchQuery ? "Чаты не найдены" : "Ваши сообщения появятся здесь"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1 p-2">
                    {filteredChats.map((chat) => (
                      <div
                        key={`${chat.trip_id}-${chat.chat_partner_id}`}
                        onClick={() => setSelectedChat(chat)}
                        className={`p-4 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                          selectedChat?.trip_id === chat.trip_id &&
                          selectedChat?.chat_partner_id === chat.chat_partner_id
                            ? "bg-blue-50 border-l-4 border-blue-500"
                            : ""
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="relative">
                            <Avatar className="w-12 h-12">
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
                            {chat.unread_count > 0 && (
                              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {chat.unread_count}
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-gray-900 truncate">{chat.partner?.name}</h4>
                              <span className="text-xs text-gray-500">
                                {new Date(chat.last_message_at).toLocaleDateString("ru-RU")}
                              </span>
                            </div>

                            <div className="flex items-center space-x-1 text-xs text-gray-600 mb-2">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">
                                {chat.trip?.from_city} → {chat.trip?.to_city}
                              </span>
                            </div>

                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(chat.trip?.date).toLocaleDateString("ru-RU")}</span>
                              <Clock className="w-3 h-3" />
                              <span>{chat.trip?.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2">
            {selectedChat ? (
              <ChatWindow
                chat={selectedChat}
                onClose={() => setSelectedChat(null)}
                onMessageSent={() => {
                  fetchChats()
                  fetchUnreadCount()
                }}
              />
            ) : (
              <Card className="bg-white/80 backdrop-blur-lg shadow-lg border-0 h-full flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Выберите чат</h3>
                  <p className="text-gray-600">Выберите собеседника из списка слева</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
