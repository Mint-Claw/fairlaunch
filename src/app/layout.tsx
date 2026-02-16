import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FairLaunch — Reputation-Gated Token Launchpad on Solana',
  description: 'Fair token launches powered by FairScale reputation. Higher reputation = better allocations. Sybil-resistant by design.',
  keywords: ['Solana', 'FairScale', 'launchpad', 'reputation', 'token launch', 'IDO', 'sybil'],
  openGraph: {
    title: 'FairLaunch — Reputation-Gated Launchpad',
    description: 'Fair token launches on Solana. Powered by FairScale reputation.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-white antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
