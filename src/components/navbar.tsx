'use client'

import Link from 'next/link'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useFairScore } from '@/lib/hooks'
import { getTierIcon, getTierColor } from '@/lib/fairscale'

export function Navbar() {
  const { connected } = useWallet()
  const { score } = useFairScore()

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="text-2xl">🚀</span>
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              FairLaunch
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link href="/explore" className="px-3 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition">
              Explore
            </Link>
            <Link href="/dashboard" className="px-3 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition">
              Dashboard
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {connected && score && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800/50 border border-gray-700 text-sm`}>
              <span>{getTierIcon(score.tier)}</span>
              <span className={getTierColor(score.tier)}>
                {Math.round(score.fairscore)}
              </span>
            </div>
          )}
          <WalletMultiButton />
        </div>
      </div>
    </nav>
  )
}
