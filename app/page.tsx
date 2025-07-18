"use client"

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"
import LoginForm from "@/components/auth/login-form"
import RegisterForm from "@/components/auth/register-form"
import ResetPasswordForm from "@/components/auth/reset-password-form"
import { Car, Users, Shield, Star, ArrowRight, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function HomePage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <HomePageContent />
    </Suspense>
  );
}

function HomePageContent() {
  const searchParams = useSearchParams()
  const [currentForm, setCurrentForm] = useState<"login" | "register" | "reset">("login")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("auth_token")
      const userData = localStorage.getItem("user")

      console.log('=== HOME PAGE: Auth check ===')
      console.log('Token exists:', !!token)
      console.log('User data exists:', !!userData)
      console.log('Token value:', token ? token.substring(0, 20) + '...' : 'null')

      if (token && userData) {
        setIsAuthenticated(true)
        console.log('=== HOME PAGE: User authenticated ===')
      } else {
        console.log('=== HOME PAGE: User not authenticated ===')
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  // Обрабатываем query-параметры для показа нужной формы
  useEffect(() => {
    const formParam = searchParams.get("form")
    if (formParam === "login") {
      setCurrentForm("login")
    } else if (formParam === "register") {
      setCurrentForm("register")
    } else if (formParam === "reset") {
      setCurrentForm("reset")
    }
  }, [searchParams])

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

  const features = [
    {
      icon: Car,
      title: "Быстрые поездки",
      description: "Найдите попутчиков за считанные минуты",
    },
    {
      icon: Users,
      title: "Надежные водители",
      description: "Проверенные пользователи с рейтингами",
    },
    {
      icon: Shield,
      title: "Безопасность",
      description: "Защищенные платежи и данные",
    },
    {
      icon: Star,
      title: "Высокие оценки",
      description: "Система рейтингов и отзывов",
    },
  ]

  return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Анимированный фон */}
        <div className="absolute inset-0">
          <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
          />
          <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 25,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Навигация */}
          {isAuthenticated && (
              <div className="absolute top-4 right-4">
                <motion.a
                    href="/trips"
                    className="bg-white/10 backdrop-blur-lg border border-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                >
                  Перейти к поездкам
                </motion.a>
              </div>
          )}

          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
            {/* Левая сторона - Информация */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-white space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center space-x-2"
                >
                  <Sparkles className="w-8 h-8 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold">RideShare</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl lg:text-6xl font-bold leading-tight"
                >
                  Путешествуйте
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  {" "}
                    вместе
                </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-gray-300 leading-relaxed"
                >
                  Современная платформа для поиска попутчиков. Экономьте деньги, находите новых друзей и путешествуйте
                  комфортно.
                </motion.p>
              </div>

              {/* Особенности */}
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-2 gap-6"
              >
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300"
                    >
                      <feature.icon className="w-8 h-8 text-yellow-400 mb-2" />
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-300">{feature.description}</p>
                    </motion.div>
                ))}
              </motion.div>

              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center space-x-2 text-gray-300"
              >
                <span>Присоединяйтесь к тысячам довольных пользователей</span>
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.div>

            {/* Правая сторона - Формы */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex justify-center"
            >
              <div className="w-full max-w-md">
                <AnimatePresence mode="wait">
                  {currentForm === "login" && (
                      <motion.div
                          key="login"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                      >
                        <LoginForm
                            onSwitchToRegister={() => setCurrentForm("register")}
                            onSwitchToReset={() => setCurrentForm("reset")}
                        />
                      </motion.div>
                  )}

                  {currentForm === "register" && (
                      <motion.div
                          key="register"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                      >
                        <RegisterForm onSwitchToLogin={() => setCurrentForm("login")} />
                      </motion.div>
                  )}

                  {currentForm === "reset" && (
                      <motion.div
                          key="reset"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                      >
                        <ResetPasswordForm onSwitchToLogin={() => setCurrentForm("login")} />
                      </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
  )
}
