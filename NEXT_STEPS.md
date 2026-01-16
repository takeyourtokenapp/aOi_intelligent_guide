# TYT.FOUNDATION - Implementation Roadmap & Next Steps

> **Updated**: 16 January 2026, 18:00 UTC
> **Focus**: tyt.foundation content expansion and unrealized features
> **Timeline**: 12 weeks to beta launch
> **Current Status**: 85/100 complete
> **Latest Milestone**: Foundation Trust Layer COMPLETE (B0-B6) ✅

---

## 🎯 EXECUTIVE SUMMARY

This document provides a **structured, step-by-step implementation plan** for completing all remaining features of **tyt.foundation** and launching the public beta.

### Current State (16 January 2026)

**Completed Infrastructure ✅**
- ✅ **Trust Layer**: 100% complete (B0-B6 commands)
  - Public ledger with 3-tier verification
  - Orbital witness system
  - aOi verification with confidence scores
  - Reverse traceability
- ✅ **Architecture**: Foundation-first design fully implemented
- ✅ **Database**: 40 tables with 100% RLS coverage
- ✅ **Content**: 66 CNS articles + 39 Web3 articles (100% embeddings)
- ✅ **Pages**: 9 operational pages (Foundation, Grants, Transparency, Orbital, AoiTransparency, Academy, Contact, Home, 404)
- ✅ **aOi RAG**: Fully functional with vector search
- ✅ **Security**: A+ grade (96/100)

**Critical Missing (Blocks Beta) 🔴**
- 🔴 **Real Donation Processing**: UI ready, backend missing
- 🔴 **Impact Stories**: Not implemented
- 🔴 **Privacy Policy & GDPR**: Not created

**High Priority 🟡**
- 🟡 **Content Expansion**: Need 134+ more CNS articles, 61+ Web3 articles
- 🟡 **Volunteer Portal**: Not started
- 🟡 **Foundation Blog**: Not implemented
- 🟡 **Partner Clinics Showcase**: UI missing

### 12-Week Goals

**Week 1-2: Donations (P0)** → Accept real crypto donations
**Week 3-4: Impact Stories (P1)** → Emotional connection with users
**Week 5-6: Content Expansion (P1)** → 80+ CNS, 50+ Web3 articles
**Week 7-8: Partners & Volunteers (P2)** → Community building
**Week 9-10: Blog & Newsletter (P2)** → Engagement & retention
**Week 11-12: Polish & Launch (P0)** → Beta launch ready

### Success Metrics (12 Weeks)

**Foundation Impact:**
```
Donations Processed:     $25,000+ total
Unique Donors:           50+
Families Supported:      15 (real, not demo)
Research Grants:         2 active (real)
Clinical Partners:       3+ partnerships
Impact Stories:          10+ published
```

**Engagement:**
```
Website Visits:          5,000/month
Knowledge Searches:      500/month
aOi Queries:             200/month (foundation context)
Contact Submissions:     30/month
Newsletter Subs:         300+
Volunteer Apps:          20+
```

**Content:**
```
CNS Articles:            80+ (from 66)
Web3 Articles:           50+ (from 39)
Blog Posts:              12+
Impact Stories:          10+
Partner Profiles:        10+
```

---

## 📋 PRIORITY CLASSIFICATION

### P0 - Critical (Blocks Beta Launch)

**These features MUST be implemented before public beta:**

**1. Real Donation Processing** (Weeks 1-2)
- Crypto wallets (BTC, ETH, USDT, TON, SOL)
- QR code generation
- Transaction monitoring (Blocknative/polling)
- Confirmation emails
- Statistics updates
- Integration with fund_transparency table
- Blockchain hash recording

**2. Privacy Policy & GDPR Compliance** (Week 11)
- Privacy Policy page
- Cookie Consent banner
- Terms of Service
- Data export functionality
- Deletion workflow

**3. Security Hardening** (Week 3)
- Rate limiting on all endpoints
- Bot protection (hCaptcha)
- Email enumeration prevention
- Audit log system

### P1 - High Priority (Essential for Full Launch)

**4. Impact Stories System** (Weeks 3-4)
- Create impact_stories table
- Build ImpactStoryCard component
- Build ImpactStoriesGrid component
- Admin approval workflow
- Multi-language support (EN/RU/HE)
- Integration with FoundationPage

**5. Knowledge Base Expansion** (Weeks 5-6)
- **CNS Articles**: Add 15+ new articles (66 → 81)
  - Advanced treatment protocols (5)
  - Clinical trial phases (5)
  - Family support resources (5)
- **Web3 Articles**: Add 10+ new articles (39 → 49)
  - DeSci deep dives (5)
  - Token economics (3)
  - DAO governance (2)
- Generate embeddings for all
- Complete Hebrew translations
- Test aOi accuracy (target: 95%+)

**6. Partner Clinics Showcase** (Week 7)
- Build PartnerClinicCard component
- Build PartnerClinicsGrid component
- Add to Foundation Research page
- Populate with 10+ partner profiles

### P2 - Medium Priority (Enhances User Experience)

**7. Volunteer Portal** (Weeks 8-9)
- Create volunteer_opportunities table
- Create volunteer_applications table
- Create volunteer_hours table
- Build VolunteerPage
- Build OpportunityCard component
- Application workflow
- Volunteer dashboard
- Gamification (badges)

**8. Foundation Blog** (Weeks 10-11)
- Create foundation_blog_posts table
- Build BlogPostPage component
- Build BlogGrid component
- Build admin CMS (simple)
- Write 5 initial posts
- SEO optimization
- RSS feed

**9. Newsletter System** (Week 11)
- Create newsletter_subscribers table
- Build NewsletterSubscribe widget
- Email confirmation workflow
- Unsubscribe mechanism
- Monthly newsletter template
- Resend API integration

### P3 - Nice-to-Have (Post-Launch)

**10. Events Calendar** (Week 12)
**11. Annual Report Generator** (Future)
**12. Advanced Analytics Dashboard** (Future)
**13. Mobile App** (6 months+)
**14. DAO Voting for Grants** (6 months+)

---

## 🚀 12-WEEK IMPLEMENTATION PLAN

## PHASE 1: CRITICAL FOUNDATION (Weeks 1-4)

### Week 1: Donation System - Crypto Wallets Setup

#### Day 1: Wallet Generation & Security

**Tasks:**
```bash
□ Generate mainnet wallet addresses:
  - Bitcoin (bc1q...)
  - Ethereum (0x...)
  - USDT on Ethereum (0x... same as ETH)
  - USDT on Tron (T...)
  - TON (EQ...)
  - Solana (...)

□ Security setup:
  - Store private keys in hardware wallet (Ledger/Trezor)
  - Backup private keys securely (encrypted, multiple locations)
  - Set up multisig (3-of-5) for large amounts
  - Document recovery procedures
  - Store public addresses in Supabase Vault
```

**Technical Implementation:**
```typescript
// supabase/functions/wallet-config/index.ts
interface FoundationWallet {
  network: 'btc' | 'eth' | 'usdt_eth' | 'usdt_tron' | 'ton' | 'sol';
  address: string;
  qr_code_url: string;
  explorer_base_url: string;
}

const FOUNDATION_WALLETS: FoundationWallet[] = [
  {
    network: 'btc',
    address: Deno.env.get('FOUNDATION_BTC_ADDRESS')!,
    qr_code_url: '/qr/btc.png',
    explorer_base_url: 'https://blockchain.info/address/'
  },
  {
    network: 'eth',
    address: Deno.env.get('FOUNDATION_ETH_ADDRESS')!,
    qr_code_url: '/qr/eth.png',
    explorer_base_url: 'https://etherscan.io/address/'
  },
  // ... other wallets
];
```

#### Day 2: QR Code Generation

**Tasks:**
```bash
□ Install qrcode package: npm install qrcode
□ Create QR generation script
□ Generate QR for each wallet (512x512 PNG)
□ Upload to Supabase Storage (foundation-assets/qr/)
□ Verify QR codes scan correctly
□ Update DonationWidget with QR URLs
```

**Implementation:**
```typescript
// scripts/generateWalletQRCodes.ts
import QRCode from 'qrcode';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const wallets = {
  btc: process.env.FOUNDATION_BTC_ADDRESS!,
  eth: process.env.FOUNDATION_ETH_ADDRESS!,
  usdt_eth: process.env.FOUNDATION_ETH_ADDRESS!,
  usdt_tron: process.env.FOUNDATION_TRON_ADDRESS!,
  ton: process.env.FOUNDATION_TON_ADDRESS!,
  sol: process.env.FOUNDATION_SOL_ADDRESS!
};

for (const [network, address] of Object.entries(wallets)) {
  const qrBuffer = await QRCode.toBuffer(address, {
    errorCorrectionLevel: 'H',
    type: 'png',
    width: 512,
    margin: 2
  });

  await supabase.storage
    .from('foundation-assets')
    .upload(`qr/${network}.png`, qrBuffer, {
      contentType: 'image/png',
      upsert: true
    });

  console.log(`✅ Generated QR for ${network}`);
}
```

#### Day 3-4: Transaction Monitoring

**Option A: Simple Polling (Recommended for MVP)**

```typescript
// supabase/functions/transaction-monitor/index.ts
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey'
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const btcAddress = Deno.env.get('FOUNDATION_BTC_ADDRESS')!;

  try {
    // Check Bitcoin transactions
    const response = await fetch(
      `https://blockchain.info/rawaddr/${btcAddress}`
    );
    const data = await response.json();

    const newTransactions = [];

    for (const tx of data.txs) {
      // Find outputs to our address
      const ourOutput = tx.out.find((o: any) => o.addr === btcAddress);
      if (!ourOutput) continue;

      const confirmations = data.n_tx - tx.block_index;
      if (confirmations < 6) continue; // Wait for 6 confirmations

      // Check if already recorded
      const { data: existing } = await supabase
        .from('foundation_donations')
        .select('id')
        .eq('blockchain_hash', tx.hash)
        .maybeSingle();

      if (!existing) {
        const amount = ourOutput.value / 100000000; // Satoshis to BTC

        // Record donation
        const { data: donation, error } = await supabase
          .from('foundation_donations')
          .insert({
            amount_btc: amount,
            amount_usd: amount * 50000, // Estimate (should fetch real rate)
            currency: 'BTC',
            blockchain_hash: tx.hash,
            blockchain_network: 'bitcoin',
            status: 'completed',
            donor_wallet: tx.inputs[0]?.prev_out?.addr,
            confirmed_at: new Date(tx.time * 1000).toISOString()
          })
          .select()
          .single();

        if (!error) {
          newTransactions.push(donation);

          // Update foundation statistics
          await supabase.rpc('increment_foundation_stats', {
            amount_usd: amount * 50000
          });

          // Record in fund_transparency
          await supabase.from('fund_transparency').insert({
            transaction_type: 'donation',
            amount_usd: amount * 50000,
            source: 'Anonymous Donor',
            destination: 'TYT Foundation',
            blockchain_hash: tx.hash,
            blockchain_network: 'bitcoin',
            description_en: `Bitcoin donation of ${amount.toFixed(8)} BTC`,
            description_ru: `Донат в Bitcoin: ${amount.toFixed(8)} BTC`,
            is_public: true,
            verified: true
          });

          // Send confirmation email (if provided)
          // await sendDonationEmail(donation);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        newTransactions: newTransactions.length,
        transactions: newTransactions
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

**Cron Setup:**
```sql
-- Schedule transaction monitoring (every 5 minutes)
SELECT cron.schedule(
  'monitor-donations',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/transaction-monitor',
    headers := jsonb_build_object(
      'Authorization',
      'Bearer ' || current_setting('app.service_role_key')
    )
  );
  $$
);
```

#### Day 5: Email Notifications

```typescript
// supabase/functions/send-donation-confirmation/index.ts
const sendDonationConfirmation = async (donation: any) => {
  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Thank You for Your Donation! 💙</h1>
      <p>Your generous donation has been received and confirmed.</p>

      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Amount:</strong> ${donation.amount_btc} BTC (~$${donation.amount_usd.toFixed(2)} USD)</p>
        <p><strong>Transaction:</strong>
          <a href="https://blockchain.info/tx/${donation.blockchain_hash}">
            ${donation.blockchain_hash.slice(0, 16)}...
          </a>
        </p>
        <p><strong>Date:</strong> ${new Date(donation.confirmed_at).toLocaleString()}</p>
      </div>

      <p>Your contribution will directly support pediatric brain cancer research:</p>
      <ul>
        <li>Funding cutting-edge treatment protocols</li>
        <li>Supporting families during difficult times</li>
        <li>Advancing medical technology and equipment</li>
      </ul>

      <p>All donations are recorded on the blockchain for complete transparency.
         You can view your contribution on our
         <a href="https://tyt.foundation/transparency">Transparency Page</a>.</p>

      <p>With gratitude,<br><strong>TYT Foundation Team</strong></p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
      <p style="font-size: 12px; color: #666;">
        TYT Foundation is a registered non-profit organization.
        Tax receipt will be issued for donations over $250.
      </p>
    </div>
  `;

  // Send via Resend
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'TYT Foundation <donations@tyt.foundation>',
      to: 'donors@tyt.foundation', // Or donor email if provided
      subject: `Thank you for your ${donation.amount_btc} BTC donation`,
      html: emailHtml
    })
  });
};
```

---

### Week 2: Donation System - Frontend & Testing

#### Day 1-2: Update DonationWidget

```typescript
// src/components/DonationWidget.tsx (UPDATED)
import { useState, useEffect } from 'react';
import { Check, Copy, ExternalLink, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';

const WALLETS = {
  BTC: {
    address: import.meta.env.VITE_FOUNDATION_BTC_ADDRESS,
    explorer: 'https://blockchain.info/address/',
    name: 'Bitcoin'
  },
  ETH: {
    address: import.meta.env.VITE_FOUNDATION_ETH_ADDRESS,
    explorer: 'https://etherscan.io/address/',
    name: 'Ethereum'
  },
  USDT_ETH: {
    address: import.meta.env.VITE_FOUNDATION_ETH_ADDRESS,
    explorer: 'https://etherscan.io/address/',
    name: 'USDT (Ethereum)'
  },
  USDT_TRON: {
    address: import.meta.env.VITE_FOUNDATION_TRON_ADDRESS,
    explorer: 'https://tronscan.org/#/address/',
    name: 'USDT (Tron)'
  },
  TON: {
    address: import.meta.env.VITE_FOUNDATION_TON_ADDRESS,
    explorer: 'https://tonscan.org/address/',
    name: 'TON'
  },
  SOL: {
    address: import.meta.env.VITE_FOUNDATION_SOL_ADDRESS,
    explorer: 'https://solscan.io/account/',
    name: 'Solana'
  }
};

export default function DonationWidget() {
  const { language } = useLanguage();
  const [selectedCrypto, setSelectedCrypto] = useState<keyof typeof WALLETS>('BTC');
  const [copied, setCopied] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQRCode();
  }, [selectedCrypto]);

  const loadQRCode = async () => {
    setLoading(true);
    const { data } = supabase.storage
      .from('foundation-assets')
      .getPublicUrl(`qr/${selectedCrypto.toLowerCase()}.png`);

    setQrCode(data.publicUrl);
    setLoading(false);
  };

  const copyAddress = () => {
    const wallet = WALLETS[selectedCrypto];
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wallet = WALLETS[selectedCrypto];

  return (
    <div className="donation-widget bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        {language === 'en' ? 'Support Our Mission' : 'Поддержите нашу миссию'}
      </h3>

      <p className="text-gray-600 dark:text-gray-300 mb-6">
        {language === 'en'
          ? 'Every donation directly supports pediatric brain cancer research'
          : 'Каждый донат напрямую поддерживает исследования опухолей мозга у детей'}
      </p>

      {/* Crypto selector */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {(Object.keys(WALLETS) as Array<keyof typeof WALLETS>).map(crypto => (
          <button
            key={crypto}
            onClick={() => setSelectedCrypto(crypto)}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
              selectedCrypto === crypto
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            {crypto.replace('_', '\n')}
          </button>
        ))}
      </div>

      {/* QR Code */}
      <div className="text-center mb-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        {loading ? (
          <div className="w-64 h-64 mx-auto flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <img
            src={qrCode}
            alt={`${wallet.name} QR Code`}
            className="w-64 h-64 mx-auto"
          />
        )}
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {wallet.name}
        </p>
      </div>

      {/* Address with copy/view buttons */}
      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-4">
        <code className="flex-1 text-xs break-all text-gray-800 dark:text-gray-200">
          {wallet.address}
        </code>
        <button
          onClick={copyAddress}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition"
          title="Copy address"
        >
          {copied ? (
            <Check className="w-5 h-5 text-green-600" />
          ) : (
            <Copy className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          )}
        </button>
        <a
          href={`${wallet.explorer}${wallet.address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition"
          title="View on explorer"
        >
          <ExternalLink className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </a>
      </div>

      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-900 dark:text-blue-200">
          {language === 'en'
            ? '✓ Your donation will be confirmed after 6 blockchain confirmations (~1 hour for BTC)'
            : '✓ Ваш донат будет подтверждён после 6 подтверждений в блокчейне (~1 час для BTC)'}
        </p>
        <p className="text-sm text-blue-900 dark:text-blue-200 mt-2">
          {language === 'en'
            ? '✓ All donations are recorded on blockchain for full transparency'
            : '✓ Все донаты записываются в блокчейн для полной прозрачности'}
        </p>
      </div>
    </div>
  );
}
```

#### Day 3-5: Testing & Deployment

```bash
# Test with testnet first
□ Test with Bitcoin testnet address
□ Send test transaction (0.001 tBTC)
□ Verify transaction detected and recorded
□ Verify email sent
□ Verify statistics updated
□ Verify fund_transparency entry created

# Edge cases
□ Test dust transaction (<0.0001 BTC)
□ Test unconfirmed transaction (should not record)
□ Test double transaction (should not duplicate)
□ Test failed transaction

# Deploy to production
□ Deploy transaction-monitor function
□ Set up cron job (every 5 minutes)
□ Update DonationWidget with real addresses
□ Monitor first 24 hours closely
□ Document troubleshooting procedures
```

---

### Week 3: Security & Impact Stories Setup

#### Day 1-2: Security Hardening

```typescript
// Rate limiting middleware
// src/middleware/rateLimit.ts
const rateLimitCache = new Map<string, { count: number; resetAt: number }>();

export const rateLimit = (maxRequests: number, windowMs: number) => {
  return async (req: Request): Promise<Response | null> => {
    const ip = req.headers.get('x-forwarded-for') ||
               req.headers.get('x-real-ip') ||
               'unknown';
    const now = Date.now();
    const key = `${ip}`;

    const cached = rateLimitCache.get(key);

    if (cached && cached.resetAt > now) {
      if (cached.count >= maxRequests) {
        return new Response(
          JSON.stringify({
            error: 'Too many requests. Please try again later.'
          }),
          {
            status: 429,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      cached.count++;
    } else {
      rateLimitCache.set(key, {
        count: 1,
        resetAt: now + windowMs
      });
    }

    // Cleanup old entries
    if (Math.random() < 0.01) {
      for (const [k, v] of rateLimitCache.entries()) {
        if (v.resetAt < now) {
          rateLimitCache.delete(k);
        }
      }
    }

    return null;
  };
};

// Apply to edge functions
Deno.serve(async (req: Request) => {
  // Rate limit: 10 requests per hour
  const rateLimitResponse = await rateLimit(10, 60 * 60 * 1000)(req);
  if (rateLimitResponse) return rateLimitResponse;

  // ... rest of function
});
```

#### Day 3-5: Impact Stories Database

```sql
-- supabase/migrations/20260119_create_impact_stories.sql

/*
  # Create Impact Stories System

  1. New Tables
    - `impact_stories`
      - Multi-language content (EN/RU/HE)
      - Patient information (anonymized)
      - Treatment outcomes
      - Family testimonials
      - Image galleries
      - Consent tracking

  2. Security
    - Enable RLS
    - Only published stories with consent are public
    - Service role can insert/update
*/

CREATE TABLE IF NOT EXISTS impact_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Multi-language titles
  title_en text NOT NULL,
  title_ru text NOT NULL,
  title_he text,

  -- Patient info (anonymized)
  patient_age integer CHECK (patient_age >= 0 AND patient_age <= 120),
  patient_initial text NOT NULL,
  diagnosis text NOT NULL,
  diagnosis_date date,

  -- Treatment summary
  treatment_summary_en text NOT NULL,
  treatment_summary_ru text NOT NULL,
  treatment_summary_he text,

  -- Outcome
  outcome text CHECK (outcome IN (
    'in_remission',
    'ongoing_treatment',
    'completed_treatment',
    'palliative_care'
  )),
  outcome_date date,

  -- Family testimonial
  family_quote_en text,
  family_quote_ru text,
  family_quote_he text,
  family_member_relation text,

  -- Media
  images text[],
  video_url text,

  -- Publishing
  consent_obtained boolean DEFAULT false NOT NULL,
  consent_document_url text,
  published_at timestamptz,
  featured boolean DEFAULT false,
  featured_order integer,

  -- Metadata
  hospital_name text,
  research_program text,

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_impact_stories_published
  ON impact_stories(published_at DESC)
  WHERE published_at IS NOT NULL AND consent_obtained = true;

CREATE INDEX IF NOT EXISTS idx_impact_stories_featured
  ON impact_stories(featured_order)
  WHERE featured = true;

-- RLS
ALTER TABLE impact_stories ENABLE ROW LEVEL SECURITY;

-- Public can read published stories with consent
CREATE POLICY "Public can view published stories with consent"
  ON impact_stories
  FOR SELECT
  USING (
    published_at IS NOT NULL
    AND published_at <= now()
    AND consent_obtained = true
  );

-- Service role can do everything (admin operations)
CREATE POLICY "Service role full access"
  ON impact_stories
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_impact_stories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER impact_stories_updated_at
  BEFORE UPDATE ON impact_stories
  FOR EACH ROW
  EXECUTE FUNCTION update_impact_stories_updated_at();
```

---

### Week 4: Impact Stories UI

```typescript
// src/components/ImpactStoryCard.tsx
import { Calendar, Heart, Stethoscope } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ImpactStory {
  id: string;
  title: string;
  patientAge: number;
  patientInitial: string;
  diagnosis: string;
  treatmentSummary: string;
  outcome: string;
  familyQuote?: string;
  familyMemberRelation?: string;
  images: string[];
  publishedAt: Date;
  hospitalName?: string;
  researchProgram?: string;
}

export default function ImpactStoryCard({ story }: { story: ImpactStory }) {
  const { language } = useLanguage();

  const outcomeLabels = {
    in_remission: {
      en: 'In Remission',
      ru: 'В ремиссии',
      color: 'green'
    },
    ongoing_treatment: {
      en: 'Ongoing Treatment',
      ru: 'Продолжается лечение',
      color: 'blue'
    },
    completed_treatment: {
      en: 'Treatment Completed',
      ru: 'Лечение завершено',
      color: 'teal'
    },
    palliative_care: {
      en: 'Palliative Care',
      ru: 'Паллиативная помощь',
      color: 'purple'
    }
  };

  const outcome = outcomeLabels[story.outcome as keyof typeof outcomeLabels];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
      {/* Hero Image */}
      <div className="relative h-64 bg-gradient-to-br from-blue-100 to-purple-100">
        {story.images[0] ? (
          <img
            src={story.images[0]}
            alt={story.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Heart className="w-24 h-24 text-blue-400 opacity-50" />
          </div>
        )}

        {/* Outcome Badge */}
        <div
          className={`absolute top-4 right-4 px-4 py-2 bg-${outcome.color}-500 bg-opacity-90 text-white rounded-full text-sm font-semibold`}
        >
          {outcome[language]}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {story.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <span className="font-semibold">{story.patientInitial}</span>
            <span>•</span>
            <span>{story.patientAge} years old</span>
          </p>
        </div>

        {/* Diagnosis */}
        <div className="flex items-start gap-3 mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Stethoscope className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1" />
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Diagnosis
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {story.diagnosis}
            </p>
          </div>
        </div>

        {/* Treatment Summary */}
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          {story.treatmentSummary}
        </p>

        {/* Family Quote */}
        {story.familyQuote && (
          <blockquote className="border-l-4 border-blue-500 pl-4 mb-6 italic text-gray-600 dark:text-gray-400">
            <p className="mb-2">"{story.familyQuote}"</p>
            {story.familyMemberRelation && (
              <footer className="text-sm text-gray-500 dark:text-gray-500">
                —{' '}
                {story.familyMemberRelation.charAt(0).toUpperCase() +
                  story.familyMemberRelation.slice(1)}
              </footer>
            )}
          </blockquote>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            {story.hospitalName && (
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>{story.hospitalName}</span>
              </div>
            )}

            {story.researchProgram && (
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded text-xs font-semibold">
                  TYT-Funded
                </span>
                <span>{story.researchProgram}</span>
              </div>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <Calendar className="w-4 h-4" />
              <span>{story.publishedAt.toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// src/components/ImpactStoriesGrid.tsx
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import ImpactStoryCard from './ImpactStoryCard';

export default function ImpactStoriesGrid() {
  const { language } = useLanguage();
  const [stories, setStories] = useState<ImpactStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'featured'>('all');

  useEffect(() => {
    loadStories();
  }, [filter, language]);

  const loadStories = async () => {
    setLoading(true);

    let query = supabase
      .from('impact_stories')
      .select('*')
      .order('published_at', { ascending: false });

    if (filter === 'featured') {
      query = query.eq('featured', true).order('featured_order');
    }

    const { data, error } = await query;

    if (!error && data) {
      const transformed = data.map(story => ({
        id: story.id,
        title: story[`title_${language}`] || story.title_en,
        patientAge: story.patient_age,
        patientInitial: story.patient_initial,
        diagnosis: story.diagnosis,
        treatmentSummary:
          story[`treatment_summary_${language}`] || story.treatment_summary_en,
        outcome: story.outcome,
        familyQuote: story[`family_quote_${language}`] || story.family_quote_en,
        familyMemberRelation: story.family_member_relation,
        images: story.images || [],
        publishedAt: new Date(story.published_at),
        hospitalName: story.hospital_name,
        researchProgram: story.research_program
      }));

      setStories(transformed);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      {/* Filter */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`px-6 py-2 rounded-lg transition ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
          }`}
        >
          All Stories
        </button>
        <button
          onClick={() => setFilter('featured')}
          className={`px-6 py-2 rounded-lg transition ${
            filter === 'featured'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
          }`}
        >
          Featured
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stories.map(story => (
          <ImpactStoryCard key={story.id} story={story} />
        ))}
      </div>

      {stories.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-lg">No stories available yet.</p>
          <p className="text-sm mt-2">
            Check back soon for inspiring patient stories.
          </p>
        </div>
      )}
    </div>
  );
}
```

**Integration:**
```tsx
// In FoundationPage.tsx, add new tab:
<Tab id="impact" label={tr('impactStories', language)}>
  <ImpactStoriesGrid />
</Tab>
```

---

## PHASE 2: CONTENT & COMMUNITY (Weeks 5-8)

### Week 5-6: Knowledge Base Expansion

**Goal:** Add 15 CNS + 10 Web3 articles, generate embeddings, test aOi

#### CNS Articles to Add (15 total)

**Advanced Treatment Protocols (5):**
1. "Proton Therapy vs Traditional Radiation for Medulloblastoma"
2. "Combination Chemotherapy Protocols for Group 3 MB"
3. "Surgical Approaches for Posterior Fossa Tumors"
4. "Targeted Therapy for SHH Medulloblastoma"
5. "Clinical Trials: Phase I, II, III Explained"

**Clinical Trial Information (5):**
6. "How to Enroll in a Clinical Trial"
7. "Understanding Informed Consent"
8. "What to Expect During a Clinical Trial"
9. "Placebo Groups in Pediatric Oncology Trials"
10. "Your Rights as a Trial Participant"

**Family Support Resources (5):**
11. "Emotional Support for Parents of Children with Cancer"
12. "Financial Assistance Programs for Medical Expenses"
13. "School Coordination During Treatment"
14. "Sibling Support: Helping Other Children in the Family"
15. "Long-term Follow-up Care After Treatment"

**Sources:**
- PubMed (peer-reviewed)
- NIH/NCI (official guidelines)
- St. Jude Research Hospital publications
- Dana-Farber resources
- WHO pediatric oncology guidelines

#### Web3 Articles to Add (10 total)

**DeSci Focus (5):**
1. "What is Decentralized Science (DeSci)?"
2. "IP-NFTs: Intellectual Property on the Blockchain"
3. "DAO Governance for Research Funding"
4. "Quadratic Funding Explained Simply"
5. "Research Data Marketplaces"

**Token Economics (3):**
6. "What is Token Burn and Why It Matters"
7. "Utility Tokens vs Governance Tokens"
8. "How Tokenomics Drives Charity Funding"

**Blockchain Transparency (2):**
9. "Public Ledgers for Non-Profit Transparency"
10. "Multi-Signature Wallets Explained"

**Implementation:**
```bash
# Step 1: Write articles in Markdown
□ Create docs/knowledge/cns/new-articles/
□ Write 15 CNS articles (EN + RU)
□ Get medical review/approval
□ Translate to Russian
□ Calculate trustworthiness scores

# Step 2: Insert into database
□ Run script: npm run add-knowledge-articles
□ Verify articles inserted correctly
□ Check RLS policies working

# Step 3: Generate embeddings
□ Run: supabase functions invoke batch-generate-embeddings
□ Verify embeddings generated (1536d vectors)
□ Check HNSW indexes updated

# Step 4: Test aOi
□ Run 50 test queries
□ Measure accuracy (target: 95%+)
□ Refine prompts if needed
□ Document query types that work best
```

---

### Week 7: Partner Clinics Showcase

**Components:**
- PartnerClinicCard.tsx
- PartnerClinicsGrid.tsx

**Data:**
Add 10 partner clinic profiles to database:
1. Dana-Farber Cancer Institute (USA)
2. St. Jude Children's Research Hospital (USA)
3. German Cancer Research Center (Germany)
4. Princess Máxima Center (Netherlands)
5. Children's Hospital of Philadelphia (USA)
6. Hadassah Medical Center (Israel)
7. Hospital for Sick Children (Canada)
8. Royal Children's Hospital Melbourne (Australia)
9. Great Ormond Street Hospital (UK)
10. Gustave Roussy (France)

---

### Week 8-9: Volunteer Portal

**Database tables:**
- volunteer_opportunities
- volunteer_applications
- volunteer_hours
- volunteer_badges

**Pages:**
- /volunteer - Browse opportunities
- /volunteer/apply - Application form
- /volunteer/dashboard - Volunteer portal (for approved)

---

## PHASE 3: ENGAGEMENT (Weeks 10-11)

### Week 10-11: Blog & Newsletter

**Blog system:**
- foundation_blog_posts table
- BlogPostPage component
- Blog grid/list
- Simple admin CMS

**Newsletter:**
- newsletter_subscribers table
- NewsletterSubscribe widget
- Monthly email template
- Confirmation workflow

---

## PHASE 4: POLISH & LAUNCH (Week 12)

### Week 12: Final Polish

```bash
□ Privacy Policy page
□ Cookie Consent banner
□ Terms of Service
□ Performance optimization (bundle < 400kB)
□ Security audit (external)
□ Load testing (100+ concurrent users)
□ Mobile responsiveness verification
□ Cross-browser testing
□ Beta tester recruitment (50 users)
□ Documentation finalization
□ Launch announcement prep
```

---

## 📊 CONTENT EXPANSION TARGETS

### CNS Knowledge (Current: 66 → Target: 200+)

**12-Month Plan:**
- Q1 2026: +40 articles → 106 total
- Q2 2026: +40 articles → 146 total
- Q3 2026: +30 articles → 176 total
- Q4 2026: +24 articles → 200 total

**Sources:**
- PubMed (peer-reviewed) - 52%
- NIH/NCI (official guidelines) - 24%
- WHO (international standards) - 14%
- Clinical trials registries - 6%
- Curated reviews - 4%

**Quality Standards:**
- Trustworthiness ≥ 85/100
- Published within 5 years (treatment protocols)
- Multi-language (EN + RU, HE summaries)
- Medical disclaimer on all

### Web3 Knowledge (Current: 39 → Target: 100+)

**12-Month Plan:**
- Q1 2026: +21 articles → 60 total
- Q2 2026: +20 articles → 80 total
- Q3 2026: +15 articles → 95 total
- Q4 2026: +5 articles → 100 total

**Topics:**
- DeFi & DAO (25 articles)
- NFT Technology (20 articles)
- Blockchain Security (20 articles)
- DeSci Movement (20 articles)
- Tokenomics (15 articles)

---

## ✅ SUCCESS METRICS

### Week 4 Checkpoint
```
✅ Donations: Real system operational, first 5 donations processed
✅ Impact Stories: 5+ published with family consent
✅ Security: A+ grade maintained (96+/100)
✅ Knowledge: Embeddings 100% coverage
```

### Week 8 Checkpoint
```
✅ Content: 80+ CNS, 50+ Web3 articles
✅ aOi: 95%+ accuracy on test queries
✅ Volunteers: Portal live, 10+ applications
✅ Partners: 10+ clinic profiles displayed
```

### Week 12 (Beta Launch)
```
✅ All P0 features complete
✅ Privacy/GDPR compliant
✅ Security audit passed
✅ 50+ beta testers recruited
✅ First $10,000 in donations
✅ 100% uptime for 2 weeks
✅ Documentation complete
```

---

## 🎯 IMMEDIATE NEXT ACTIONS

### This Week (Week 1):
1. Generate real crypto wallet addresses (BTC, ETH, USDT, TON, SOL)
2. Set up secure key storage (hardware wallet)
3. Generate QR codes and upload to Supabase Storage
4. Create transaction-monitor edge function
5. Test donation flow on testnet

### This Month (Weeks 1-4):
1. Launch real donation system with crypto monitoring
2. Implement impact stories system with UI
3. Add security hardening (rate limiting, bot protection)
4. Add 15 new CNS articles with embeddings
5. Test aOi accuracy with expanded knowledge

### This Quarter (Weeks 1-12):
1. Complete all P0 and P1 features
2. Launch volunteer portal and onboard 20+ volunteers
3. Launch foundation blog with 10+ posts
4. Expand knowledge base to 80+ CNS, 50+ Web3 articles
5. Process $25,000+ in donations
6. Publish 10+ impact stories
7. **BETA LAUNCH**

---

## 📝 WEEKLY TRACKING TEMPLATE

```markdown
## Week X Progress (Date)

### Completed ✅
- [ ] Task 1
- [ ] Task 2

### In Progress 🔄
- [ ] Task 3 (75% done, ETA: 2 days)

### Blocked 🚫
- [ ] Task 4 (waiting for: X)

### Metrics
- Donations: $X (X donations)
- New articles: X (X CNS, X Web3)
- Volunteers: X applications
- aOi queries: X
- Website visits: X

### Next Week Plan
1. Priority 1 task
2. Priority 2 task
3. Testing/review
```

---

## 🔒 SECURITY CHECKLIST

**Weekly:**
```bash
□ Review audit logs for suspicious activity
□ Check new tables have RLS policies
□ Run npm audit and fix vulnerabilities
□ Backup database
□ Monitor donation transactions
```

**Monthly:**
```bash
□ Security audit (automated scan)
□ Review user permissions
□ Update dependencies
□ Test disaster recovery
```

---

## 📚 DOCUMENTATION REQUIREMENTS

**User Docs:**
- Getting Started Guide
- Donation Guide (how to send crypto)
- Volunteer Guide
- FAQ
- Troubleshooting

**Developer Docs:**
- Architecture Overview
- Database Schema (ER diagram)
- API Reference
- Edge Functions Guide
- Deployment Guide

**Admin Docs:**
- Content Moderation Guide
- Volunteer Management
- Donation Reconciliation
- Security Incident Response

---

## 🎉 CONCLUSION

This roadmap provides a **clear 12-week path** from current state (85/100) to beta launch (95+/100).

**Core Principles:**
1. **Security First** - No compromises on safety
2. **Quality Over Quantity** - Verified content only
3. **Community-Driven** - Volunteers as partners
4. **Transparent** - Blockchain-backed reporting
5. **Mission-Focused** - Every feature supports research

**Remember:** The goal is to create a **trusted platform** that genuinely advances pediatric brain cancer research through Web3 technology.

---

**Document Version**: 2.0
**Last Updated**: 16 January 2026, 18:00 UTC
**Next Review**: After Week 4 completion
**Status**: Trust Layer Complete, Moving to Content & Features

---

**Related Documents:**
- [PROJECT_STATUS_REPORT.md](PROJECT_STATUS_REPORT.md) - Full status analysis
- [FOUNDATION_TRUST_LAYER_COMPLETE.md](FOUNDATION_TRUST_LAYER_COMPLETE.md) - Trust layer implementation
- [FOUNDATION_TRUST_LAYER_STATUS.md](FOUNDATION_TRUST_LAYER_STATUS.md) - B0-B6 compliance status
