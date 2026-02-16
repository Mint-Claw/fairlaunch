'use client'

import { getTierIcon, getTierColor, getTierBgColor } from '@/lib/fairscale'
import type { FairScoreResponse } from '@/types'

export function ScoreCard({ score }: { score: FairScoreResponse }) {
  const pct = Math.round(score.fairscore)

  return (
    <div className={`rounded-2xl border p-6 ${getTierBgColor(score.tier)} animate-slide-up`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-400">Your FairScore</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-bold">{pct}</span>
            <span className="text-sm text-gray-500">/100</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-3xl">{getTierIcon(score.tier)}</span>
          <span className={`text-lg font-semibold capitalize ${getTierColor(score.tier)}`}>
            {score.tier}
          </span>
        </div>
      </div>

      {/* Score bar */}
      <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden mb-4">
        <div
          className="h-full rounded-full bg-gradient-to-r from-orange-500 via-yellow-400 to-emerald-400 transition-all duration-1000"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Sub-scores */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-800/50 rounded-lg p-3">
          <p className="text-xs text-gray-500">On-Chain Score</p>
          <p className="text-lg font-semibold">{Math.round(score.fairscore_base)}</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <p className="text-xs text-gray-500">Social Score</p>
          <p className="text-lg font-semibold">{Math.round(score.social_score)}</p>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-sm font-medium">{score.features.tx_count.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Transactions</p>
        </div>
        <div>
          <p className="text-sm font-medium">{score.features.active_days}</p>
          <p className="text-xs text-gray-500">Active Days</p>
        </div>
        <div>
          <p className="text-sm font-medium">{score.features.wallet_age_days}</p>
          <p className="text-xs text-gray-500">Wallet Age</p>
        </div>
      </div>

      {/* Badges */}
      {score.badges.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <p className="text-xs text-gray-500 mb-2">Badges</p>
          <div className="flex flex-wrap gap-2">
            {score.badges.map(badge => (
              <span
                key={badge.id}
                className="px-2 py-1 text-xs rounded-full bg-gray-800 border border-gray-700 text-gray-300"
                title={badge.description}
              >
                {badge.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
