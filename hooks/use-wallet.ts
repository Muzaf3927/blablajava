"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"
import { Wallet, Transaction, DepositForm } from "@/lib/types"

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
      console.error('Error getting wallet:', err)
      setError(err.message || 'Ошибка получения баланса')
      // Если ошибка 401, перенаправляем на главную страницу
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        if (typeof window !== 'undefined') {
          window.location.href = '/'
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Пополнить баланс
  const deposit = async (data: DepositForm) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await apiClient.depositWallet(data)
      
      // Обновляем баланс после пополнения
      await getWallet()
      
      return { message: response.message }
    } catch (err: any) {
      setError(err.message || 'Ошибка пополнения баланса')
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
      setTransactions(response.transactions || [])
    } catch (err: any) {
      console.error('Error getting transactions:', err)
      setError(err.message || 'Ошибка получения истории транзакций')
      // Если ошибка 401, перенаправляем на главную страницу
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        if (typeof window !== 'undefined') {
          window.location.href = '/'
        }
      }
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
    // Проверяем, что мы на клиенте и есть токен
    if (typeof window === 'undefined') return
    
    const token = localStorage.getItem('auth_token')
    if (token) {
      getWallet()
      getTransactions()
    }
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
