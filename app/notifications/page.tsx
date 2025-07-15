"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, MessageCircle, Calendar, Car, Check, CheckCheck } from "lucide-react"
import { useNotifications } from "@/hooks/use-notifications"

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all")
  const { notifications, unreadCount, loading, fetchNotifications, markAsRead, markAllAsRead } = useNotifications()

  useEffect(() => {
    fetchNotifications()
  }, [])

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") {
      return !notification.is_read
    }
    return true
  })

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "chat":
        return <MessageCircle className="w-5 h-5 text-blue-500" />
      case "booking":
        return <Calendar className="w-5 h-5 text-green-500" />
      case "trip":
        return <Car className="w-5 h-5 text-purple-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "chat":
        return "bg-blue-50 border-blue-200"
      case "booking":
        return "bg-green-50 border-green-200"
      case "trip":
        return "bg-purple-50 border-purple-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const handleNotificationClick = async (notification: any) => {
    if (!notification.is_read) {
      await markAsRead(notification.id)
    }

    // Навигация в зависимости от типа уведомления
    if (notification.type === "chat" && notification.data) {
      const data = JSON.parse(notification.data)
      window.location.href = `/chats?trip=${data.trip_id}`
    } else if (notification.type === "booking") {
      window.location.href = "/bookings"
    } else if (notification.type === "trip") {
      window.location.href = "/my-trips"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
              <Bell className="w-8 h-8 mr-3 text-blue-600" />
              Уведомления
              {unreadCount > 0 && <Badge className="ml-3 bg-red-500 text-white border-0">{unreadCount}</Badge>}
            </h1>
            <p className="text-gray-600 mt-1">Все ваши уведомления в одном месте</p>
          </div>

          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline" className="bg-white/80 backdrop-blur-sm border-2">
              <CheckCheck className="w-4 h-4 mr-2" />
              Прочитать все
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex space-x-2 mb-6">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className={
              filter === "all"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                : "bg-white/80 backdrop-blur-sm border-2"
            }
          >
            Все ({notifications.length})
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            onClick={() => setFilter("unread")}
            className={
              filter === "unread"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                : "bg-white/80 backdrop-blur-sm border-2"
            }
          >
            Непрочитанные ({unreadCount})
          </Button>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-lg shadow-lg border-0">
            <CardContent className="p-12 text-center">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {filter === "unread" ? "Нет непрочитанных уведомлений" : "Нет уведомлений"}
              </h3>
              <p className="text-gray-600">
                {filter === "unread" ? "Все уведомления прочитаны" : "Ваши уведомления будут появляться здесь"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`bg-white/80 backdrop-blur-lg shadow-lg border-0 hover:shadow-xl transition-all duration-300 cursor-pointer ${
                  !notification.is_read ? "ring-2 ring-blue-200" : ""
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className={`p-3 rounded-full ${getNotificationColor(notification.type)} flex-shrink-0 border`}>
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p
                            className={`text-sm ${
                              !notification.is_read ? "font-semibold text-gray-900" : "text-gray-700"
                            }`}
                          >
                            {notification.message}
                          </p>

                          {/* Sender Info */}
                          {notification.sender && (
                            <div className="flex items-center space-x-2 mt-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage
                                  src={
                                    notification.sender.avatar
                                      ? `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/storage/${
                                          notification.sender.avatar
                                        }`
                                      : undefined
                                  }
                                  alt={notification.sender.name}
                                />
                                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
                                  {notification.sender.name?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-gray-600">{notification.sender.name}</span>
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xs text-gray-500">
                              {new Date(notification.created_at).toLocaleString("ru-RU")}
                            </span>

                            {!notification.is_read && (
                              <Badge className="bg-blue-500 text-white border-0 text-xs">Новое</Badge>
                            )}
                          </div>
                        </div>

                        {/* Read Status */}
                        <div className="flex-shrink-0 ml-4">
                          {notification.is_read ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
