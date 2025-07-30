"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Wallet, 
  Calendar, 
  MessageCircle, 
  History, 
  TrendingUp,
  Car,
  Star,
  MapPin,
  Clock,
  Users,
  Plus
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useWallet } from "@/hooks/use-wallet"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const { user: currentUser } = useAuth()
  const { wallet, transactions } = useWallet()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const dashboardStats = [
    {
      title: "Баланс кошелька",
      value: `${wallet?.balance || 0} сум`,
      icon: Wallet,
      color: "bg-gradient-to-r from-green-500 to-emerald-600",
      textColor: "text-white",
      action: "Пополнить",
      href: "/wallet"
    },
    {
      title: "Активные брони",
      value: "3",
      icon: Calendar,
      color: "bg-gradient-to-r from-blue-500 to-purple-600",
      textColor: "text-white",
      action: "Посмотреть",
      href: "/bookings"
    },
    {
      title: "Новые сообщения",
      value: "5",
      icon: MessageCircle,
      color: "bg-gradient-to-r from-purple-500 to-pink-600",
      textColor: "text-white",
      action: "Открыть",
      href: "/chats"
    },
    {
      title: "Завершенные поездки",
      value: "12",
      icon: History,
      color: "bg-gradient-to-r from-orange-500 to-red-600",
      textColor: "text-white",
      action: "История",
      href: "/my-trips"
    }
  ]

  const recentTrips = [
    {
      id: 1,
      from: "Ташкент",
      to: "Самарканд",
      date: "2024-01-15",
      time: "08:00",
      price: 50000,
      status: "completed"
    },
    {
      id: 2,
      from: "Ташкент",
      to: "Бухара",
      date: "2024-01-20",
      time: "10:00",
      price: 75000,
      status: "active"
    }
  ]

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Загрузка...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Заголовок */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Добро пожаловать, {user.name}! 👋
        </h1>
        <p className="text-gray-600">
          Управляйте своими поездками, бронированиями и финансами
        </p>
      </motion.div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color} ${stat.textColor}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stat.action}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-2xl font-bold mb-1">{stat.value}</CardTitle>
                <CardDescription className="text-sm">{stat.title}</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Быстрые действия */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>Быстрые действия</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Car className="w-5 h-5 mr-2" />
                Создать поездку
              </Button>
              <Button variant="outline" className="h-16">
                <Calendar className="w-5 h-5 mr-2" />
                Найти поездку
              </Button>
              <Button variant="outline" className="h-16">
                <Wallet className="w-5 h-5 mr-2" />
                Пополнить баланс
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Недавние поездки */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-8"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History className="w-5 h-5 text-orange-600" />
              <span>Недавние поездки</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTrips.map((trip) => (
                <div key={trip.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <span className="font-medium">{trip.from}</span>
                    </div>
                    <div className="w-8 h-0.5 bg-gray-300"></div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-red-600" />
                      <span className="font-medium">{trip.to}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {new Date(trip.date).toLocaleDateString("ru-RU")} в {trip.time}
                        </span>
                      </div>
                      <div className="font-semibold text-green-600">{trip.price} сум</div>
                    </div>
                    <Badge 
                      variant={trip.status === "completed" ? "secondary" : "default"}
                      className={trip.status === "completed" ? "bg-green-100 text-green-800" : ""}
                    >
                      {trip.status === "completed" ? "Завершена" : "Активна"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Профиль пользователя */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-600" />
              <span>Ваш профиль</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl">
                  {user.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <p className="text-gray-600">{user.phone}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{user.rating || 0}</span>
                    <span className="text-sm text-gray-500">({user.rating_count || 0} отзывов)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Пользователь с {new Date(user.created_at).getFullYear()}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline">
                Редактировать профиль
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 