"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useTrips } from "@/hooks/use-trips"
import { TripForm } from "@/lib/types"

interface CreateTripModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateTripModal({ isOpen, onClose }: CreateTripModalProps) {
  const [formData, setFormData] = useState<TripForm>({
    from_city: "",
    to_city: "",
    date: "",
    time: "",
    price: null,
    seats: 1,
    note: "",
    carModel: "",
    carColor: "",
    numberCar: "",
  })

  const { createTrip, isLoading } = useTrips()

  const handlePriceChange = (value: number | null) => {
    setFormData({ ...formData, price: value })
  }

  const increasePrice = () => {
    const currentPrice = formData.price || 0
    handlePriceChange(currentPrice + 5000)
  }

  const decreasePrice = () => {
    const currentPrice = formData.price || 0
    if (currentPrice >= 5000) {
      handlePriceChange(currentPrice - 5000)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await createTrip(formData)
      onClose()
      // Сбросить форму
      setFormData({
        from_city: "",
        to_city: "",
        date: "",
        time: "",
        price: null,
        seats: 1,
        note: "",
        carModel: "",
        carColor: "",
        numberCar: "",
      })
    } catch (error) {
      console.error("Failed to create trip:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Создать поездку</DialogTitle>
          <DialogDescription>
            Заполните информацию о поездке. Все поля обязательны для заполнения.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="from_city" className="text-right">
                Откуда
              </Label>
              <Input
                id="from_city"
                value={formData.from_city}
                onChange={(e) => setFormData({ ...formData, from_city: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="to_city" className="text-right">
                Куда
              </Label>
              <Input
                id="to_city"
                value={formData.to_city}
                onChange={(e) => setFormData({ ...formData, to_city: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Дата
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Время
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Цена (сум)
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={decreasePrice}
                  className="px-2"
                >
                  -
                </Button>
                <Input
                  id="price"
                  type="number"
                  value={formData.price || ""}
                  onChange={(e) => handlePriceChange(Number(e.target.value) || null)}
                  className="flex-1"
                  min="0"
                  step="5000"
                  placeholder="Введите цену"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={increasePrice}
                  className="px-2"
                >
                  +
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="seats" className="text-right">
                Мест
              </Label>
              <Input
                id="seats"
                type="number"
                value={formData.seats}
                onChange={(e) => setFormData({ ...formData, seats: Number(e.target.value) })}
                className="col-span-3"
                min="1"
                max="7"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="note" className="text-right">
                Примечание
              </Label>
              <Textarea
                id="note"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="col-span-3"
                placeholder="Дополнительная информация о поездке"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="carModel" className="text-right">
                Модель авто
              </Label>
              <Input
                id="carModel"
                value={formData.carModel}
                onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
                className="col-span-3"
                placeholder="Например: Toyota Camry"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="carColor" className="text-right">
                Цвет авто
              </Label>
              <Input
                id="carColor"
                value={formData.carColor}
                onChange={(e) => setFormData({ ...formData, carColor: e.target.value })}
                className="col-span-3"
                placeholder="Например: Белый"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="numberCar" className="text-right">
                Номер авто
              </Label>
              <Input
                id="numberCar"
                value={formData.numberCar}
                onChange={(e) => setFormData({ ...formData, numberCar: e.target.value })}
                className="col-span-3"
                placeholder="Например: 01A777BB"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Создание..." : "Создать поездку"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
