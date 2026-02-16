'use client'

import { useState, useMemo } from 'react'
import { Navbar } from '@/components/navbar'
import { LaunchCard } from '@/components/launch-card'
import { MOCK_LAUNCHES } from '@/lib/mock-launches'
import type { TokenLaunch } from '@/types'

type FilterStatus = 'all' | 'live' | 'upcoming' | 'ended'
type FilterTier = 'all' | 'public' | 'bronze' | 'silver' | 'gold' | 'platinum'

export default function ExplorePage() {
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [tierFilter, setTierFilter] = useState<FilterTier>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return MOCK_LAUNCHES.filter(l => {
      if (statusFilter !== 'all') {
        if (statusFilter === 'ended' && l.status !== 'ended' && l.status !== 'distributed') return false
        if (statusFilter !== 'ended' && l.status !== statusFilter) return false
      }
      if (tierFilter !== 'all' && l.minTier !== tierFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return l.name.toLowerCase().includes(q) || l.symbol.toLowerCase().includes(q) || l.tags.some(t => t.toLowerCase().includes(q))
      }
      return true
    })
  }, [statusFilter, tierFilter, search])

  const statusOptions: { value: FilterStatus; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: MOCK_LAUNCHES.length },
    { value: 'live', label: '● Live', count: MOCK_LAUNCHES.filter(l => l.status === 'live').length },
    { value: 'upcoming', label: 'Upcoming', count: MOCK_LAUNCHES.filter(l => l.status === 'upcoming').length },
    { value: 'ended', label: 'Ended', count: MOCK_LAUNCHES.filter(l => l.status === 'ended' || l.status === 'distributed').length },
  ]

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Explore Launches</h1>
        <p className="text-gray-400 mb-8">Discover reputation-gated token launches on Solana</p>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, symbol, or tag..."
            className="flex-1 min-w-[200px] px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition"
          />

          <div className="flex gap-1 bg-gray-900 rounded-xl p-1 border border-gray-800">
            {statusOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  statusFilter === opt.value
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {opt.label} ({opt.count})
              </button>
            ))}
          </div>

          <select
            value={tierFilter}
            onChange={e => setTierFilter(e.target.value as FilterTier)}
            className="px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Tiers</option>
            <option value="platinum">💎 Platinum+</option>
            <option value="gold">🏆 Gold+</option>
            <option value="silver">🥈 Silver+</option>
            <option value="bronze">🥉 Bronze+</option>
            <option value="public">🌐 Public</option>
          </select>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-gray-400">No launches match your filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(launch => (
              <LaunchCard key={launch.id} launch={launch} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
