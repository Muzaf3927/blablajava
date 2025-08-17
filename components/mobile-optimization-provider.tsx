"use client"

import { createContext, useContext, ReactNode } from "react"
import { useMobileOptimization } from "@/hooks/use-mobile-optimization"

interface MobileOptimizationContextType {
  isMobile: boolean
  isLowEndDevice: boolean
  mobileOptimizations: {
    reducedAnimations: boolean
    lowQualityImages: boolean
    disableEffects: boolean
    simpleNavigation: boolean
    lazyLoading: boolean
  }
}

const MobileOptimizationContext = createContext<MobileOptimizationContextType | undefined>(undefined)

export function MobileOptimizationProvider({ children }: { children: ReactNode }) {
  const mobileOptimization = useMobileOptimization()

  return (
    <MobileOptimizationContext.Provider value={mobileOptimization}>
      {children}
    </MobileOptimizationContext.Provider>
  )
}

export function useMobileOptimizationContext() {
  const context = useContext(MobileOptimizationContext)
  if (context === undefined) {
    throw new Error("useMobileOptimizationContext must be used within a MobileOptimizationProvider")
  }
  return context
} 