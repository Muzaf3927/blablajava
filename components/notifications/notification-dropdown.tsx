"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Bell } from "lucide-react"
import { useNotifications } from "@/hooks/use-notifications"
import { useRouter } from "next/navigation"

export default function NotificationDropdown() {
  const { notifications, unreadCount, fetchNotifications, markAsRead } = useNotifications()
  const router = useRouter()

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const handleNotificationClick = async (notification: any) => {
    if (!notification.is_read) {
      await markAsRead(notification.id)
    }

    // Навигация в зависимости от типа уведомления
    if (notification.type === "booking") {
      router.push("/my-trips")
    } else if (notification.type === "trip") {
      router.push("/my-trips")
    } else if (notification.type === "message") {
      router.push("/chats")
    }
  }

  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
                <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount}
                </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="end">
          <div className="p-2">
            <h3 className="font-semibold mb-2">Уведомления</h3>
            {notifications.length === 0 ? (
                <p className="text-gray-500 text-sm py-4 text-center">Нет уведомлений</p>
            ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                      <DropdownMenuItem 
                        key={notification.id} 
                        className="flex-col items-start p-3 cursor-pointer"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex justify-between items-start w-full">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{notification.title}</p>
                            <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notification.created_at).toLocaleDateString("ru-RU")}
                            </p>
                          </div>
                          {!notification.is_read && <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 mt-1" />}
                        </div>
                      </DropdownMenuItem>
                  ))}
                </div>
            )}
            <div className="border-t pt-2 mt-2">
              <Button variant="ghost" size="sm" className="w-full">
                Посмотреть все
              </Button>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
  )
}
