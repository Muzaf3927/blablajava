import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/layout/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { MobileOptimizationProvider } from "@/components/mobile-optimization-provider"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
    title: "RideShare - Попутчики",
    description: "Современная платформа для поиска попутчиков",
    viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
    themeColor: "#3b82f6",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "RideShare",
    },
    formatDetection: {
        telephone: false,
    },
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
                <MobileOptimizationProvider>
                    <Navigation />
                    <main>{children}</main>
                </MobileOptimizationProvider>
            </ThemeProvider>
        </body>
        </html>
    )
}
