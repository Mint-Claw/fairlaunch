'use client'

import { useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Navbar } from '@/components/navbar'
import { ScoreCard } from '@/components/score-card'
import { useFairScore } from '@/lib/hooks'
import { getLaunch } from '@/lib/mock-launches'
import { getTierIcon, getTierColor, getTierBgColor, meetsRequirement, scoreToTier } from '@/lib/fairscale'
import type { LaunchTier } from '@/types'

export default function LaunchDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { connected } = useWallet()
  const { score, loading } = useFairScore()
  const [amount, setAmount] = useState('')
  const [participated, setParticipated] = useState(false)

  const launch = getLaunch(id)

  if (!launch) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-40">
          <div className="text-center">
            <p className="text-4xl mb-4">🚫</p>
            <p className="text-gray-400 text-lg">Launch not found</p>
            <Link href="/explore" className="text-emerald-400 text-sm mt-2 block">← Back to explore</Link>
          </div>
        </div>
      </main>
    )
  }

  const progressPct = Math.min(100, (launch.raised / launch.hardCap) * 100)
  const userTier = score ? score.tier as LaunchTier : 'public'
  const userScore = score ? score.fairscore : 0
  const eligible = score ? meetsRequirement(userTier, launch.minTier, userScore, launch.minScore) : false
  const bonusPct = score ? launch.tierBonuses[userTier] || 0 : 0
  const isLive = launch.status === 'live'

  const maxAlloc = eligible ? launch.maxAllocation * (1 + bonusPct / 100) : 0

  const handleParticipate = () => {
    if (!amount || parseFloat(amount) <= 0) return
    setParticipated(true)
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/explore" className="hover:text-emerald-400">Explore</Link>
          <span>/</span>
          <span className="text-white">{launch.name}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8">
              <div className="flex items-start gap-4 mb-6">
                <span className="text-5xl">{launch.logo}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold">{launch.name}</h1>
                    <span className="text-gray-500 text-lg">${launch.symbol}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    {launch.status === 'live' && (
                      <span className="px-3 py-1 text-sm rounded-full bg-emerald-900/50 text-emerald-400 border border-emerald-500/30 animate-pulse">● Live</span>
                    )}
                    {launch.status === 'upcoming' && (
                      <span className="px-3 py-1 text-sm rounded-full bg-blue-900/50 text-blue-400 border border-blue-500/30">Upcoming</span>
                    )}
                    {launch.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-gray-800 text-gray-400">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-gray-300 mb-6">{launch.description}</p>

              {/* Links */}
              <div className="flex gap-3">
                {launch.website && (
                  <a href={launch.website} target="_blank" rel="noopener" className="px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition">🌐 Website</a>
                )}
                {launch.twitter && (
                  <a href={`https://twitter.com/${launch.twitter.replace('@', '')}`} target="_blank" rel="noopener" className="px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition">𝕏 Twitter</a>
                )}
              </div>
            </div>

            {/* Launch Details */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8">
              <h2 className="text-xl font-bold mb-6">Launch Details</h2>

              {/* Progress */}
              <div className="mb-8">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">{launch.raised.toLocaleString()} SOL raised</span>
                  <span className="font-medium">{launch.hardCap.toLocaleString()} SOL hard cap</span>
                </div>
                <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-1000"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{Math.round(progressPct)}% filled</span>
                  <span>Soft cap: {launch.softCap} SOL</span>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Price', value: `${launch.launchPrice} SOL` },
                  { label: 'Total Supply', value: launch.totalSupply.toLocaleString() },
                  { label: 'Participants', value: launch.participants.toString() },
                  { label: 'Max Allocation', value: `${launch.maxAllocation} SOL` },
                  { label: 'Start', value: new Date(launch.startTime).toLocaleDateString() },
                  { label: 'End', value: new Date(launch.endTime).toLocaleDateString() },
                ].map(item => (
                  <div key={item.label} className="bg-gray-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="font-medium mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>

              {launch.vestingSchedule && (
                <div className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                  <p className="text-xs text-gray-500 mb-1">Vesting Schedule</p>
                  <p className="text-sm text-gray-300">{launch.vestingSchedule}</p>
                </div>
              )}
            </div>

            {/* Tier Requirements */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8">
              <h2 className="text-xl font-bold mb-6">Reputation Requirements & Bonuses</h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['platinum', 'gold', 'silver', 'bronze'] as const).map(tier => {
                  const isRequired = tier === launch.minTier
                  const bonus = launch.tierBonuses[tier]
                  const isUserTier = userTier === tier

                  return (
                    <div
                      key={tier}
                      className={`rounded-xl border p-4 text-center ${
                        isUserTier
                          ? 'border-emerald-500/50 bg-emerald-900/20'
                          : getTierBgColor(tier)
                      }`}
                    >
                      <span className="text-2xl">{getTierIcon(tier)}</span>
                      <p className={`text-sm font-semibold capitalize mt-1 ${getTierColor(tier)}`}>{tier}</p>
                      {bonus > 0 ? (
                        <p className="text-xs text-emerald-400 mt-1">+{bonus}% bonus</p>
                      ) : (
                        <p className="text-xs text-gray-600 mt-1">No bonus</p>
                      )}
                      {isRequired && (
                        <p className="text-xs text-yellow-400 mt-1">Min required</p>
                      )}
                      {isUserTier && (
                        <p className="text-xs text-emerald-400 mt-1">← You</p>
                      )}
                    </div>
                  )
                })}
              </div>

              <p className="text-sm text-gray-500 mt-4">
                Minimum FairScore: <span className="text-white font-medium">{launch.minScore}</span> |
                Minimum Tier: <span className={`font-medium ${getTierColor(launch.minTier)}`}>{launch.minTier}</span>
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Participation */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 sticky top-20">
              {!connected ? (
                <div className="text-center py-6">
                  <p className="text-4xl mb-4">🔗</p>
                  <p className="text-gray-400 mb-4">Connect your wallet to participate</p>
                  <WalletMultiButton />
                </div>
              ) : loading ? (
                <div className="text-center py-6">
                  <div className="animate-spin text-3xl mb-4">⏳</div>
                  <p className="text-gray-400">Checking your reputation...</p>
                </div>
              ) : !eligible ? (
                <div className="text-center py-6">
                  <p className="text-4xl mb-4">🚫</p>
                  <p className="text-red-400 font-medium mb-2">Not Eligible</p>
                  <p className="text-sm text-gray-500 mb-4">
                    This launch requires {launch.minTier} tier (FairScore {launch.minScore}+).
                    Your score: {Math.round(userScore)}
                  </p>
                  <div className="p-3 bg-gray-800/50 rounded-lg text-sm text-gray-400">
                    💡 Improve your FairScore by increasing on-chain activity and building social reputation.
                  </div>
                </div>
              ) : participated ? (
                <div className="text-center py-6 animate-slide-up">
                  <p className="text-4xl mb-4">🎉</p>
                  <p className="text-emerald-400 font-bold text-lg mb-2">Participation Recorded!</p>
                  <p className="text-sm text-gray-400">
                    {amount} SOL committed with {bonusPct}% bonus allocation
                  </p>
                  <div className="mt-4 p-3 bg-emerald-900/20 border border-emerald-500/20 rounded-lg text-sm">
                    <p className="text-emerald-400 font-medium">
                      ~{Math.round(parseFloat(amount) / launch.launchPrice * (1 + bonusPct / 100)).toLocaleString()} {launch.symbol} allocated
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="font-bold text-lg mb-4">Participate</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Your Tier</span>
                      <span className={`flex items-center gap-1 ${getTierColor(userTier)}`}>
                        {getTierIcon(userTier)} {userTier}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Bonus</span>
                      <span className="text-emerald-400">+{bonusPct}%</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Max Allocation</span>
                      <span>{maxAlloc.toFixed(1)} SOL</span>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Amount (SOL)</label>
                      <input
                        type="number"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder={`Max: ${maxAlloc.toFixed(1)}`}
                        max={maxAlloc}
                        min={0}
                        step={0.1}
                        className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition"
                      />
                    </div>

                    {amount && parseFloat(amount) > 0 && (
                      <div className="p-3 bg-gray-800/50 rounded-lg text-sm">
                        <div className="flex justify-between text-gray-400">
                          <span>Estimated tokens</span>
                          <span className="text-white font-medium">
                            ~{Math.round(parseFloat(amount) / launch.launchPrice * (1 + bonusPct / 100)).toLocaleString()} {launch.symbol}
                          </span>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleParticipate}
                      disabled={!isLive || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > maxAlloc}
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {!isLive ? 'Not Live Yet' : 'Participate'}
                    </button>

                    {!isLive && (
                      <p className="text-xs text-gray-500 text-center">
                        Starts {new Date(launch.startTime).toLocaleString()}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* User score card */}
            {score && <ScoreCard score={score} />}
          </div>
        </div>
      </div>
    </main>
  )
}
