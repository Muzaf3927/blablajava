"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, MessageSquare, TrendingUp, Filter, Calendar } from "lucide-react"
import { useRatings } from "@/hooks/use-ratings"
import RatingDisplay from "@/components/ratings/rating-display"

export default function RatingsPage() {
  const [activeTab, setActiveTab] = useState("received")
  const [filterRating, setFilterRating] = useState("all")
  const { receivedRatings, givenRatings, stats, loading, fetchReceivedRatings, fetchGivenRatings, fetchStats } =
    useRatings()

  useEffect(() => {
    fetchStats()
    fetchReceivedRatings()
    fetchGivenRatings()
  }, [])

  const filteredReceivedRatings = receivedRatings.filter(
    (rating) => filterRating === "all" || rating.rating.toString() === filterRating,
  )

  const filteredGivenRatings = givenRatings.filter(
    (rating) => filterRating === "all" || rating.rating.toString() === filterRating,
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Рейтинги и отзывы
            </h1>
            <p className="text-gray-600 mt-1">Управляйте своими отзывами и репутацией</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Фильтр по рейтингу" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все оценки</SelectItem>
                <SelectItem value="5">5 звезд</SelectItem>
                <SelectItem value="4">4 звезды</SelectItem>
                <SelectItem value="3">3 звезды</SelectItem>
                <SelectItem value="2">2 звезды</SelectItem>
                <SelectItem value="1">1 звезда</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-lg shadow-xl border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Средний рейтинг</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.average_rating || 0}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-2">
                <RatingDisplay rating={stats?.average_rating || 0} size="sm" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-lg shadow-xl border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Всего отзывов</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.total_received || 0}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-lg shadow-xl border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Дано оценок</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.total_given || 0}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-lg shadow-xl border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Этот месяц</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.this_month || 0}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rating Distribution */}
        {stats?.distribution && (
          <Card className="bg-white/80 backdrop-blur-lg shadow-xl border-0 mb-8">
            <CardHeader>
              <CardTitle>Распределение оценок</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 w-16">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${((stats.distribution[rating] || 0) / Math.max(stats.total_received, 1)) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12">{stats.distribution[rating] || 0}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="received">Мои отзывы ({receivedRatings.length})</TabsTrigger>
            <TabsTrigger value="given">Мои оценки ({givenRatings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="received">
            <div className="space-y-4">
              {filteredReceivedRatings.length === 0 ? (
                <Card className="bg-white/80 backdrop-blur-lg shadow-xl border-0">
                  <CardContent className="p-8 text-center">
                    <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Пока нет отзывов</h3>
                    <p className="text-gray-600">Совершите несколько поездок, чтобы получить первые отзывы</p>
                  </CardContent>
                </Card>
              ) : (
                filteredReceivedRatings.map((rating) => (
                  <Card key={rating.id} className="bg-white/80 backdrop-blur-lg shadow-xl border-0">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={
                              rating.from_user?.avatar
                                ? `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/storage/${rating.from_user.avatar}`
                                : undefined
                            }
                            alt={rating.from_user?.name}
                          />
                          <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                            {rating.from_user?.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{rating.from_user?.name}</h4>
                              <p className="text-sm text-gray-600">
                                {new Date(rating.created_at).toLocaleDateString("ru-RU")}
                              </p>
                            </div>
                            <RatingDisplay rating={rating.rating} size="sm" />
                          </div>
                          {rating.comment && (
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{rating.comment}</p>
                          )}
                          {rating.trip && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-800">
                                Поездка: {rating.trip.from_address} → {rating.trip.to_address}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="given">
            <div className="space-y-4">
              {filteredGivenRatings.length === 0 ? (
                <Card className="bg-white/80 backdrop-blur-lg shadow-xl border-0">
                  <CardContent className="p-8 text-center">
                    <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Вы еще не оставляли отзывов</h3>
                    <p className="text-gray-600">Оцените других пользователей после совместных поездок</p>
                  </CardContent>
                </Card>
              ) : (
                filteredGivenRatings.map((rating) => (
                  <Card key={rating.id} className="bg-white/80 backdrop-blur-lg shadow-xl border-0">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={
                              rating.to_user?.avatar
                                ? `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/storage/${rating.to_user.avatar}`
                                : undefined
                            }
                            alt={rating.to_user?.name}
                          />
                          <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                            {rating.to_user?.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{rating.to_user?.name}</h4>
                              <p className="text-sm text-gray-600">
                                {new Date(rating.created_at).toLocaleDateString("ru-RU")}
                              </p>
                            </div>
                            <RatingDisplay rating={rating.rating} size="sm" />
                          </div>
                          {rating.comment && (
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{rating.comment}</p>
                          )}
                          {rating.trip && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-800">
                                Поездка: {rating.trip.from_address} → {rating.trip.to_address}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
