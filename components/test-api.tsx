"use client"

import { useState } from "react"
import { apiClient } from "@/lib/api"
import { LoginForm, RegisterForm, TripForm } from "@/lib/types"

export function TestApi() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    setLoading(true)
    try {
      const loginData: LoginForm = {
        phone: "123456789",
        password: "password123"
      }
      const response = await apiClient.login(loginData)
      setResult(response)
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setLoading(false)
    }
  }

  const testRegister = async () => {
    setLoading(true)
    try {
      const registerData: RegisterForm = {
        name: "Test User",
        phone: "987654321",
        password: "password123",
        password_confirmation: "password123"
      }
      const response = await apiClient.register(registerData)
      setResult(response)
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setLoading(false)
    }
  }

  const testGetTrips = async () => {
    setLoading(true)
    try {
      const response = await apiClient.getAllTrips()
      setResult(response)
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setLoading(false)
    }
  }

  const testCreateTrip = async () => {
    setLoading(true)
    try {
      const tripData: TripForm = {
        from_city: "Ташкент",
        to_city: "Самарканд",
        date: "2024-12-25",
        time: "10:00",
        price: 50000,
        seats: 4,
        note: "Тестовая поездка"
      }
      const response = await apiClient.createTrip(tripData)
      setResult(response)
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">API Test</h2>
      
      <div className="space-x-2">
        <button 
          onClick={testLogin}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Test Login
        </button>
        
        <button 
          onClick={testRegister}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          Test Register
        </button>
        
        <button 
          onClick={testGetTrips}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50"
        >
          Test Get Trips
        </button>
        
        <button 
          onClick={testCreateTrip}
          disabled={loading}
          className="px-4 py-2 bg-orange-500 text-white rounded disabled:opacity-50"
        >
          Test Create Trip
        </button>
      </div>

      {loading && <div>Loading...</div>}
      
      {result && (
        <div className="mt-4">
          <h3 className="font-semibold">Result:</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
} 