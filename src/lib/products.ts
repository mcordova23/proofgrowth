export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  images?: string[]
}

// Ad spot products for ProofGrowth
export const PRODUCTS: Product[] = [
  {
    id: 'sponsor-spot-monthly',
    name: 'Featured Sponsor Spot',
    description: 'Premium sponsor placement on ProofGrowth for one month. Your product will be showcased on the homepage and leaderboard sidebar.',
    priceInCents: 4900, // $49/month
  },
]
