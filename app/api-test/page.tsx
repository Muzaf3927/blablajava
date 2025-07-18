import { TestApi } from "@/components/test-api"
import TestBookingApi from "@/components/test-booking-api"

export default function ApiTestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">API Integration Test</h1>
      <div className="space-y-8">
        <TestApi />
        <TestBookingApi />
      </div>
    </div>
  )
} 