import type { FairScoreResponse, LaunchTier } from '@/types'

const API_BASE = 'https://api.fairscale.xyz'

// Rate limiting
const requestCache = new Map<string, { data: FairScoreResponse; expires: number }>()
const CACHE_TTL = 60_000 // 1 minute

export async function getFairScore(
  wallet: string,
  apiKey?: string,
): Promise<FairScoreResponse> {
  const cached = requestCache.get(wallet)
  if (cached && cached.expires > Date.now()) return cached.data

  const key = apiKey || process.env.FAIRSCALE_API_KEY || ''

  const res = await fetch(`${API_BASE}/score?wallet=${wallet}`, {
    headers: { fairkey: key },
  })

  if (!res.ok) {
    throw new Error(`FairScale API error: ${res.status} ${res.statusText}`)
  }

  const data: FairScoreResponse = await res.json()
  requestCache.set(wallet, { data, expires: Date.now() + CACHE_TTL })
  return data
}

export function tierToNumber(tier: LaunchTier): number {
  const map: Record<LaunchTier, number> = {
    public: 0,
    bronze: 1,
    silver: 2,
    gold: 3,
    platinum: 4,
  }
  return map[tier]
}

export function scoreToTier(score: number): LaunchTier {
  if (score >= 80) return 'platinum'
  if (score >= 60) return 'gold'
  if (score >= 40) return 'silver'
  if (score >= 20) return 'bronze'
  return 'public'
}

export function meetsRequirement(
  userTier: LaunchTier,
  requiredTier: LaunchTier,
  userScore: number,
  requiredScore: number,
): boolean {
  return tierToNumber(userTier) >= tierToNumber(requiredTier) && userScore >= requiredScore
}

export function getTierColor(tier: LaunchTier): string {
  const colors: Record<LaunchTier, string> = {
    platinum: 'text-purple-400',
    gold: 'text-yellow-400',
    silver: 'text-gray-300',
    bronze: 'text-orange-400',
    public: 'text-gray-500',
  }
  return colors[tier]
}

export function getTierBgColor(tier: LaunchTier): string {
  const colors: Record<LaunchTier, string> = {
    platinum: 'bg-purple-900/30 border-purple-500/30',
    gold: 'bg-yellow-900/30 border-yellow-500/30',
    silver: 'bg-gray-800/50 border-gray-500/30',
    bronze: 'bg-orange-900/30 border-orange-500/30',
    public: 'bg-gray-900/50 border-gray-700/30',
  }
  return colors[tier]
}

export function getTierIcon(tier: LaunchTier): string {
  const icons: Record<LaunchTier, string> = {
    platinum: '💎',
    gold: '🏆',
    silver: '🥈',
    bronze: '🥉',
    public: '🌐',
  }
  return icons[tier]
}
