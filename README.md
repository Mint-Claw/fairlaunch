# 🚀 FairLaunch — Reputation-Gated Token Launchpad on Solana

A **production-ready token launchpad** that uses [FairScale](https://fairscale.xyz) reputation infrastructure to gate token launches. Higher on-chain reputation = better allocations. Sybil-resistant by design.

> **Bounty Submission**: Build Production App Integrating FairScale Reputation Infrastructure ($5,000)

## 🎯 Live Demo

[https://fairlaunch.vercel.app](https://fairlaunch.vercel.app) *(coming soon)*

## ✨ Features

### 🛡️ Reputation-Gated Launches
- Token launches require minimum **FairScore** and **tier** to participate
- **Platinum**, **Gold**, **Silver**, **Bronze** tiers unlock different allocations
- Higher tiers get **bonus allocation percentages** (up to +35%)
- Sybil wallets automatically filtered by FairScale scoring

### 📊 Real-Time Reputation Dashboard
- Connect wallet → instant FairScore lookup via FairScale API
- Visual score breakdown: on-chain score, social score, sub-metrics
- Tier progress visualization with clear thresholds
- Badge display from FairScale (Diamond Hands, DeFi Degen, etc.)
- Tips to improve your score

### 🔍 Wallet Lookup
- Search any Solana wallet address to see its FairScore
- Useful for projects vetting participants or users comparing scores

### 🚀 Launch Explorer
- Browse live, upcoming, and completed token launches
- Filter by status, minimum tier requirement, or search by name/tag
- Progress bars showing fundraise completion
- Time remaining countdown for live launches

### 📋 Launch Detail Pages
- Full project information with links
- Tier requirement breakdown with bonus percentages
- Participation flow: check eligibility → enter amount → confirm
- Real-time allocation calculator based on your tier bonus
- Vesting schedule information

## 🔌 FairScale Integration

### API Integration
FairLaunch integrates FairScale's reputation API at its core:

```typescript
// Server-side proxy to protect API key
// GET /api/fairscore?wallet=ADDRESS
const res = await fetch(`https://api.fairscale.xyz/score?wallet=${wallet}`, {
  headers: { fairkey: process.env.FAIRSCALE_API_KEY },
})
```

### How Reputation Gates Launches

```
User connects wallet
       ↓
FairScale API returns score + tier
       ↓
Compare against launch requirements:
  - Minimum tier (e.g., Gold = 60+ score)
  - Minimum FairScore (e.g., 55)
       ↓
If eligible:
  - Calculate max allocation
  - Apply tier bonus (e.g., Gold = +20%)
  - Allow participation
If not eligible:
  - Show clear messaging
  - Suggest ways to improve score
```

### Use Cases Addressed
1. **Sybil Resistance**: Bots and farm wallets automatically filtered by low FairScores
2. **Fair Distribution**: Real community members get priority access
3. **Quality Signaling**: Projects attract genuine users, not speculators
4. **Risk Assessment**: Tier-based allocation reduces exposure to bad actors

## 🛠️ Tech Stack

- **Next.js 15** (App Router + Turbopack)
- **TypeScript** — Full type safety
- **Tailwind CSS** — Modern, responsive UI
- **Solana Wallet Adapter** — Phantom, Solflare support
- **FairScale API** — Reputation scoring
- **Recharts** — Data visualization

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/Mint-Claw/fairlaunch.git
cd fairlaunch

# Install
npm install

# Configure
cp .env.example .env.local
# Edit .env.local with your FairScale API key

# Run
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

> **Note**: The app works without a FairScale API key using mock data for demo purposes.

## 📂 Project Structure

```
fairlaunch/
├── src/
│   ├── app/
│   │   ├── page.tsx                # Landing page with live launches
│   │   ├── explore/page.tsx        # Browse & filter all launches
│   │   ├── launch/[id]/page.tsx    # Launch detail + participation
│   │   ├── dashboard/page.tsx      # User reputation dashboard
│   │   └── api/
│   │       └── fairscore/route.ts  # FairScale API proxy (protects key)
│   ├── components/
│   │   ├── navbar.tsx              # Navigation with score display
│   │   ├── providers.tsx           # Solana + wallet providers
│   │   ├── score-card.tsx          # FairScore visualization
│   │   └── launch-card.tsx         # Launch listing card
│   ├── lib/
│   │   ├── fairscale.ts            # FairScale API client & utilities
│   │   ├── mock-launches.ts        # Demo launch data
│   │   └── hooks.ts                # React hooks (useFairScore)
│   └── types/
│       └── index.ts                # TypeScript interfaces
├── .env.example
├── next.config.mjs
├── tailwind.config.ts
└── package.json
```

## 🎨 Screenshots

### Landing Page
- Hero with FairScore tier breakdown
- Live launch cards with progress bars
- "How it works" for disconnected users

### Launch Detail
- Full project info + tier requirements grid
- Participation panel with eligibility check
- Allocation calculator with tier bonuses

### Dashboard
- FairScore card with sub-score breakdown
- Tier progress visualization
- Score improvement tips
- Wallet lookup tool

## 🗺️ Roadmap

- [ ] Real SOL escrow via Anchor smart contract
- [ ] On-chain participation records
- [ ] Historical FairScore tracking
- [ ] Project submission portal
- [ ] Notification system for upcoming launches
- [ ] Mobile-responsive improvements
- [ ] FairScore leaderboard

## 📄 License

MIT — Built for the FairScale ecosystem on Solana.

---

**Built with ❤️ for FairScale** | [fairscale.xyz](https://fairscale.xyz) | [Solana](https://solana.com)
