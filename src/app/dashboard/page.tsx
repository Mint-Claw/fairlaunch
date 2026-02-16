'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Navbar } from '@/components/navbar'
import { ScoreCard } from '@/components/score-card'
import { useFairScore } from '@/lib/hooks'
import { getTierIcon, getTierColor, scoreToTier } from '@/lib/fairscale'
import type { FairScoreResponse } from '@/types'

function WalletLookup() {
  const [wallet, setWallet] = useState('')
  const [result, setResult] = useState<FairScoreResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const lookup = async () => {
    if (!wallet.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/fairscore?wallet=${wallet.trim()}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setResult(data)
    } catch {
      setError('Failed to fetch score. Check the wallet address.')
    }
    setLoading(false)
  }

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
      <h3 className="font-bold text-lg mb-4">🔍 Lookup Any Wallet</h3>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={wallet}
          onChange={e => setWallet(e.target.value)}
          placeholder="Enter Solana wallet address..."
          className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition"
          onKeyDown={e => e.key === 'Enter' && lookup()}
        />
        <button
          onClick={lookup}
          disabled={loading || !wallet.trim()}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-sm font-medium transition disabled:opacity-50"
        >
          {loading ? '...' : 'Check'}
        </button>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {result && <ScoreCard score={result} />}
    </div>
  )
}

export default function DashboardPage() {
  const { connected } = useWallet()
  const { score, loading } = useFairScore()

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400 mb-8">Your reputation overview and launch history</p>

        {!connected ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-6">🔗</p>
            <p className="text-xl text-gray-400 mb-6">Connect your wallet to view your dashboard</p>
            <WalletMultiButton />
          </div>
        ) : loading ? (
          <div className="text-center py-20">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p className="text-gray-400">Loading your reputation...</p>
          </div>
        ) : score ? (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Score overview */}
              <ScoreCard score={score} />

              {/* Feature breakdown */}
              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
                <h3 className="font-bold text-lg mb-4">📊 Score Breakdown</h3>
                <div className="space-y-3">
                  {[
                    { label: 'LST Percentile', value: score.features.lst_percentile_score, color: 'bg-blue-400' },
                    { label: 'Major Token Percentile', value: score.features.major_percentile_score, color: 'bg-purple-400' },
                    { label: 'Native SOL Percentile', value: score.features.native_sol_percentile, color: 'bg-yellow-400' },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">{item.label}</span>
                        <span>{Math.round(item.value * 100)}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${item.color} transition-all duration-1000`} style={{ width: `${item.value * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tier Progress */}
              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
                <h3 className="font-bold text-lg mb-4">🎯 Tier Progress</h3>
                <div className="flex items-center gap-2">
                  {(['bronze', 'silver', 'gold', 'platinum'] as const).map((tier, i) => {
                    const thresholds = [20, 40, 60, 80]
                    const reached = score.fairscore >= thresholds[i]
                    return (
                      <div key={tier} className="flex-1 flex flex-col items-center">
                        <span className={`text-2xl ${reached ? '' : 'opacity-30'}`}>{getTierIcon(tier)}</span>
                        <span className={`text-xs mt-1 capitalize ${reached ? getTierColor(tier) : 'text-gray-600'}`}>{tier}</span>
                        <span className="text-xs text-gray-600">{thresholds[i]}+</span>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4 w-full h-3 bg-gray-800 rounded-full overflow-hidden relative">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 via-yellow-400 to-emerald-400"
                    style={{ width: `${Math.min(100, score.fairscore)}%` }}
                  />
                  {[20, 40, 60, 80].map(t => (
                    <div key={t} className="absolute top-0 h-full w-px bg-gray-700" style={{ left: `${t}%` }} />
                  ))}
                </div>
              </div>

              {/* Improvement tips */}
              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
                <h3 className="font-bold text-lg mb-4">💡 Improve Your Score</h3>
                <div className="space-y-3">
                  {[
                    { tip: 'Increase on-chain activity', desc: 'Regular transactions and DeFi interactions boost your base score', icon: '📈' },
                    { tip: 'Hold diverse tokens', desc: 'LST holdings, major tokens, and native SOL all contribute', icon: '💰' },
                    { tip: 'Build wallet history', desc: 'Older wallets with consistent activity score higher', icon: '⏳' },
                    { tip: 'Grow social presence', desc: 'Link Twitter, Discord, and other social accounts', icon: '🌐' },
                  ].map(item => (
                    <div key={item.tip} className="flex gap-3 p-3 bg-gray-800/30 rounded-lg">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <p className="text-sm font-medium">{item.tip}</p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <WalletLookup />

              {/* Quick stats */}
              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
                <h3 className="font-bold text-lg mb-4">📋 Your Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Wallet</span>
                    <span className="font-mono text-xs">{score.wallet.slice(0, 6)}...{score.wallet.slice(-4)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tier</span>
                    <span className={getTierColor(score.tier)}>
                      {getTierIcon(score.tier)} {score.tier}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Eligible Launches</span>
                    <span>3 live</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Last Updated</span>
                    <span className="text-xs">{new Date(score.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  )
}
