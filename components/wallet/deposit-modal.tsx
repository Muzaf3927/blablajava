"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreditCard, Wallet, CheckCircle } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function DepositModal({ isOpen, onClose, onSuccess }: DepositModalProps) {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)

  const { deposit, isLoading } = useWallet()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.amount) newErrors.amount = "Сумма обязательна"
    else if (Number.parseFloat(formData.amount) < 0.01) newErrors.amount = "Минимальная сумма 0.01 ₽"
    else if (Number.parseFloat(formData.amount) > 100000) newErrors.amount = "Максимальная сумма 100,000 ₽"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await deposit(Number.parseFloat(formData.amount), formData.description)
      setSuccess(true)
      setTimeout(() => {
        handleClose()
        onSuccess()
      }, 2000)
    } catch (error: any) {
      setErrors({ general: error.message || "Ошибка пополнения баланса" })
    }
  }

  const handleClose = () => {
    setFormData({ amount: "", description: "" })
    setErrors({})
    setSuccess(false)
    onClose()
  }

  const quickAmounts = [100, 500, 1000, 2000, 5000]

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-lg border-0 shadow-2xl">
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Баланс пополнен!</h2>
              <p className="text-gray-600 mt-2">
                Ваш баланс успешно пополнен на {Number.parseFloat(formData.amount).toLocaleString("ru-RU")} ₽
              </p>
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
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center">
            <Wallet className="w-6 h-6 mr-2 text-blue-600" />
            Пополнить баланс
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{errors.general}</div>
          )}

          {/* Amount Input */}
          <div className="space-y-3">
            <Label htmlFor="amount" className="text-lg font-semibold text-gray-900">
              Сумма пополнения
            </Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                min="0.01"
                max="100000"
                step="0.01"
                placeholder="Введите сумму"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className={`h-14 text-lg rounded-xl border-2 pr-12 transition-all duration-200 ${
                  errors.amount ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                }`}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₽</div>
            </div>
            {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-5 gap-2">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData({ ...formData, amount: amount.toString() })}
                  className="bg-transparent border-2 hover:bg-blue-50 hover:border-blue-300"
                >
                  {amount}
                </Button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Комментарий (необязательно)
            </Label>
            <Textarea
              id="description"
              placeholder="Например: Пополнение для поездки"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-all duration-200 resize-none"
              rows={3}
              maxLength={255}
            />
          </div>

          {/* Payment Method Info */}
          <div className="bg-blue-50 rounded-xl p-4 space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <CreditCard className="w-4 h-4 text-blue-500" />
              <span className="font-medium text-blue-700">Способ оплаты</span>
            </div>
            <div className="text-sm text-blue-600">
              Пополнение происходит мгновенно. Поддерживаются все банковские карты.
            </div>
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
              disabled={isLoading || !formData.amount}
              className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Пополнение...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Пополнить баланс</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
