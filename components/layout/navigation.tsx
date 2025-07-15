"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import NotificationDropdown from "@/components/notifications/notification-dropdown"
import { useAuth } from "@/hooks/use-auth"
import { Car, Calendar, MessageCircle, Wallet, Star, Settings, User, LogOut, Menu, X } from "lucide-react"

export default function Navigation() {
  const [user, setUser] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const navItems = [
    { href: "/trips", label: "Поездки", icon: Car },
    { href: "/my-trips", label: "Мои поездки", icon: Calendar },
    { href: "/bookings", label: "Бронирования", icon: Calendar },
    { href: "/chats", label: "Сообщения", icon: MessageCircle },
    { href: "/wallet", label: "Кошелек", icon: Wallet },
    { href: "/ratings", label: "Отзывы", icon: Star },
  ]

  if (!user) {
    return null
  }

  return (
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Логотип */}
            <div className="flex items-center space-x-4">
              <a href="/trips" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">RideShare</span>
              </a>
            </div>

            {/* Навигация для десктопа */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                  <a
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </a>
              ))}
            </div>

            {/* Правая часть */}
            <div className="flex items-center space-x-4">
              {/* Уведомления */}
              <NotificationDropdown />

              {/* Профиль */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.phone}</p>
                      <div className="flex items-center space-x-2">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs">{user.rating || 0}</span>
                        <Badge variant="secondary" className="text-xs">
                          {user.balance || 0} ₽
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <a href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Профиль</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Настройки</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Выйти</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Мобильное меню */}
              <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Мобильная навигация */}
          {mobileMenuOpen && (
              <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="md:hidden border-t py-4"
              >
                <div className="space-y-2">
                  {navItems.map((item) => (
                      <a
                          key={item.href}
                          href={item.href}
                          className="flex items-center space-x-3 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </a>
                  ))}
                </div>
              </motion.div>
          )}
        </div>
      </nav>
  )
}
