"use client"

import { useState } from "react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

interface Transaction {
  id: number
  wallet_id: number
  type: string
  amount: number
  description?: string
  created_at: string
  updated_at: string
}

export function useWallet() {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const getAuthHeaders = () => {
    const token = localStorage.getItem("auth_token")
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  }

  const fetchWallet = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/wallet`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Ошибка получения кошелька")
      }

      const data = await response.json()
      setBalance(data.balance || 0)
    } catch (error) {
      console.error("Fetch wallet error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/wallet/transactions`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Ошибка получения транзакций")
      }

      const data = await response.json()
      setTransactions(data.transactions?.data || [])
    } catch (error) {
      console.error("Fetch transactions error:", error)
      throw error
    }
  }

  const deposit = async (amount: number, description?: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/wallet/deposit`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ amount, description }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Ошибка пополнения баланса")
      }

      setBalance(data.balance)
      return data
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    balance,
    transactions,
    loading,
    isLoading,
    fetchWallet,
    fetchTransactions,
    deposit,
  }
}
