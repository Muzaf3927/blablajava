import { TestApi } from "@/components/test-api"

export default function ApiTestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">API Integration Test</h1>
      <TestApi />
    </div>
  )
} 