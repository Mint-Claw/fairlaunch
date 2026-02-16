'use client'

import Link from 'next/link'
import { getTierIcon, getTierColor, getTierBgColor } from '@/lib/fairscale'
import type { TokenLaunch } from '@/types'

function getStatusBadge(status: TokenLaunch['status']) {
  switch (status) {
    case 'live':
      return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-900/50 text-emerald-400 border border-emerald-500/30 animate-pulse">● Live</span>
    case 'upcoming':
      return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-900/50 text-blue-400 border border-blue-500/30">Upcoming</span>
    case 'ended':
      return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-800 text-gray-400 border border-gray-700">Ended</span>
    case 'distributed':
      return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-900/50 text-purple-400 border border-purple-500/30">Distributed</span>
  }
}

function getTimeRemaining(endTime: string): string {
  const diff = new Date(endTime).getTime() - Date.now()
  if (diff <= 0) return 'Ended'
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  if (days > 0) return `${days}d ${hours}h left`
  const mins = Math.floor((diff % 3600000) / 60000)
  return `${hours}h ${mins}m left`
}

export function LaunchCard({ launch }: { launch: TokenLaunch }) {
  const progressPct = Math.min(100, (launch.raised / launch.hardCap) * 100)

  return (
    <Link
      href={`/launch/${launch.id}`}
      className="block rounded-2xl border border-gray-800 bg-gray-900 hover:border-emerald-500/30 hover:bg-gray-900/80 transition-all group"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{launch.logo}</span>
            <div>
              <h3 className="font-bold text-lg group-hover:text-emerald-400 transition">{launch.name}</h3>
              <p className="text-sm text-gray-500">${launch.symbol}</p>
            </div>
          </div>
          {getStatusBadge(launch.status)}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{launch.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {launch.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-gray-800 text-gray-400">
              {tag}
            </span>
          ))}
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">{launch.raised.toLocaleString()} SOL raised</span>
            <span className="text-gray-500">{launch.hardCap.toLocaleString()} SOL</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{Math.round(progressPct)}% filled</span>
            <span>{launch.participants} participants</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-800">
          <div className={`flex items-center gap-1.5 text-sm`}>
            <span>{getTierIcon(launch.minTier)}</span>
            <span className={getTierColor(launch.minTier)}>
              {launch.minTier === 'public' ? 'Open to all' : `${launch.minTier}+ required`}
            </span>
          </div>
          {launch.status === 'live' && (
            <span className="text-xs text-gray-500">{getTimeRemaining(launch.endTime)}</span>
          )}
          {launch.status === 'upcoming' && (
            <span className="text-xs text-gray-500">Starts {new Date(launch.startTime).toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
