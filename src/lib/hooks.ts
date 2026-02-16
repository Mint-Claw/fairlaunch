'use client'

import { useState, useEffect, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import type { FairScoreResponse } from '@/types'

export function useFairScore() {
  const { publicKey, connected } = useWallet()
  const [score, setScore] = useState<FairScoreResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchScore = useCallback(async (wallet?: string) => {
    const address = wallet || publicKey?.toBase58()
    if (!address) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/fairscore?wallet=${address}`)
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to fetch score')
      }
      const data: FairScoreResponse = await res.json()
      setScore(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [publicKey])

  useEffect(() => {
    if (connected && publicKey) {
      fetchScore()
    } else {
      setScore(null)
    }
  }, [connected, publicKey, fetchScore])

  return { score, loading, error, fetchScore, connected }
}
