import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/layout/navigation"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
    title: "RideShare - Попутчики",
    description: "Современная платформа для поиска попутчиков",
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="ru">
        <body className={inter.className}>
            <ThemeProvider>
                <Navigation />
                <main>{children}</main>
            </ThemeProvider>
        </body>
        </html>
    )
}
