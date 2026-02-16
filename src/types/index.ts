export interface FairScoreResponse {
  wallet: string
  fairscore_base: number
  social_score: number
  fairscore: number
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  badges: Badge[]
  actions: string[]
  timestamp: string
  features: {
    lst_percentile_score: number
    major_percentile_score: number
    native_sol_percentile: number
    tx_count: number
    active_days: number
    wallet_age_days: number
  }
}

export interface Badge {
  id: string
  label: string
  description: string
  tier: string
}

export type LaunchTier = 'platinum' | 'gold' | 'silver' | 'bronze' | 'public'

export interface TokenLaunch {
  id: string
  name: string
  symbol: string
  description: string
  logo: string
  website?: string
  twitter?: string
  totalSupply: number
  launchPrice: number // in SOL
  hardCap: number // in SOL
  softCap: number // in SOL
  raised: number // current SOL raised
  minTier: LaunchTier // minimum FairScore tier to participate
  minScore: number // minimum FairScore to participate
  maxAllocation: number // max SOL per wallet
  tierBonuses: Record<LaunchTier, number> // % bonus allocation per tier
  startTime: string // ISO
  endTime: string // ISO
  status: 'upcoming' | 'live' | 'ended' | 'distributed'
  participants: number
  vestingSchedule?: string
  tags: string[]
}

export interface Participation {
  launchId: string
  wallet: string
  amount: number // SOL contributed
  tier: LaunchTier
  fairscore: number
  bonusPercent: number
  tokensAllocated: number
  timestamp: string
}
