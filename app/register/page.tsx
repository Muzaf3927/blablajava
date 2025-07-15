"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import LoginForm from "@/components/auth/login-form"
import RegisterForm from "@/components/auth/register-form"
import ResetPasswordForm from "@/components/auth/reset-password-form"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [currentForm, setCurrentForm] = useState<"login" | "register" | "reset">("register")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("auth_token")
      const userData = localStorage.getItem("user")

      if (token && userData) {
        setIsAuthenticated(true)
        // Если пользователь уже авторизован, перенаправляем на поездки
        router.push("/trips")
        return
      }
      setLoading(false)
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (isAuthenticated) {
    return null // Перенаправление уже происходит в useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">RideShare</h1>
          <p className="text-gray-300">Создайте новый аккаунт</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {currentForm === "login" && (
            <LoginForm
              onSwitchToRegister={() => setCurrentForm("register")}
              onSwitchToReset={() => setCurrentForm("reset")}
            />
          )}

          {currentForm === "register" && (
            <RegisterForm onSwitchToLogin={() => setCurrentForm("login")} />
          )}

          {currentForm === "reset" && (
            <ResetPasswordForm onSwitchToLogin={() => setCurrentForm("login")} />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-6"
        >
          <a
            href="/"
            className="text-gray-300 hover:text-white transition-colors"
          >
            ← Вернуться на главную
          </a>
        </motion.div>
      </div>
    </div>
  )
}
