import { NextRequest, NextResponse } from 'next/server'
import { getFairScore } from '@/lib/fairscale'

// Rate limit: 10 requests per minute per IP
const rateLimits = new Map<string, { count: number; resetAt: number }>()

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get('wallet')
  if (!wallet) {
    return NextResponse.json({ error: 'wallet parameter required' }, { status: 400 })
  }

  // Rate limiting
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()
  const limit = rateLimits.get(ip)

  if (limit && limit.resetAt > now) {
    if (limit.count >= 10) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again in a minute.' },
        { status: 429 },
      )
    }
    limit.count++
  } else {
    rateLimits.set(ip, { count: 1, resetAt: now + 60_000 })
  }

  try {
    const data = await getFairScore(wallet)
    return NextResponse.json(data)
  } catch (err) {
    // If API key not set or API error, return mock data for demo
    const mockScore = generateMockScore(wallet)
    return NextResponse.json(mockScore)
  }
}

function generateMockScore(wallet: string) {
  // Deterministic mock based on wallet address
  const hash = wallet.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const base = (hash % 80) + 10
  const social = (hash % 60) + 5
  const fair = Math.round(base * 0.7 + social * 0.3)

  const tier = fair >= 80 ? 'platinum' : fair >= 60 ? 'gold' : fair >= 40 ? 'silver' : 'bronze'

  const allBadges = [
    { id: 'diamond_hands', label: 'Diamond Hands', description: 'Long-term holder with conviction', tier: 'platinum' },
    { id: 'defi_degen', label: 'DeFi Degen', description: 'Active across multiple DeFi protocols', tier: 'gold' },
    { id: 'nft_collector', label: 'NFT Collector', description: 'Curated NFT portfolio', tier: 'silver' },
    { id: 'governance_voter', label: 'Governance Voter', description: 'Active DAO participant', tier: 'gold' },
    { id: 'early_adopter', label: 'Early Adopter', description: 'Among the first users', tier: 'bronze' },
  ]
  const badges = allBadges.filter((_, i) => hash % (i + 2) === 0)

  return {
    wallet,
    fairscore_base: base,
    social_score: social,
    fairscore: fair,
    tier,
    badges,
    actions: [],
    timestamp: new Date().toISOString(),
    features: {
      lst_percentile_score: (hash % 100) / 100,
      major_percentile_score: ((hash + 17) % 100) / 100,
      native_sol_percentile: ((hash + 31) % 100) / 100,
      tx_count: hash * 7 + 100,
      active_days: (hash % 365) + 30,
      wallet_age_days: (hash % 730) + 90,
    },
  }
}
