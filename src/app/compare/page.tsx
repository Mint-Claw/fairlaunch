'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { ScoreCard } from '@/components/score-card'
import { getTierIcon, getTierColor } from '@/lib/fairscale'
import type { FairScoreResponse } from '@/types'

export default function ComparePage() {
  const [wallets, setWallets] = useState(['', ''])
  const [results, setResults] = useState<(FairScoreResponse | null)[]>([null, null])
  const [loading, setLoading] = useState(false)

  const addWallet = () => {
    if (wallets.length < 4) {
      setWallets([...wallets, ''])
      setResults([...results, null])
    }
  }

  const removeWallet = (i: number) => {
    if (wallets.length > 2) {
      setWallets(wallets.filter((_, idx) => idx !== i))
      setResults(results.filter((_, idx) => idx !== i))
    }
  }

  const compare = async () => {
    setLoading(true)
    const newResults = await Promise.all(
      wallets.map(async w => {
        if (!w.trim()) return null
        try {
          const res = await fetch(`/api/fairscore?wallet=${w.trim()}`)
          if (!res.ok) return null
          return await res.json()
        } catch {
          return null
        }
      }),
    )
    setResults(newResults)
    setLoading(false)
  }

  const validResults = results.filter(Boolean) as FairScoreResponse[]

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Compare Wallets</h1>
        <p className="text-gray-400 mb-8">Compare FairScores across multiple wallets side by side</p>

        <div className="space-y-3 mb-6">
          {wallets.map((w, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={w}
                onChange={e => {
                  const next = [...wallets]
                  next[i] = e.target.value
                  setWallets(next)
                }}
                placeholder={`Wallet address ${i + 1}...`}
                className="flex-1 px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition font-mono"
              />
              {wallets.length > 2 && (
                <button onClick={() => removeWallet(i)} className="px-3 text-gray-500 hover:text-red-400">✕</button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 mb-10">
          <button
            onClick={compare}
            disabled={loading || wallets.every(w => !w.trim())}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-medium transition disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Compare'}
          </button>
          {wallets.length < 4 && (
            <button onClick={addWallet} className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm transition">
              + Add Wallet
            </button>
          )}
        </div>

        {validResults.length >= 2 && (
          <>
            {/* Comparison Table */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 mb-8 overflow-x-auto">
              <h3 className="font-bold text-lg mb-4">📊 Score Comparison</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-800">
                    <th className="text-left py-2 pr-4">Metric</th>
                    {validResults.map((r, i) => (
                      <th key={i} className="text-center py-2 px-4 font-mono text-xs">
                        {r.wallet.slice(0, 6)}...{r.wallet.slice(-4)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'FairScore', fn: (r: FairScoreResponse) => r.fairscore.toString() },
                    { label: 'Tier', fn: (r: FairScoreResponse) => `${getTierIcon(r.tier)} ${r.tier}` },
                    { label: 'Base Score', fn: (r: FairScoreResponse) => r.fairscore_base.toString() },
                    { label: 'Social Score', fn: (r: FairScoreResponse) => r.social_score.toString() },
                    { label: 'LST %', fn: (r: FairScoreResponse) => `${Math.round(r.features.lst_percentile_score * 100)}%` },
                    { label: 'Major Token %', fn: (r: FairScoreResponse) => `${Math.round(r.features.major_percentile_score * 100)}%` },
                    { label: 'SOL %', fn: (r: FairScoreResponse) => `${Math.round(r.features.native_sol_percentile * 100)}%` },
                    { label: 'Tx Count', fn: (r: FairScoreResponse) => r.features.tx_count.toLocaleString() },
                    { label: 'Active Days', fn: (r: FairScoreResponse) => r.features.active_days.toString() },
                    { label: 'Wallet Age', fn: (r: FairScoreResponse) => `${r.features.wallet_age_days}d` },
                    { label: 'Badges', fn: (r: FairScoreResponse) => r.badges.length.toString() },
                  ].map(row => {
                    const values = validResults.map(r => r.fairscore)
                    const maxScore = Math.max(...values)
                    return (
                      <tr key={row.label} className="border-b border-gray-800/50">
                        <td className="py-2.5 pr-4 text-gray-400">{row.label}</td>
                        {validResults.map((r, i) => {
                          const isWinner = row.label === 'FairScore' && r.fairscore === maxScore
                          return (
                            <td key={i} className={`text-center py-2.5 px-4 ${isWinner ? 'text-emerald-400 font-bold' : ''}`}>
                              {row.fn(r)}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Visual bars */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
              <h3 className="font-bold text-lg mb-4">📈 Visual Comparison</h3>
              <div className="space-y-4">
                {validResults.map((r, i) => {
                  const colors = ['bg-emerald-500', 'bg-cyan-500', 'bg-purple-500', 'bg-yellow-500']
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-mono text-xs text-gray-400">
                          {r.wallet.slice(0, 8)}...{r.wallet.slice(-6)}
                        </span>
                        <span className={`font-bold ${getTierColor(r.tier)}`}>
                          {getTierIcon(r.tier)} {r.fairscore}
                        </span>
                      </div>
                      <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${colors[i % colors.length]} transition-all duration-1000`}
                          style={{ width: `${Math.min(100, r.fairscore)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
