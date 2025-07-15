"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useSettings } from "@/hooks/use-settings"
import { Settings, Search, Save, Download, Upload, AlertCircle, CheckCircle } from "lucide-react"

interface Setting {
  id: number
  key: string
  value: string | null
  created_at: string
  updated_at: string
}

interface SettingConfig {
  key: string
  label: string
  description: string
  type: "text" | "number" | "boolean" | "select"
  options?: { value: string; label: string }[]
  category: string
  defaultValue?: string
}

const settingsConfig: SettingConfig[] = [
  // Общие настройки
  {
    key: "app_name",
    label: "Название приложения",
    description: "Отображается в заголовке и уведомлениях",
    type: "text",
    category: "general",
    defaultValue: "RideShare",
  },
  {
    key: "app_description",
    label: "Описание приложения",
    description: "Краткое описание сервиса",
    type: "text",
    category: "general",
    defaultValue: "Сервис совместных поездок",
  },
  {
    key: "max_passengers",
    label: "Максимум пассажиров",
    description: "Максимальное количество пассажиров в поездке",
    type: "number",
    category: "general",
    defaultValue: "4",
  },
  {
    key: "booking_advance_hours",
    label: "Заблаговременность бронирования (часы)",
    description: "За сколько часов можно бронировать поездку",
    type: "number",
    category: "general",
    defaultValue: "24",
  },

  // Уведомления
  {
    key: "notifications_enabled",
    label: "Включить уведомления",
    description: "Отправлять push-уведомления пользователям",
    type: "boolean",
    category: "notifications",
    defaultValue: "true",
  },
  {
    key: "email_notifications",
    label: "Email уведомления",
    description: "Отправлять уведомления на email",
    type: "boolean",
    category: "notifications",
    defaultValue: "true",
  },
  {
    key: "notification_sound",
    label: "Звук уведомлений",
    description: "Тип звука для уведомлений",
    type: "select",
    options: [
      { value: "default", label: "По умолчанию" },
      { value: "bell", label: "Колокольчик" },
      { value: "chime", label: "Звон" },
      { value: "none", label: "Без звука" },
    ],
    category: "notifications",
    defaultValue: "default",
  },

  // Платежи
  {
    key: "payment_enabled",
    label: "Включить платежи",
    description: "Разрешить денежные операции",
    type: "boolean",
    category: "payments",
    defaultValue: "true",
  },
  {
    key: "min_deposit",
    label: "Минимальная сумма пополнения",
    description: "Минимальная сумма для пополнения кошелька",
    type: "number",
    category: "payments",
    defaultValue: "100",
  },
  {
    key: "max_deposit",
    label: "Максимальная сумма пополнения",
    description: "Максимальная сумма для пополнения кошелька",
    type: "number",
    category: "payments",
    defaultValue: "50000",
  },
  {
    key: "commission_rate",
    label: "Комиссия сервиса (%)",
    description: "Процент комиссии с каждой поездки",
    type: "number",
    category: "payments",
    defaultValue: "5",
  },

  // Безопасность
  {
    key: "require_phone_verification",
    label: "Обязательная верификация телефона",
    description: "Требовать подтверждение номера телефона",
    type: "boolean",
    category: "security",
    defaultValue: "true",
  },
  {
    key: "auto_logout_minutes",
    label: "Автовыход (минуты)",
    description: "Время неактивности до автоматического выхода",
    type: "number",
    category: "security",
    defaultValue: "60",
  },
  {
    key: "password_min_length",
    label: "Минимальная длина пароля",
    description: "Минимальное количество символов в пароле",
    type: "number",
    category: "security",
    defaultValue: "6",
  },
]

const categories = [
  { id: "general", label: "Общие", color: "bg-blue-500" },
  { id: "notifications", label: "Уведомления", color: "bg-green-500" },
  { id: "payments", label: "Платежи", color: "bg-yellow-500" },
  { id: "security", label: "Безопасность", color: "bg-red-500" },
]

export default function SettingsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("general")
  const [settingsValues, setSettingsValues] = useState<Record<string, string>>({})
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [savedSettings, setSavedSettings] = useState<Set<string>>(new Set())

  const { settings, isLoading, fetchSettings, updateSetting, createSetting, deleteSetting } = useSettings()

  useEffect(() => {
    fetchSettings()
  }, [])

  useEffect(() => {
    // Инициализируем значения настроек
    const values: Record<string, string> = {}
    settingsConfig.forEach((config) => {
      const setting = settings.find((s) => s.key === config.key)
      values[config.key] = setting?.value || config.defaultValue || ""
    })
    setSettingsValues(values)
  }, [settings])

  const handleSettingChange = (key: string, value: string) => {
    setSettingsValues((prev) => ({
      ...prev,
      [key]: value,
    }))
    setHasUnsavedChanges(true)
    setSavedSettings((prev) => {
      const newSet = new Set(prev)
      newSet.delete(key)
      return newSet
    })
  }

  const handleSaveSetting = async (key: string) => {
    try {
      const existingSetting = settings.find((s) => s.key === key)
      if (existingSetting) {
        await updateSetting(key, settingsValues[key])
      } else {
        await createSetting(key, settingsValues[key])
      }
      setSavedSettings((prev) => new Set(prev).add(key))
      await fetchSettings()
    } catch (error) {
      console.error("Error saving setting:", error)
    }
  }

  const handleSaveAll = async () => {
    try {
      for (const config of settingsConfig) {
        const existingSetting = settings.find((s) => s.key === config.key)
        if (existingSetting) {
          await updateSetting(config.key, settingsValues[config.key])
        } else {
          await createSetting(config.key, settingsValues[config.key])
        }
      }
      setHasUnsavedChanges(false)
      setSavedSettings(new Set(settingsConfig.map((c) => c.key)))
      await fetchSettings()
    } catch (error) {
      console.error("Error saving settings:", error)
    }
  }

  const handleExportSettings = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      settings: settingsValues,
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `rideshare-settings-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (data.settings) {
          setSettingsValues(data.settings)
          setHasUnsavedChanges(true)
        }
      } catch (error) {
        console.error("Error importing settings:", error)
      }
    }
    reader.readAsText(file)
  }

  const filteredSettings = settingsConfig.filter((config) => {
    const matchesSearch =
      config.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      config.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "all" || config.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const renderSettingField = (config: SettingConfig) => {
    const value = settingsValues[config.key] || ""
    const isSaved = savedSettings.has(config.key)

    switch (config.type) {
      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={value === "true"}
              onCheckedChange={(checked) => handleSettingChange(config.key, checked.toString())}
            />
            <span className="text-sm text-gray-600">{value === "true" ? "Включено" : "Отключено"}</span>
          </div>
        )

      case "select":
        return (
          <Select value={value} onValueChange={(newValue) => handleSettingChange(config.key, newValue)}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите значение" />
            </SelectTrigger>
            <SelectContent>
              {config.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "number":
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleSettingChange(config.key, e.target.value)}
            className="max-w-xs"
          />
        )

      default:
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => handleSettingChange(config.key, e.target.value)}
            className="max-w-md"
          />
        )
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Настройки системы</h1>
              <p className="text-gray-600">Управление конфигурацией приложения</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {hasUnsavedChanges && (
              <Badge variant="destructive" className="flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>Есть несохраненные изменения</span>
              </Badge>
            )}

            <Button onClick={handleSaveAll} disabled={!hasUnsavedChanges} className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Сохранить все
            </Button>

            <Button variant="outline" onClick={handleExportSettings}>
              <Download className="w-4 h-4 mr-2" />
              Экспорт
            </Button>

            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImportSettings}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Импорт
              </Button>
            </div>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Поиск настроек..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${category.color}`}></div>
                <span>{category.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-4">
              {filteredSettings
                .filter((setting) => setting.category === category.id)
                .map((config) => {
                  const isSaved = savedSettings.has(config.key)
                  return (
                    <Card
                      key={config.key}
                      className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <CardTitle className="text-lg">{config.label}</CardTitle>
                            {isSaved && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Сохранено
                              </Badge>
                            )}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleSaveSetting(config.key)}
                            disabled={isSaved}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Save className="w-3 h-3 mr-1" />
                            Сохранить
                          </Button>
                        </div>
                        <CardDescription>{config.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Label htmlFor={config.key}>{config.label}</Label>
                          {renderSettingField(config)}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </TabsContent>
          ))}
        </Tabs>

        {filteredSettings.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
            <CardContent className="p-8 text-center">
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Настройки не найдены</h3>
              <p className="text-gray-600">Попробуйте изменить поисковый запрос или выбрать другую категорию</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
