"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

interface ChatButtonProps {
  tripId: number
  partnerId: number
  partnerName: string
  className?: string
}

export default function ChatButton({ tripId, partnerId, partnerName, className }: ChatButtonProps) {
  const handleChatClick = () => {
    // Перенаправляем на страницу чатов с выбранным собеседником
    const chatUrl = `/chats?trip=${tripId}&partner=${partnerId}`
    window.location.href = chatUrl
  }

  return (
    <Button
      onClick={handleChatClick}
      variant="outline"
      size="sm"
      className={`border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent ${className}`}
    >
      <MessageCircle className="w-4 h-4 mr-2" />
      Написать {partnerName}
    </Button>
  )
}
