"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { apiClient } from "@/lib/api"

export default function TestBookingApi() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testBookingFlow = async () => {
    setIsLoading(true)
    setTestResults([])
    
    try {
      addResult("Начинаем тест бронирования...")
      
      // 1. Получаем все поездки
      addResult("1. Получаем все поездки...")
      const tripsResponse = await apiClient.getAllTrips()
      addResult(`   Найдено поездок: ${tripsResponse.trips?.length || 0}`)
      
      if (!tripsResponse.trips || tripsResponse.trips.length === 0) {
        addResult("   ❌ Нет доступных поездок для тестирования")
        return
      }
      
      const trip = tripsResponse.trips[0]
      addResult(`   Выбрана поездка: ${trip.from_city} → ${trip.to_city} (ID: ${trip.id})`)
      
      // 2. Создаем бронирование
      addResult("2. Создаем бронирование...")
      const bookingData = { seats: 1 }
      const bookingResponse = await apiClient.createBooking(trip.id, bookingData)
      addResult(`   ✅ Бронирование создано (ID: ${bookingResponse.id})`)
      
      // 3. Получаем бронирования поездки
      addResult("3. Получаем бронирования поездки...")
      const tripBookingsResponse = await apiClient.getTripBookings(trip.id)
      addResult(`   Найдено бронирований: ${tripBookingsResponse?.length || 0}`)
      
      // 4. Получаем мои бронирования
      addResult("4. Получаем мои бронирования...")
      const myBookingsResponse = await apiClient.getMyBookings()
      addResult(`   Моих бронирований: ${myBookingsResponse?.length || 0}`)
      
      // 5. Обновляем статус бронирования (если это наша поездка)
      if (trip.user_id === bookingResponse.user_id) {
        addResult("5. Обновляем статус бронирования...")
        const updateResponse = await apiClient.updateBooking(bookingResponse.id, { status: 'approved' })
        addResult(`   ✅ Статус обновлен: ${updateResponse.status}`)
      } else {
        addResult("5. Пропускаем обновление статуса (не наша поездка)")
      }
      
      addResult("✅ Тест завершен успешно!")
      
    } catch (error: any) {
      addResult(`❌ Ошибка: ${error.message}`)
      console.error("Test error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Тест API бронирования</h3>
        
        <Button 
          onClick={testBookingFlow} 
          disabled={isLoading}
          className="w-full mb-4"
        >
          {isLoading ? "Тестирование..." : "Запустить тест"}
        </Button>
        
        <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
          <h4 className="font-medium mb-2">Результаты:</h4>
          {testResults.length === 0 ? (
            <p className="text-gray-500">Нажмите кнопку для запуска теста</p>
          ) : (
            <div className="space-y-1">
              {testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono">
                  {result}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 