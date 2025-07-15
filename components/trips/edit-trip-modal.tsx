"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MapPin, Calendar, Clock, Users, DollarSign, Car } from "lucide-react"
import { useTrips } from "@/hooks/use-trips"

interface EditTripModalProps {
  isOpen: boolean
  trip: any
  onClose: () => void
  onSuccess: () => void
}

export default function EditTripModal({ isOpen, trip, onClose, onSuccess }: EditTripModalProps) {
  const [formData, setFormData] = useState({
    from_city: "",
    to_city: "",
    date: "",
    time: "",
    seats: "",
    price: "",
    note: "",
    carModel: "",
    carColor: "",
    numberCar: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { updateTrip, isLoading } = useTrips()

  useEffect(() => {
    if (trip) {
      setFormData({
        from_city: trip.from_city || "",
        to_city: trip.to_city || "",
        date: trip.date || "",
        time: trip.time || "",
        seats: trip.seats?.toString() || "",
        price: trip.price?.toString() || "",
        note: trip.note || "",
        carModel: trip.carModel || "",
        carColor: trip.carColor || "",
        numberCar: trip.numberCar || "",
      })
    }
  }, [trip])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.from_city) newErrors.from_city = "Город отправления обязателен"
    if (!formData.to_city) newErrors.to_city = "Город назначения обязателен"
    if (!formData.date) newErrors.date = "Дата обязательна"
    if (!formData.time) newErrors.time = "Время обязательно"
    if (!formData.seats) newErrors.seats = "Количество мест обязательно"
    else if (Number(formData.seats) < 1 || Number(formData.seats) > 8) {
      newErrors.seats = "Количество мест должно быть от 1 до 8"
    }
    if (!formData.price) newErrors.price = "Цена обязательна"
    else if (Number(formData.price) < 1) newErrors.price = "Цена должна быть больше 0"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await updateTrip(trip.id, {
        from_city: formData.from_city,
        to_city: formData.to_city,
        date: formData.date,
        time: formData.time,
        seats: Number(formData.seats),
        price: Number(formData.price),
        note: formData.note || undefined,
        carModel: formData.carModel || undefined,
        carColor: formData.carColor || undefined,
        numberCar: formData.numberCar || undefined,
      })
      onSuccess()
    } catch (error: any) {
      setErrors({ general: error.message || "Ошибка обновления поездки" })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white/95 backdrop-blur-lg border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Редактировать поездку
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{errors.general}</div>
          )}

          {/* Route */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from_city" className="text-sm font-medium text-gray-700">
                Откуда
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="from_city"
                  placeholder="Город отправления"
                  value={formData.from_city}
                  onChange={(e) => setFormData({ ...formData, from_city: e.target.value })}
                  className={`pl-10 ${errors.from_city ? "border-red-300" : ""}`}
                />
              </div>
              {errors.from_city && <p className="text-red-500 text-sm">{errors.from_city}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="to_city" className="text-sm font-medium text-gray-700">
                Куда
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="to_city"
                  placeholder="Город назначения"
                  value={formData.to_city}
                  onChange={(e) => setFormData({ ...formData, to_city: e.target.value })}
                  className={`pl-10 ${errors.to_city ? "border-red-300" : ""}`}
                />
              </div>
              {errors.to_city && <p className="text-red-500 text-sm">{errors.to_city}</p>}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                Дата
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={`pl-10 ${errors.date ? "border-red-300" : ""}`}
                />
              </div>
              {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-medium text-gray-700">
                Время
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className={`pl-10 ${errors.time ? "border-red-300" : ""}`}
                />
              </div>
              {errors.time && <p className="text-red-500 text-sm">{errors.time}</p>}
            </div>
          </div>

          {/* Seats & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="seats" className="text-sm font-medium text-gray-700">
                Количество мест
              </Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="seats"
                  type="number"
                  min="1"
                  max="8"
                  placeholder="1-8 мест"
                  value={formData.seats}
                  onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                  className={`pl-10 ${errors.seats ? "border-red-300" : ""}`}
                />
              </div>
              {errors.seats && <p className="text-red-500 text-sm">{errors.seats}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                Цена за место (₽)
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="price"
                  type="number"
                  min="1"
                  placeholder="Цена в рублях"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className={`pl-10 ${errors.price ? "border-red-300" : ""}`}
                />
              </div>
              {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
            </div>
          </div>

          {/* Car Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Информация об автомобиле</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="carModel" className="text-sm font-medium text-gray-700">
                  Модель
                </Label>
                <div className="relative">
                  <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="carModel"
                    placeholder="Toyota Camry"
                    value={formData.carModel}
                    onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="carColor" className="text-sm font-medium text-gray-700">
                  Цвет
                </Label>
                <Input
                  id="carColor"
                  placeholder="Белый"
                  value={formData.carColor}
                  onChange={(e) => setFormData({ ...formData, carColor: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numberCar" className="text-sm font-medium text-gray-700">
                  Номер
                </Label>
                <Input
                  id="numberCar"
                  placeholder="А123БВ77"
                  value={formData.numberCar}
                  onChange={(e) => setFormData({ ...formData, numberCar: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="note" className="text-sm font-medium text-gray-700">
              Дополнительная информация
            </Label>
            <Textarea
              id="note"
              placeholder="Укажите особенности поездки, требования к пассажирам и т.д."
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-white/80 backdrop-blur-lg border-gray-200"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {isLoading ? "Сохранение..." : "Сохранить изменения"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
