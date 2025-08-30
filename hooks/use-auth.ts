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
      // Проверяем, что мы на клиенте
      if (typeof window === 'undefined') return
      
      console.log('=== AUTH CHECK START ===')
      console.log('Checking auth on mount...')
      
      // Проверяем токен в localStorage напрямую
      const localStorageToken = localStorage.getItem('auth_token')
      console.log('Token from localStorage:', localStorageToken ? localStorageToken.substring(0, 20) + '...' : 'null')
      
      const token = apiClient.getToken()
      
      if (token) {
        try {
          console.log('Making request to get current user...')
          const response = await apiClient.getCurrentUser()
          console.log('Current user response:', response)
          
          if (response) {
            console.log('User data received:', response)
            setUser(response)
            // Сохраняем пользователя в localStorage
            localStorage.setItem('user', JSON.stringify(response))
            setIsAuthenticated(true)
            console.log('User authenticated successfully')
          } else {
            console.log('No user data in response')
            apiClient.clearToken()
            setUser(null)
            setIsAuthenticated(false)
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
      console.log('=== AUTH CHECK END ===')
    }

    checkAuth()
  }, [])

  const login = async (credentials: LoginForm) => {
    setIsLoading(true)
    try {
      console.log('=== LOGIN START ===')
      console.log('Attempting login with:', credentials)
      const response = await apiClient.login(credentials)
      console.log('Login response:', response)
      
              if (response?.access_token) {
          console.log('Access token found:', response.access_token)
          setIsAuthenticated(true)
          console.log('Login successful, token saved')
          
          // Если есть данные пользователя в ответе login, используем их
          if (response.user) {
            console.log('User data from login response:', response.user)
            setUser(response.user)
            // Сохраняем пользователя в localStorage
            localStorage.setItem('user', JSON.stringify(response.user))
            console.log('User saved to localStorage:', JSON.stringify(response.user))
            console.log('User state updated with login response data')
          } else {
            console.log('No user data in login response')
            // Если нет данных пользователя в ответе login, получаем их отдельно
            try {
              console.log('Getting user data from /user endpoint...')
              const userResponse = await apiClient.getCurrentUser()
              console.log('User response from /user endpoint:', userResponse)
              if (userResponse && typeof userResponse === 'object') {
                setUser(userResponse)
                // Сохраняем пользователя в localStorage
                localStorage.setItem('user', JSON.stringify(userResponse))
                console.log('User saved to localStorage from /user endpoint:', JSON.stringify(userResponse))
                console.log('User data from /user endpoint:', userResponse)
              }
            } catch (userError) {
              console.error('Failed to get user data:', userError)
            }
          }
        } else {
          console.log('No access_token in response')
        }
      
      console.log('=== LOGIN END ===')
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
      console.log('=== REGISTER START ===')
      console.log('Attempting registration with:', userData)
      
      const response = await apiClient.register(userData)
      console.log('Registration response:', response)
      
      // После успешной регистрации автоматически входим в систему
      if (response) {
        console.log('Registration successful, attempting auto-login...')
        try {
          const loginResponse = await apiClient.login({
            phone: userData.phone,
            password: userData.password
          })
          
          console.log('Auto-login response:', loginResponse)
          
          if (loginResponse?.access_token) {
            console.log('Auto-login successful, setting user data...')
            setIsAuthenticated(true)
            
            // Если есть данные пользователя в ответе login, используем их
            if (loginResponse.user) {
              console.log('User data from login response:', loginResponse.user)
              setUser(loginResponse.user)
              // Сохраняем пользователя в localStorage
              localStorage.setItem('user', JSON.stringify(loginResponse.user))
              console.log('User saved to localStorage:', JSON.stringify(loginResponse.user))
            } else {
              // Если нет данных пользователя в ответе login, получаем их отдельно
              try {
                console.log('Getting user data from /user endpoint...')
                const userResponse = await apiClient.getCurrentUser()
                console.log('User response from /user endpoint:', userResponse)
                if (userResponse && typeof userResponse === 'object') {
                  setUser(userResponse)
                  // Сохраняем пользователя в localStorage
                  localStorage.setItem('user', JSON.stringify(userResponse))
                  console.log('User saved to localStorage from /user endpoint:', JSON.stringify(userResponse))
                }
              } catch (userError) {
                console.error('Failed to get user data:', userError)
              }
            }
            
            // Принудительно обновляем состояние аутентификации
            setTimeout(() => {
              setIsAuthenticated(true)
              // Принудительно обновляем состояние несколько раз для надежности
              const updateInterval = setInterval(() => {
                setIsAuthenticated(true)
              }, 100)
              
              setTimeout(() => {
                clearInterval(updateInterval)
              }, 1000)
              
              // Уведомляем другие компоненты об изменении состояния
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('authStateChanged', { 
                  detail: { isAuthenticated: true, user: loginResponse.user || userResponse } 
                }))
              }
            }, 100)
          }
        } catch (loginError) {
          console.error("Auto-login after registration failed:", loginError)
          throw new Error("Регистрация прошла успешно, но не удалось войти в систему. Попробуйте войти вручную.")
        }
      }
      
      console.log('=== REGISTER END ===')
      return response
    } catch (error) {
      console.error('Registration error:', error)
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
