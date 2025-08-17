"use client"

import { useState, useEffect, useRef } from "react"
import { useMobileOptimizationContext } from "@/components/mobile-optimization-provider"

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  fallback?: string
  placeholder?: string
}

export function LazyImage({ src, alt, className = "", fallback, placeholder }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const { mobileOptimizations } = useMobileOptimizationContext()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && imgRef.current) {
            imgRef.current.src = src
            observer.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: "50px",
        threshold: 0.1,
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current)
      }
    }
  }, [src])

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    setHasError(true)
    if (fallback) {
      setIsLoaded(true)
    }
  }

  const imageSrc = hasError && fallback ? fallback : src
  const displaySrc = isLoaded ? imageSrc : placeholder || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"

  return (
    <img
      ref={imgRef}
      src={displaySrc}
      alt={alt}
      className={`transition-opacity duration-300 ${
        isLoaded ? "opacity-100" : "opacity-0"
      } ${className}`}
      onLoad={handleLoad}
      onError={handleError}
      loading={mobileOptimizations.lazyLoading ? "lazy" : "eager"}
      style={{
        // Оптимизации для мобильных устройств
        imageRendering: mobileOptimizations.lowQualityImages ? "pixelated" : "auto",
        willChange: "opacity",
      }}
    />
  )
} 