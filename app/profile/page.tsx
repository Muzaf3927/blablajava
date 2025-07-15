"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Phone, Star, Wallet, Edit3, Camera, Shield, Calendar, Settings } from "lucide-react"
import EditProfileModal from "@/components/profile/edit-profile-modal"
import ChangePasswordModal from "@/components/profile/change-password-modal"
import { useProfile } from "@/hooks/use-profile"

export default function ProfilePage() {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const { user, loading, fetchUser } = useProfile()

  useEffect(() => {
    fetchUser()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Пользователь не найден</h2>
          <p className="text-gray-600">Попробуйте войти в систему заново</p>
        </div>
      </div>
    )
  }

  const getRoleColor = (role?: string) => {
    switch (role) {
      case "driver":
        return "bg-blue-100 text-blue-800"
      case "passenger":
        return "bg-green-100 text-green-800"
      case "admin":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleText = (role?: string) => {
    switch (role) {
      case "driver":
        return "Водитель"
      case "passenger":
        return "Пассажир"
      case "admin":
        return "Администратор"
      default:
        return "Пользователь"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Мой профиль
            </h1>
            <p className="text-gray-600 mt-1">Управляйте своей учетной записью</p>
          </div>
          <Button
            onClick={() => setShowEditModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Редактировать
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-lg shadow-xl border-0 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-24"></div>
              <CardContent className="relative pt-0 pb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 -mt-12">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                      <AvatarImage
                        src={
                          user.avatar
                            ? `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/storage/${user.avatar}`
                            : undefined
                        }
                        alt={user.name}
                      />
                      <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-gray-100"
                    >
                      <Camera className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                      {user.role && (
                        <Badge className={`${getRoleColor(user.role)} border-0`}>
                          <Shield className="w-3 h-3 mr-1" />
                          {getRoleText(user.role)}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{user.phone}</span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Регистрация: {new Date(user.created_at).toLocaleDateString("ru-RU")}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Cards */}
          <div className="space-y-6">
            {/* Rating Card */}
            <Card className="bg-white/80 backdrop-blur-lg shadow-xl border-0">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Рейтинг
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{user.rating.toFixed(1)}</div>
                  <div className="flex items-center justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(user.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    {user.rating_count} {user.rating_count === 1 ? "отзыв" : "отзывов"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Balance Card */}
            <Card className="bg-white/80 backdrop-blur-lg shadow-xl border-0">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Wallet className="w-5 h-5 mr-2 text-green-500" />
                  Баланс
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{user.balance.toLocaleString("ru-RU")} ₽</div>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3 border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
                      onClick={() => (window.location.href = "/wallet")}
                    >
                      Управление кошельком
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Settings Card */}
            <Card className="bg-white/80 backdrop-blur-lg shadow-xl border-0">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Settings className="w-5 h-5 mr-2 text-gray-500" />
                  Настройки
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left"
                  onClick={() => setShowPasswordModal(true)}
                >
                  Сменить пароль
                </Button>
                <Button variant="ghost" className="w-full justify-start text-left">
                  Уведомления
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Удалить аккаунт
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modals */}
        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          user={user}
          onUpdate={fetchUser}
        />

        <ChangePasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
      </div>
    </div>
  )
}
