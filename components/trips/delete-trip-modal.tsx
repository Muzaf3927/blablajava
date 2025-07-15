"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { AlertTriangle } from "lucide-react"
import { useTrips } from "@/hooks/use-trips"

interface DeleteTripModalProps {
  isOpen: boolean
  trip: any
  onClose: () => void
  onSuccess: () => void
}

export default function DeleteTripModal({ isOpen, trip, onClose, onSuccess }: DeleteTripModalProps) {
  const { deleteTrip, isLoading } = useTrips()

  const handleDelete = async () => {
    try {
      await deleteTrip(trip.id)
      onSuccess()
    } catch (error) {
      console.error("Error deleting trip:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] bg-white/95 backdrop-blur-lg border-0 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">Удалить поездку</DialogTitle>
              <DialogDescription className="text-gray-600 mt-1">Это действие нельзя отменить</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-2">Поездка:</div>
            <div className="font-medium text-gray-900">
              {trip?.from_city} → {trip?.to_city}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {new Date(trip?.date).toLocaleDateString("ru-RU")} в {trip?.time}
            </div>
          </div>

          <p className="text-gray-700">
            Вы уверены, что хотите удалить эту поездку? Все связанные бронирования также будут отменены.
          </p>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-white/80 backdrop-blur-lg border-gray-200"
              disabled={isLoading}
            >
              Отмена
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isLoading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? "Удаление..." : "Удалить поездку"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
