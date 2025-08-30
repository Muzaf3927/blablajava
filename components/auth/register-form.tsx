"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Phone, Lock, Eye, EyeOff, UserPlus } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

interface RegisterFormProps {
  onSwitchToLogin: () => void
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    password_confirmation: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)

  const { register, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  // Автоматическое перенаправление после успешной регистрации
  useEffect(() => {
    if (success && typeof window !== 'undefined') {
      // Проверяем, есть ли токен в localStorage
      const token = localStorage.getItem('auth_token')
      const userData = localStorage.getItem('user')
      
      if (token && userData) {
        // Уведомляем другие компоненты об изменении состояния аутентификации
        window.dispatchEvent(new CustomEvent('authStateChanged', { 
          detail: { isAuthenticated: true, user: JSON.parse(userData) } 
        }))
        
        // Небольшая задержка для показа сообщения об успехе и обновления состояния
        const timer = setTimeout(() => {
          router.push('/trips')
          // Принудительно обновляем страницу через небольшую задержку для обновления навигации
          setTimeout(() => {
            window.location.reload()
          }, 100)
        }, 2000)
        
        return () => clearTimeout(timer)
      }
    }
  }, [success, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Валидация
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Введите имя"
    if (!formData.phone.trim()) newErrors.phone = "Введите номер телефона"
    if (!formData.password) newErrors.password = "Введите пароль"
    if (formData.password.length < 6) newErrors.password = "Пароль должен содержать минимум 6 символов"
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Пароли не совпадают"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await register(formData)
      setSuccess(true)
    } catch (error: any) {
      setErrors({ general: error.message || "Ошибка регистрации" })
    }
  }

  if (success) {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
            <CardContent className="text-center py-12">
              <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <UserPlus className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">Регистрация успешна!</h3>
              <p className="text-gray-300 mb-6">
                Вы автоматически вошли в систему. Перенаправление на страницу поездок...
              </p>
              <div className="flex items-center justify-center space-x-2">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                <span className="text-sm text-gray-300">Перенаправление...</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
    )
  }

  return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <CardTitle className="text-2xl font-bold text-white">Создать аккаунт</CardTitle>
              <CardDescription className="text-gray-300">Присоединяйтесь к нашему сообществу</CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6">
            {errors.general && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-200 text-sm backdrop-blur-sm"
                >
                  {errors.general}
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
              >
                <Label htmlFor="name" className="text-white">
                  Полное имя
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                      id="name"
                      type="text"
                      placeholder="Иван Иванов"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:ring-yellow-400/20 ${
                          errors.name ? "border-red-500 focus:border-red-500" : ""
                      }`}
                      autoComplete="name"
                  />
                </div>
                {errors.name && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm">
                      {errors.name}
                    </motion.p>
                )}
              </motion.div>

              <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
              >
                <Label htmlFor="phone" className="text-white">
                  Номер телефона
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                      id="phone"
                      type="tel"
                      placeholder="900018902"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:ring-yellow-400/20 ${
                          errors.phone ? "border-red-500 focus:border-red-500" : ""
                      }`}
                      autoComplete="tel"
                  />
                </div>
                {errors.phone && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm">
                      {errors.phone}
                    </motion.p>
                )}
              </motion.div>

              <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2"
              >
                <Label htmlFor="password" className="text-white">
                  Пароль
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Минимум 6 символов"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:ring-yellow-400/20 ${
                          errors.password ? "border-red-500 focus:border-red-500" : ""
                      }`}
                      autoComplete="new-password"
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm">
                      {errors.password}
                    </motion.p>
                )}
              </motion.div>

              <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-2"
              >
                <Label htmlFor="password_confirmation" className="text-white">
                  Подтвердите пароль
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                      id="password_confirmation"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Повторите пароль"
                      value={formData.password_confirmation}
                      onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                      className={`pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:ring-yellow-400/20 ${
                          errors.password_confirmation ? "border-red-500 focus:border-red-500" : ""
                      }`}
                      autoComplete="new-password"
                  />
                  <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password_confirmation && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm">
                      {errors.password_confirmation}
                    </motion.p>
                )}
              </motion.div>

              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}>
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Регистрация...</span>
                      </div>
                  ) : (
                      <div className="flex items-center space-x-2">
                        <UserPlus className="w-5 h-5" />
                        <span>Создать аккаунт</span>
                      </div>
                  )}
                </Button>
              </motion.div>
            </form>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center"
            >
              <p className="text-gray-300 text-sm">
                Уже есть аккаунт?{" "}
                <button
                    onClick={onSwitchToLogin}
                    className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
                >
                  Войти
                </button>
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
  )
}
