"use client"

import { useEffect, useState } from "react"

export function useMobileOptimization() {
  const [isMobile, setIsMobile] = useState(false)
  const [isLowEndDevice, setIsLowEndDevice] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      
      setIsMobile(isMobileDevice)
      
      // Определяем низкопроизводительные устройства
      const isLowEnd = isMobileDevice && (
        // Проверяем количество ядер (если доступно)
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
        // Проверяем память (если доступно)
        (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
        // Проверяем соединение
        (navigator.connection && navigator.connection.effectiveType === 'slow-2g')
      )
      
      setIsLowEndDevice(isLowEnd)
    }

    checkDevice()
    
    // Слушаем изменения размера экрана
    const handleResize = () => {
      checkDevice()
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Оптимизации для мобильных устройств
  const mobileOptimizations = {
    // Уменьшаем количество анимаций на низкопроизводительных устройствах
    reducedAnimations: isLowEndDevice,
    
    // Уменьшаем качество изображений
    lowQualityImages: isLowEndDevice,
    
    // Отключаем некоторые эффекты
    disableEffects: isLowEndDevice,
    
    // Используем упрощенную навигацию
    simpleNavigation: isMobile,
    
    // Оптимизируем загрузку данных
    lazyLoading: isMobile,
  }

  return {
    isMobile,
    isLowEndDevice,
    mobileOptimizations,
  }
} 