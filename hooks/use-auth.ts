"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"
import { User, AuthResponse, LoginForm, RegisterForm } from "@/lib/types"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Проверяем токен при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      console.log('Checking auth on mount...')
      const token = apiClient.getToken()
      console.log('Token found:', !!token)
      
      if (token) {
        try {
          const response = await apiClient.getCurrentUser()
          console.log('Current user response:', response)
          
          if (response.data) {
            setUser(response.data)
            setIsAuthenticated(true)
            console.log('User authenticated:', response.data)
          }
        } catch (error) {
          console.error("Auth check failed:", error)
          apiClient.clearToken()
          setUser(null)
          setIsAuthenticated(false)
        }
      } else {
        console.log('No token found, user not authenticated')
        setUser(null)
        setIsAuthenticated(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials: LoginForm) => {
    setIsLoading(true)
    try {
      console.log('Attempting login with:', credentials)
      const response = await apiClient.login(credentials)
      console.log('Login response:', response)
      
      if (response.data?.access_token) {
        setIsAuthenticated(true)
        console.log('Login successful, token saved')
        
        // Если есть данные пользователя в ответе login, используем их
        if (response.data.user) {
          setUser(response.data.user)
          console.log('User data from login response:', response.data.user)
        } else {
          // Если нет данных пользователя в ответе login, получаем их отдельно
          try {
            console.log('Getting user data from /user endpoint...')
            const userResponse = await apiClient.getCurrentUser()
                         if (userResponse.data && typeof userResponse.data === 'object') {
               setUser(userResponse.data)
               console.log('User data from /user endpoint:', userResponse.data)
             }
          } catch (userError) {
            console.error('Failed to get user data:', userError)
          }
        }
      }
      
      return response
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterForm) => {
    setIsLoading(true)
    try {
      const response = await apiClient.register(userData)
      
      // После регистрации нужно войти в систему
      if (response.data) {
        // Попробуем автоматически войти после регистрации
        try {
          const loginResponse = await apiClient.login({
            phone: userData.phone,
            password: userData.password
          })
                  if (loginResponse.data?.user) {
          setUser(loginResponse.data.user)
          setIsAuthenticated(true)
        }
        } catch (loginError) {
          console.error("Auto-login after registration failed:", loginError)
        }
      }
      
      return response
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await apiClient.logout()
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error("Logout error:", error)
      // Даже если запрос не прошел, очищаем локальное состояние
      apiClient.clearToken()
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (userData: Partial<User>) => {
    setIsLoading(true)
    try {
      const response = await apiClient.updateUser(userData)
      if (response.data) {
        setUser(response.data)
      }
      return response
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const changePassword = async (passwordData: {
    password: string
    new_password: string
  }) => {
    setIsLoading(true)
    try {
      return await apiClient.changePassword(passwordData)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isLoading,
  }
}
