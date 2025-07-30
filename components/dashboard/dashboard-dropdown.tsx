"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Wallet, 
  Calendar, 
  MessageCircle, 
  History, 
  Plus, 
  TrendingUp,
  Car,
  Star,
  Clock,
  MapPin,
  LogOut
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useWallet } from "@/hooks/use-wallet"
import { useRouter } from "next/navigation"

interface DashboardDropdownProps {
  user: any
}

export function DashboardDropdown({ user }: DashboardDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [depositModalOpen, setDepositModalOpen] = useState(false)
  const [depositAmount, setDepositAmount] = useState("")
  const { user: currentUser, logout } = useAuth()
  const { wallet, deposit, isLoading: walletLoading } = useWallet()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const handleDeposit = async () => {
    try {
      await deposit({
        amount: Number(depositAmount),
        description: 'Пополнение через дашборд'
      })
      setDepositModalOpen(false)
      setDepositAmount("")
    } catch (error) {
      console.error("Ошибка пополнения:", error)
    }
  }

  const dashboardItems = [
    {
      title: "Кошелек",
      icon: Wallet,
      balance: wallet?.balance || 0,
      action: () => setDepositModalOpen(true),
      color: "bg-gradient-to-r from-green-500 to-emerald-600",
      textColor: "text-white"
    },
    {
      title: "Забронированные поездки",
      icon: Calendar,
      count: 0,
      href: "/bookings",
      color: "bg-gradient-to-r from-blue-500 to-purple-600",
      textColor: "text-white"
    },
    {
      title: "Чаты",
      icon: MessageCircle,
      count: 0,
      href: "/chats",
      color: "bg-gradient-to-r from-purple-500 to-pink-600",
      textColor: "text-white"
    },
    {
      title: "История поездок",
      icon: History,
      count: 0,
      href: "/my-trips",
      color: "bg-gradient-to-r from-orange-500 to-red-600",
      textColor: "text-white"
    }
  ]

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="relative h-10 w-10 rounded-full hover:bg-gray-100"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                {user.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 p-0" align="end">
          {/* Заголовок с балансом */}
          <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-lg">{user.name}</p>
                <p className="text-sm opacity-90">{user.phone}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-300 fill-current" />
                  <span className="text-sm">{user.rating || 0}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Wallet className="w-5 h-5" />
                  <span className="font-medium">Баланс</span>
                </div>
                <span className="text-xl font-bold">{wallet?.balance || 0} сум</span>
              </div>
            </div>
          </div>

          {/* Дашборд элементы */}
          <div className="p-4 space-y-3">
            {dashboardItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.title === "Кошелек" ? (
                  <Button
                    variant="ghost"
                    className="w-full justify-start p-3 h-auto hover:bg-gray-50 rounded-xl"
                    onClick={item.action}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color} ${item.textColor} mr-3`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.title}</span>
                        <Badge variant="secondary" className="ml-2">
                          {item.balance} сум
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                        <Plus className="w-3 h-3" />
                        <span>Пополнить</span>
                      </div>
                    </div>
                  </Button>
                ) : (
                  <a
                    href={item.href}
                    className="flex items-center p-3 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color} ${item.textColor} mr-3`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.title}</span>
                        <Badge variant="secondary" className="ml-2">
                          {item.count}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.title === "Забронированные поездки" && "Активные брони"}
                        {item.title === "Чаты" && "Новые сообщения"}
                        {item.title === "История поездок" && "Завершенные поездки"}
                      </p>
                    </div>
                  </a>
                )}
              </motion.div>
            ))}
          </div>

          <DropdownMenuSeparator />

          {/* Быстрые действия */}
          <div className="p-4">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="h-10">
                <Car className="w-4 h-4 mr-2" />
                Создать поездку
              </Button>
              <Button variant="outline" size="sm" className="h-10">
                <TrendingUp className="w-4 h-4 mr-2" />
                Статистика
              </Button>
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Навигация */}
          <div className="p-2">
            <DropdownMenuItem asChild>
              <a href="/profile" className="flex items-center p-2 rounded-lg hover:bg-gray-50">
                <Avatar className="w-6 h-6 mr-3">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">{user.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <span>Профиль</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/settings" className="flex items-center p-2 rounded-lg hover:bg-gray-50">
                <Clock className="w-4 h-4 mr-3" />
                <span>Настройки</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="flex items-center p-2 rounded-lg hover:bg-red-50 text-red-600"
            >
              <LogOut className="w-4 h-4 mr-3" />
              <span>Выйти</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Модальное окно пополнения баланса */}
      <Dialog open={depositModalOpen} onOpenChange={setDepositModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Wallet className="w-5 h-5 text-green-600" />
              <span>Пополнить баланс</span>
            </DialogTitle>
            <DialogDescription>
              Введите сумму для пополнения кошелька
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Сумма (сум)
              </Label>
              <Input
                id="amount"
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="col-span-3"
                min="1000"
                step="1000"
                placeholder="Введите сумму"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDepositModalOpen(false)}>
              Отмена
            </Button>
            <Button 
              type="submit" 
              onClick={handleDeposit}
              disabled={!depositAmount || Number(depositAmount) < 1000 || walletLoading}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {walletLoading ? "Пополнение..." : "Пополнить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 