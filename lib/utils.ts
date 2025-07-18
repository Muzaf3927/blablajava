import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAvatarUrl(avatar?: string): string {
  if (!avatar) {
    return "/placeholder.svg?height=40&width=40"
  }

  // If it's already a full URL, return as is
  if (avatar.startsWith("http")) {
    return avatar
  }

  // If it's a relative path, construct the full URL
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:8000"
  return `${baseUrl}/storage/${avatar}`
}

export function getInitials(name?: string | null): string {
  if (!name) return "U"

  return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
}

export function formatDate(date: string | Date): string {
  try {
    const d = new Date(date)
    return d.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch {
    return "Неверная дата"
  }
}

export function formatTime(time: string): string {
  try {
    // If time is in HH:MM:SS format, extract HH:MM
    if (time.includes(":")) {
      const parts = time.split(":")
      return `${parts[0]}:${parts[1]}`
    }
    return time
  } catch {
    return "Неверное время"
  }
}

export function formatPrice(price: number | string): string {
  try {
    const numPrice = typeof price === "string" ? Number.parseFloat(price) : price
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice)
  } catch {
    return "0 ₽"
  }
}
