"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"

interface Wallet {
  balance: number
}

interface Transaction {
  id: number
  wallet_id: number
  type: 'deposit' | 'withdrawal' | 'transfer'
  amount: number
  description: string
  created_at: string
}

interface DepositRequest {
  amount: number
  description?: string
}

export function useWallet() {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Получить баланс кошелька
  const getWallet = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await apiClient.getWallet()
      setWallet(response)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка получения баланса')
      console.error('Error fetching wallet:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Пополнить баланс
  const deposit = async (data: DepositRequest) => {
    try {
      setIsLoading(true)
      setError(null)
      
      await apiClient.depositWallet(data)
      
      // Обновляем баланс после пополнения
      await getWallet()
      
      return { message: 'Баланс успешно пополнен' }
    } catch (err: any) {
      setError(err.message || 'Ошибка пополнения баланса')
      console.error('Error depositing:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Получить историю транзакций
  const getTransactions = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await apiClient.getWalletTransactions()
      setTransactions(response || [])
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка получения истории транзакций')
      console.error('Error fetching transactions:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Обновить данные кошелька
  const refreshWallet = () => {
    getWallet()
    getTransactions()
  }

  useEffect(() => {
    getWallet()
    getTransactions()
  }, [])

  return {
    wallet,
    transactions,
    isLoading,
    error,
    deposit,
    getWallet,
    getTransactions,
    refreshWallet
  }
}
