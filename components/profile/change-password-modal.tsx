"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [formData, setFormData] = useState({
    password: "",
    new_password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)

  const { changePassword, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.password) newErrors.password = "Текущий пароль обязателен"
    if (!formData.new_password) newErrors.new_password = "Новый пароль обязателен"
    else if (formData.new_password.length < 6) newErrors.new_password = "Пароль должен содержать минимум 6 символов"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await changePassword(formData.password, formData.new_password)
      setSuccess(true)
      setTimeout(() => {
        handleClose()
      }, 2000)
    } catch (error: any) {
      setErrors({ general: error.message || "Ошибка смены пароля" })
    }
  }

  const handleClose = () => {
    setFormData({ password: "", new_password: "" })
    setErrors({})
    setSuccess(false)
    onClose()
  }

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-lg border-0 shadow-2xl">
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Пароль изменен!</h2>
              <p className="text-gray-600 mt-2">Ваш пароль успешно обновлен</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-lg border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">Сменить пароль</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{errors.general}</div>
          )}

          <div className="space-y-2">
            <Label htmlFor="current_password" className="text-sm font-medium text-gray-700">
              Текущий пароль
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="current_password"
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Введите текущий пароль"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`pl-10 pr-10 h-12 rounded-xl border-2 transition-all duration-200 ${
                  errors.password ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="new_password" className="text-sm font-medium text-gray-700">
              Новый пароль
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="new_password"
                type={showNewPassword ? "text" : "password"}
                placeholder="Введите новый пароль"
                value={formData.new_password}
                onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                className={`pl-10 pr-10 h-12 rounded-xl border-2 transition-all duration-200 ${
                  errors.new_password ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.new_password && <p className="text-red-500 text-sm">{errors.new_password}</p>}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 h-12 rounded-xl border-2 bg-transparent"
              disabled={isLoading}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Изменение...</span>
                </div>
              ) : (
                "Изменить пароль"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
