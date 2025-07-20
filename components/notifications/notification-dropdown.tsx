"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Bell } from "lucide-react"

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Демо уведомления
    setNotifications([
      {
        id: 1,
        title: "Новое бронирование",
        message: "Пользователь забронировал место в вашей поездке",
        read: false,
        created_at: "2024-01-15T10:00:00Z",
      },
      {
        id: 2,
        title: "Подтверждение поездки",
        message: "Ваша поездка была подтверждена",
        read: true,
        created_at: "2024-01-14T15:30:00Z",
      },
    ])
    setUnreadCount(1)
  }, [])

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
                        className="flex-col items-start p-3"
                      >
                        <div className="flex justify-between items-start w-full">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{notification.title}</p>
                            <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notification.created_at).toLocaleDateString("ru-RU")}
                            </p>
                          </div>
                          {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 mt-1" />}
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
