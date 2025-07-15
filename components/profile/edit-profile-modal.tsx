"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Camera, X, Check } from "lucide-react"
import { useProfile } from "@/hooks/use-profile"

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: {
    id: number
    name: string
    phone: string
    avatar?: string
    role?: string
    balance: number
    rating: number
    rating_count: number
    created_at: string
  }
  onUpdate: () => void
}

export default function EditProfileModal({ isOpen, onClose, user, onUpdate }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: user.name,
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { updateProfile, isLoading } = useProfile()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        setErrors({ avatar: "Файл должен быть меньше 2MB" })
        return
      }

      if (!file.type.startsWith("image/")) {
        setErrors({ avatar: "Выберите изображение" })
        return
      }

      setSelectedFile(file)
      setErrors({})

      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Имя обязательно"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      if (selectedFile) {
        formDataToSend.append("avatar", selectedFile)
      }

      await updateProfile(formDataToSend)
      onUpdate()
      onClose()

      // Clean up preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }
      setSelectedFile(null)
    } catch (error: any) {
      setErrors({ general: error.message || "Ошибка обновления профиля" })
    }
  }

  const handleClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    setSelectedFile(null)
    setFormData({ name: user.name })
    setErrors({})
    onClose()
  }

  const currentAvatarUrl =
    previewUrl ||
    (user.avatar ? `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/storage/${user.avatar}` : null)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-lg border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">Редактировать профиль</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{errors.general}</div>
          )}

          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                <AvatarImage src={currentAvatarUrl || undefined} alt={user?.name ?? "User"} />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  {formData.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg transition-all duration-200"
              >
                <Camera className="w-4 h-4" />
              </button>

              {selectedFile && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null)
                    if (previewUrl) {
                      URL.revokeObjectURL(previewUrl)
                      setPreviewUrl(null)
                    }
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-all duration-200"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

            {selectedFile && (
              <p className="text-sm text-green-600 flex items-center">
                <Check className="w-4 h-4 mr-1" />
                Новое фото выбрано
              </p>
            )}

            {errors.avatar && <p className="text-red-500 text-sm">{errors.avatar}</p>}
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Полное имя
            </Label>
            <div className="relative">
              <Avatar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="name"
                type="text"
                placeholder="Введите ваше имя"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`pl-10 h-12 rounded-xl border-2 transition-all duration-200 ${
                  errors.name ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                }`}
              />
            </div>
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Phone (Read-only) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Номер телефона</Label>
            <div className="bg-gray-50 rounded-xl p-3 text-gray-600">{user.phone}</div>
            <p className="text-xs text-gray-500">Номер телефона нельзя изменить</p>
          </div>

          {/* Action Buttons */}
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
                  <span>Сохранение...</span>
                </div>
              ) : (
                "Сохранить"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
