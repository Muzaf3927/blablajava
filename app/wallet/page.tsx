"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, CreditCard, History, TrendingUp } from "lucide-react"
import DepositModal from "@/components/wallet/deposit-modal"
import { useWallet } from "@/hooks/use-wallet"
import { formatNumber, formatDate } from "@/lib/utils"

export default function WalletPage() {
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [filter, setFilter] = useState<"all" | "deposit" | "withdrawal">("all")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { wallet, transactions, isLoading, error, getWallet, getTransactions } = useWallet()
  
  // Убеждаемся, что transactions - это массив
  const safeTransactions = Array.isArray(transactions) ? transactions : []

  useEffect(() => {
    const checkAuth = () => {
      // Проверяем, что мы на клиенте
      if (typeof window === 'undefined') return
      
      try {
        console.log('=== WALLET PAGE: Checking authentication ===')
        const token = localStorage.getItem("auth_token")
        const userData = localStorage.getItem("user")
        
        console.log('=== WALLET PAGE: Token exists:', !!token)
        console.log('=== WALLET PAGE: User data exists:', !!userData)
        
        if (token && userData) {
          setIsAuthenticated(true)
          console.log('=== WALLET PAGE: User authenticated, loading wallet data ===')
          getWallet()
          getTransactions()
        } else {
          console.log('=== WALLET PAGE: No auth data, redirecting to home ===')
          window.location.href = "/"
        }
      } catch (err) {
        console.error('=== WALLET PAGE: Error checking auth:', err)
        window.location.href = "/"
      }
    }

    checkAuth()
  }, [getWallet, getTransactions])

  const filteredTransactions = safeTransactions.filter((transaction) => {
    if (filter === "all") return true
    return transaction.type === filter
  })

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowUpRight className="w-4 h-4 text-green-500" />
      case "withdrawal":
        return <ArrowDownLeft className="w-4 h-4 text-red-500" />
      case "payment":
        return <CreditCard className="w-4 h-4 text-blue-500" />
      default:
        return <Wallet className="w-4 h-4 text-gray-500" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "text-green-600"
      case "withdrawal":
        return "text-red-600"
      case "payment":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const getTransactionText = (type: string) => {
    switch (type) {
      case "deposit":
        return "Пополнение"
      case "withdrawal":
        return "Списание"
      case "payment":
        return "Оплата"
      default:
        return type
    }
  }

  // Показываем загрузку, если пользователь не аутентифицирован
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Проверка аутентификации...</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка данных кошелька...</p>
        </div>
      </div>
    )
  }

  try {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
              <Wallet className="w-8 h-8 mr-3 text-blue-600" />
              Мой кошелек
            </h1>
            <p className="text-gray-600 mt-1">Управляйте своими финансами</p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Ошибка загрузки данных</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-2">
                  <Button 
                    onClick={() => {
                      setError(null)
                      getWallet()
                      getTransactions()
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded"
                  >
                    Попробовать снова
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Balance Card */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white shadow-2xl border-0 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center text-white/90 text-lg">
                  <Wallet className="w-5 h-5 mr-2" />
                  Баланс
                </CardTitle>
              </CardHeader>

              <CardContent className="relative z-10 space-y-6">
                <div>
                  <div className="text-4xl font-bold text-white mb-2">
                    {wallet ? formatNumber(wallet.balance || 0) : '0'} сум
                  </div>
                  <div className="text-white/70 text-sm">Доступно для использования</div>
                </div>

                <Button
                  onClick={() => setShowDepositModal(true)}
                  className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-200"
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Пополнить баланс
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Card className="bg-white/80 backdrop-blur-lg shadow-lg border-0">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Пополнений</p>
                      <p className="text-xl font-bold text-gray-900">
                        {safeTransactions.filter((t) => t.type === "deposit").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-lg shadow-lg border-0">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <History className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Операций</p>
                      <p className="text-xl font-bold text-gray-900">{safeTransactions.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Transactions */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-lg shadow-lg border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <History className="w-5 h-5 mr-2 text-gray-600" />
                    История операций
                  </CardTitle>

                  {/* Filters */}
                  <div className="flex space-x-2">
                    <Button
                      variant={filter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("all")}
                      className={
                        filter === "all"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "bg-transparent border-2"
                      }
                    >
                      Все
                    </Button>
                    <Button
                      variant={filter === "deposit" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("deposit")}
                      className={
                        filter === "deposit"
                          ? "bg-gradient-to-r from-green-600 to-green-700 text-white"
                          : "bg-transparent border-2"
                      }
                    >
                      Пополнения
                    </Button>
                    <Button
                      variant={filter === "withdrawal" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("withdrawal")}
                      className={
                        filter === "withdrawal"
                          ? "bg-gradient-to-r from-red-600 to-red-700 text-white"
                          : "bg-transparent border-2"
                      }
                    >
                      Списания
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-12">
                    <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Нет операций</h3>
                    <p className="text-gray-600">
                      {filter === "all"
                        ? "История ваших операций будет отображаться здесь"
                        : `Нет операций типа "${getTransactionText(filter)}"`}
                    </p>
                  </div>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-white rounded-lg shadow-sm">{getTransactionIcon(transaction.type)}</div>

                        <div>
                          <div className="font-medium text-gray-900">
                            {transaction.description || getTransactionText(transaction.type)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatDate(transaction.created_at)}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`text-lg font-bold ${getTransactionColor(transaction.type)}`}>
                          {transaction.type === "deposit" ? "+" : "-"}
                          {formatNumber(transaction.amount)} сум
                        </div>
                        <Badge
                          className={`${
                            transaction.type === "deposit"
                              ? "bg-green-100 text-green-800"
                              : transaction.type === "withdrawal"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                          } border-0 text-xs`}
                        >
                          {getTransactionText(transaction.type)}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Deposit Modal */}
        <DepositModal
          isOpen={showDepositModal}
          onClose={() => setShowDepositModal(false)}
          onSuccess={() => {
            getWallet()
            getTransactions()
            setShowDepositModal(false)
          }}
        />
      </div>
    </div>
  )
  } catch (error) {
    console.error('=== WALLET PAGE: Render error:', error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Произошла ошибка</h3>
          <p className="text-gray-600 mb-4">Не удалось загрузить страницу кошелька</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Обновить страницу
          </Button>
        </div>
      </div>
    )
  }
}
