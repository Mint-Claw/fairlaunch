'use client'

import Link from 'next/link'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Navbar } from '@/components/navbar'
import { LaunchCard } from '@/components/launch-card'
import { ScoreCard } from '@/components/score-card'
import { useFairScore } from '@/lib/hooks'
import { MOCK_LAUNCHES } from '@/lib/mock-launches'
import { getTierIcon } from '@/lib/fairscale'

export default function Home() {
  const { connected } = useWallet()
  const { score, loading } = useFairScore()
  const liveLaunches = MOCK_LAUNCHES.filter(l => l.status === 'live')
  const upcomingLaunches = MOCK_LAUNCHES.filter(l => l.status === 'upcoming')

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-gray-950 to-cyan-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-600/10 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/30 border border-emerald-500/20 text-emerald-400 text-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Powered by FairScale Reputation
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Fair Token Launches.{' '}
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Reputation First.
                </span>
              </h1>

              <p className="mt-6 text-lg text-gray-400 max-w-xl">
                The first launchpad where your on-chain reputation determines your allocation.
                Higher FairScore = better access. Sybil-resistant by design.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/explore"
                  className="inline-flex items-center rounded-xl bg-emerald-600 hover:bg-emerald-500 px-8 py-3.5 font-semibold transition shadow-lg shadow-emerald-900/30"
                >
                  Explore Launches →
                </Link>
                {!connected && (
                  <WalletMultiButton />
                )}
              </div>

              {/* Tier breakdown */}
              <div className="mt-12 grid grid-cols-4 gap-4">
                {(['platinum', 'gold', 'silver', 'bronze'] as const).map(tier => (
                  <div key={tier} className="text-center">
                    <span className="text-2xl">{getTierIcon(tier)}</span>
                    <p className="text-xs text-gray-500 mt-1 capitalize">{tier}</p>
                    <p className="text-xs text-gray-600">
                      {tier === 'platinum' ? '80+' : tier === 'gold' ? '60+' : tier === 'silver' ? '40+' : '20+'} score
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side: Score card or CTA */}
            <div className="lg:pl-8">
              {connected && score ? (
                <ScoreCard score={score} />
              ) : connected && loading ? (
                <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8 text-center">
                  <div className="animate-spin text-3xl mb-4">⏳</div>
                  <p className="text-gray-400">Loading your FairScore...</p>
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8">
                  <h3 className="text-xl font-bold mb-4">How It Works</h3>
                  <div className="space-y-4">
                    {[
                      { step: '1', title: 'Connect Wallet', desc: 'Link your Solana wallet to check your reputation' },
                      { step: '2', title: 'Get Your FairScore', desc: 'Your on-chain activity determines your tier' },
                      { step: '3', title: 'Access Launches', desc: 'Higher scores unlock better allocations & early access' },
                      { step: '4', title: 'Participate Fairly', desc: 'No bots, no sybils — real users get real allocation' },
                    ].map(item => (
                      <div key={item.step} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-900/50 border border-emerald-500/30 flex items-center justify-center text-sm font-bold text-emerald-400 shrink-0">
                          {item.step}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Live Launches */}
      {liveLaunches.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              Live Now
            </h2>
            <Link href="/explore" className="text-sm text-emerald-400 hover:text-emerald-300">
              View all →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveLaunches.map(launch => (
              <LaunchCard key={launch.id} launch={launch} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming */}
      {upcomingLaunches.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-16 border-t border-gray-800">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Upcoming Launches</h2>
            <Link href="/explore" className="text-sm text-emerald-400 hover:text-emerald-300">
              View all →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingLaunches.map(launch => (
              <LaunchCard key={launch.id} launch={launch} />
            ))}
          </div>
        </section>
      )}

      {/* Why FairLaunch */}
      <section className="border-t border-gray-800 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold text-center mb-4">Why FairLaunch?</h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Traditional launchpads reward bots and whales. FairLaunch rewards real users with proven on-chain reputation.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🛡️',
                title: 'Sybil Resistant',
                desc: 'FairScale reputation scoring filters out bots, fake wallets, and airdrop farmers automatically.',
              },
              {
                icon: '⚖️',
                title: 'Fair Allocations',
                desc: 'Higher reputation wallets get priority access and bonus allocations. Merit-based, not money-based.',
              },
              {
                icon: '📊',
                title: 'Transparent Scoring',
                desc: 'Every wallet\'s FairScore is publicly verifiable. On-chain activity + social signals = reputation.',
              },
              {
                icon: '🎯',
                title: 'Tiered Access',
                desc: 'Platinum, Gold, Silver, Bronze tiers unlock different launch privileges and allocation sizes.',
              },
              {
                icon: '🔒',
                title: 'Secure & Trustless',
                desc: 'Built on Solana with non-custodial participation. Your keys, your allocation.',
              },
              {
                icon: '🚀',
                title: 'Quality Projects',
                desc: 'Projects choose reputation-gated launches to attract genuine community members, not speculators.',
              },
            ].map((f, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-800 bg-gray-900 p-6 hover:border-emerald-500/30 transition"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-gray-800 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { value: '$2.5M+', label: 'Total Raised' },
              { value: '15+', label: 'Projects Launched' },
              { value: '3,200+', label: 'Verified Users' },
              { value: '0', label: 'Sybil Attacks' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-3xl font-bold">{s.value}</div>
                <div className="text-gray-400 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Launch Fairly?</h2>
          <p className="text-gray-400 mb-8">
            Connect your wallet, check your FairScore, and join reputation-gated launches.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/explore"
              className="inline-flex items-center rounded-xl bg-emerald-600 hover:bg-emerald-500 px-10 py-4 text-lg font-semibold transition"
            >
              Explore Launches →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="text-lg">🚀</span>
            <span>FairLaunch © 2026 — Powered by FairScale</span>
          </div>
          <div className="flex gap-6">
            <a href="https://fairscale.xyz" target="_blank" rel="noopener" className="hover:text-white transition">FairScale</a>
            <a href="https://solana.com" target="_blank" rel="noopener" className="hover:text-white transition">Solana</a>
            <a href="https://github.com/Mint-Claw/fairlaunch" target="_blank" rel="noopener" className="hover:text-white transition">GitHub</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
