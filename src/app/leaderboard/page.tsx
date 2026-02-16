'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { getTierIcon, getTierColor } from '@/lib/fairscale'
import type { FairScoreResponse } from '@/types'

// Notable Solana wallets for demo leaderboard
const DEMO_WALLETS = [
  '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
  'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK',
  'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH',
  '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1',
  'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4',
  '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
  'So11111111111111111111111111111111111111112',
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
]

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<FairScoreResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const results = await Promise.all(
        DEMO_WALLETS.map(async w => {
          try {
            const res = await fetch(`/api/fairscore?wallet=${w}`)
            if (!res.ok) return null
            return await res.json()
          } catch {
            return null
          }
        }),
      )
      const valid = results.filter(Boolean) as FairScoreResponse[]
      valid.sort((a, b) => b.fairscore - a.fairscore)
      setEntries(valid)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">🏆 FairScore Leaderboard</h1>
        <p className="text-gray-400 mb-8">Top wallets ranked by FairScale reputation score</p>

        {loading ? (
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-900 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, i) => {
              const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`
              return (
                <div
                  key={entry.wallet}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition hover:border-emerald-500/30 ${
                    i < 3 ? 'bg-gray-900 border-gray-700' : 'bg-gray-900/50 border-gray-800'
                  }`}
                >
                  <span className={`text-xl w-10 text-center ${i >= 3 ? 'text-gray-500 text-sm' : ''}`}>
                    {medal}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm truncate">{entry.wallet}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-xs capitalize ${getTierColor(entry.tier)}`}>
                        {getTierIcon(entry.tier)} {entry.tier}
                      </span>
                      <span className="text-xs text-gray-600">•</span>
                      <span className="text-xs text-gray-500">{entry.features.tx_count.toLocaleString()} txs</span>
                      <span className="text-xs text-gray-600">•</span>
                      <span className="text-xs text-gray-500">{entry.features.active_days} active days</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{Math.round(entry.fairscore)}</p>
                    <p className="text-xs text-gray-500">FairScore</p>
                  </div>
                  <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden hidden sm:block">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400"
                      style={{ width: `${Math.min(100, entry.fairscore)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-8 p-4 bg-gray-900/50 border border-gray-800 rounded-xl text-sm text-gray-500">
          <p>💡 This leaderboard uses demo wallets. In production, it would track all wallets that have interacted with FairLaunch.</p>
        </div>
      </div>
    </main>
  )
}
