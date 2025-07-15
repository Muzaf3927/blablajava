"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, CreditCard, History, TrendingUp } from "lucide-react"
import DepositModal from "@/components/wallet/deposit-modal"
import { useWallet } from "@/hooks/use-wallet"

export default function WalletPage() {
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [filter, setFilter] = useState<"all" | "deposit" | "withdrawal">("all")
  const { balance, transactions, loading, fetchWallet, fetchTransactions } = useWallet()

  useEffect(() => {
    fetchWallet()
    fetchTransactions()
  }, [])

  const filteredTransactions = transactions.filter((transaction) => {
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
              <Wallet className="w-8 h-8 mr-3 text-blue-600" />
              Мой кошелек
            </h1>
            <p className="text-gray-600 mt-1">Управляйте своими финансами</p>
          </div>
        </div>

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
                  <div className="text-4xl font-bold text-white mb-2">{balance.toLocaleString("ru-RU")} ₽</div>
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
                        {transactions.filter((t) => t.type === "deposit").length}
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
                      <p className="text-xl font-bold text-gray-900">{transactions.length}</p>
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
                            {new Date(transaction.created_at).toLocaleString("ru-RU")}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`text-lg font-bold ${getTransactionColor(transaction.type)}`}>
                          {transaction.type === "deposit" ? "+" : "-"}
                          {transaction.amount.toLocaleString("ru-RU")} ₽
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
            fetchWallet()
            fetchTransactions()
            setShowDepositModal(false)
          }}
        />
      </div>
    </div>
  )
}
