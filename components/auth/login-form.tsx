"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Lock, Eye, EyeOff, LogIn } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface LoginFormProps {
  onSwitchToRegister: () => void
  onSwitchToReset: () => void
}

export default function LoginForm({ onSwitchToRegister, onSwitchToReset }: LoginFormProps) {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  const { login, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Валидация
    const newErrors: Record<string, string> = {}
    if (!formData.phone.trim()) newErrors.phone = "Введите номер телефона"
    if (!formData.password) newErrors.password = "Введите пароль"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      const response = await login(formData)
      console.log('Login successful, response:', response)
      
      // Проверяем что пользователь действительно аутентифицирован
      if (response.data?.access_token) {
        console.log('Login successful, redirecting to /trips')
        // Используем Next.js router для редиректа
        router.push("/trips")
      } else {
        console.log('No access_token in response')
        setErrors({ general: "Ошибка получения токена доступа" })
      }
    } catch (error: any) {
      console.error('Login failed:', error)
      setErrors({ general: error.message || "Ошибка входа" })
    }
  }

  return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <CardTitle className="text-2xl font-bold text-white">Добро пожаловать!</CardTitle>
              <CardDescription className="text-gray-300">Войдите в свой аккаунт для продолжения</CardDescription>
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
                  transition={{ delay: 0.4 }}
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
                      placeholder="Введите пароль"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:ring-yellow-400/20 ${
                          errors.password ? "border-red-500 focus:border-red-500" : ""
                      }`}
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

              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
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
                        <span>Вход...</span>
                      </div>
                  ) : (
                      <div className="flex items-center space-x-2">
                        <LogIn className="w-5 h-5" />
                        <span>Войти</span>
                      </div>
                  )}
                </Button>
              </motion.div>
            </form>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-4 text-center"
            >
              <div className="flex items-center space-x-2">
                <div className="flex-1 h-px bg-white/20"></div>
                <span className="text-gray-400 text-sm">или</span>
                <div className="flex-1 h-px bg-white/20"></div>
              </div>

              <p className="text-gray-300 text-sm">
                Нет аккаунта?{" "}
                <button
                    onClick={onSwitchToRegister}
                    className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
                >
                  Зарегистрироваться
                </button>
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
  )
}
