export default function SettingsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              <div>
                <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
            </div>
            <div className="flex space-x-3">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-24"></div>
              <div className="h-10 bg-gray-200 rounded w-24"></div>
            </div>
          </div>

          {/* Search */}
          <div className="h-16 bg-gray-200 rounded-lg"></div>

          {/* Tabs */}
          <div className="h-12 bg-gray-200 rounded-lg"></div>

          {/* Settings Cards */}
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 bg-gray-300 rounded w-48"></div>
                  <div className="h-8 bg-gray-300 rounded w-20"></div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                <div className="h-10 bg-gray-300 rounded w-64"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
