# Cannabis Real Estate Brokers

Commercial cannabis property marketplace. Sister platform to Cannabis License Brokers — same bones, charcoal + emerald green identity.

## Run

```bash
npm install
npm run dev
# → localhost:3002
```

## Admin
`admin@cannabisrebrokers.com` / `Admin123!`

## Deal Types
- **Commercial Lease** — Full lease with Cannabis Use Addendum
- **Purchase & Sale** — PSA with cannabis zoning provisions
- **Sale-Leaseback** — PSA + Leaseback Agreement combined
- **Land / Development** — Purchase agreement for entitled/unentitled land

## Auto-Generated Documents
1. Cannabis Property NDA
2. Letter of Intent
3. Commercial Lease + Cannabis Addendum (lease deals)
4. Purchase & Sale Agreement (purchase / land deals)
5. Sale-Leaseback Agreement (SLB deals)

## Transaction Pipeline (deal-type aware)
- Lease: LOI → NDA → Due Diligence → Zoning → Contracts → Landlord Approval → License Verified → Close
- Purchase: LOI → NDA → Due Diligence → Zoning → Contracts → Financing/Escrow → License Verified → Close

## Revenue Model
2% closing fee from property owner/landlord at close. Free to list, free to browse.

## Stack
React 18 + Vite + React Router v6 + Lucide Icons
Google Fonts: DM Serif Display + Geist + Geist Mono
localStorage (swap for Supabase in production)

## Sister Platform
Cannabis License Brokers → localhost:3000
