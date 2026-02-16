export function LaunchCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-800 rounded-full" />
        <div className="flex-1">
          <div className="h-4 bg-gray-800 rounded w-32 mb-2" />
          <div className="h-3 bg-gray-800 rounded w-20" />
        </div>
      </div>
      <div className="h-3 bg-gray-800 rounded w-full mb-2" />
      <div className="h-3 bg-gray-800 rounded w-3/4 mb-4" />
      <div className="h-2 bg-gray-800 rounded-full w-full mb-4" />
      <div className="flex gap-2">
        <div className="h-6 bg-gray-800 rounded-full w-16" />
        <div className="h-6 bg-gray-800 rounded-full w-16" />
      </div>
    </div>
  )
}

export function ScoreCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8 animate-pulse">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gray-800 rounded-full" />
        <div>
          <div className="h-6 bg-gray-800 rounded w-24 mb-2" />
          <div className="h-4 bg-gray-800 rounded w-16" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-2 bg-gray-800 rounded-full w-full" />
        <div className="h-2 bg-gray-800 rounded-full w-4/5" />
        <div className="h-2 bg-gray-800 rounded-full w-3/5" />
      </div>
    </div>
  )
}
