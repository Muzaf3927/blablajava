"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Users, DollarSign } from "lucide-react"

interface TripFiltersProps {
  onFilterChange: (filters: any) => void
}

export default function TripFilters({ onFilterChange }: TripFiltersProps) {
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    date: "",
    seats: "",
    maxPrice: "",
  })

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const emptyFilters = {
      from: "",
      to: "",
      date: "",
      seats: "",
      maxPrice: "",
    }
    setFilters(emptyFilters)
    onFilterChange(emptyFilters)
  }

  return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Фильтры поиска</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="from" className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Откуда</span>
            </Label>
            <Input
                id="from"
                placeholder="Город отправления"
                value={filters.from}
                onChange={(e) => handleFilterChange("from", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="to" className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Куда</span>
            </Label>
            <Input
                id="to"
                placeholder="Город назначения"
                value={filters.to}
                onChange={(e) => handleFilterChange("to", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Дата</span>
            </Label>
            <Input
                id="date"
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange("date", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seats" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Количество мест</span>
            </Label>
            <Input
                id="seats"
                type="number"
                placeholder="1"
                min="1"
                max="8"
                value={filters.seats}
                onChange={(e) => handleFilterChange("seats", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxPrice" className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span>Максимальная цена</span>
            </Label>
            <Input
                id="maxPrice"
                type="number"
                placeholder="5000"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            />
          </div>

          <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
            Очистить фильтры
          </Button>
        </CardContent>
      </Card>
  )
}
