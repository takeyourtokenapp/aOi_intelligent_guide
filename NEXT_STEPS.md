# TYT.FOUNDATION - Implementation Roadmap & Next Steps

> **Created**: 12 января 2026
> **Focus**: tyt.foundation infrastructure, content, and functionality
> **Timeline**: 16 weeks to full production launch
> **Current Status**: 78/100 complete

---

## 🎯 EXECUTIVE SUMMARY

This document provides a **structured, step-by-step implementation plan** for all unrealized components and features of **tyt.foundation**.

### Current State
- ✅ **Architecture**: Foundation-first design complete
- ✅ **Database**: 13 foundation tables with RLS (100% secure)
- ✅ **Content**: 61 CNS articles + 34 Web3 articles
- ✅ **Pages**: 5 foundation pages operational
- ✅ **aOi**: RAG system functional with 121 articles
- 🔴 **Donations**: UI ready, backend missing
- 🔴 **Impact Stories**: Not implemented
- 🔴 **Volunteer Portal**: Not started
- 🔴 **Blog**: Not implemented

### Goals (Next 16 Weeks)
1. **Launch fully functional donation system** (crypto + fiat)
2. **Implement impact stories** to showcase foundation's work
3. **Expand knowledge base** to 150+ articles (CNS + Web3)
4. **Build volunteer portal** for community engagement
5. **Create foundation blog** for updates and research news
6. **Achieve 95/100 completion** for production beta launch

### Success Metrics
- 📊 **Donations Processing**: Real crypto donations accepted and tracked
- 📚 **Content Growth**: 150+ vetted articles with embeddings
- 🎓 **aOi Training**: 95%+ accuracy on foundation queries
- 💙 **Impact**: 20+ published impact stories
- 🤝 **Community**: 50+ active volunteers
- 🔒 **Security**: A+ grade maintained (96+/100)

---

## 📋 PRIORITY CLASSIFICATION

### P0 - Critical (Blocks Beta Launch)
These features MUST be implemented before public beta:

1. **Real Donation Processing** (Weeks 1-2)
   - Crypto wallets (BTC, ETH, USDT, TON, SOL)
   - Transaction monitoring
   - Confirmation emails
   - Statistics updates

2. **Foundation Security Hardening** (Week 3)
   - Rate limiting on all endpoints
   - Bot protection on forms
   - Email enumeration prevention
   - Audit log system

### P1 - High Priority (Required for Full Launch)
Essential for complete foundation functionality:

3. **Impact Stories System** (Weeks 3-4)
   - Database schema
   - UI components
   - Admin approval workflow
   - Multi-language support

4. **Knowledge Base Expansion** (Weeks 5-6)
   - 50 new CNS articles
   - 20 new Web3 articles
   - Hebrew translations
   - Quality control system

5. **Partner Clinics Showcase** (Week 7)
   - UI for partner_clinics table
   - Clinic cards with details
   - Partnership types display

### P2 - Medium Priority (Enhances User Experience)
Important for growth and engagement:

6. **Volunteer Portal** (Weeks 8-9)
   - Opportunity listings
   - Application system
   - Volunteer dashboard
   - Impact tracking

7. **Foundation Blog** (Weeks 10-11)
   - Database schema
   - Blog post UI
   - Admin CMS
   - SEO optimization

8. **Newsletter System** (Week 11)
   - Email subscription
   - Monthly newsletter template
   - Resend integration

### P3 - Nice-to-Have (Post-Launch)
Future enhancements:

9. **Events Calendar** (Week 12)
10. **Annual Report Generator** (Weeks 13-14)
11. **Advanced Analytics Dashboard** (Weeks 15-16)

---

## 🚀 IMPLEMENTATION PHASES

## PHASE 1: CRITICAL INFRASTRUCTURE (Weeks 1-3)

### Week 1: Donation System - Backend Setup

**Goal**: Set up crypto wallet infrastructure and transaction monitoring

#### Day 1: Wallet Setup
```bash
# Task 1.1: Generate mainnet wallet addresses
□ Generate Bitcoin mainnet address (bc1q...)
□ Generate Ethereum address (0x...)
□ Generate USDT addresses (ETH + Tron)
□ Generate TON wallet address (EQ...)
□ Generate Solana address

# Task 1.2: Security setup
□ Store private keys in Supabase Vault
□ Set up hardware wallet backup (Ledger/Trezor)
□ Create multisig setup (3-of-5) for large amounts
□ Document recovery procedures
```

**Technical Details**:
```typescript
// supabase/functions/wallet-manager/index.ts
interface FoundationWallet {
  network: 'btc' | 'eth' | 'usdt_eth' | 'usdt_tron' | 'ton' | 'sol';
  address: string;
  qr_code_url: string;
  monitoring_enabled: boolean;
  last_checked: Date;
}

const FOUNDATION_WALLETS: FoundationWallet[] = [
  {
    network: 'btc',
    address: process.env.FOUNDATION_BTC_ADDRESS!,
    qr_code_url: '/qr/btc.png',
    monitoring_enabled: true,
    last_checked: new Date()
  },
  // ... other wallets
];
```

#### Day 2: QR Code Generation
```bash
# Task 1.3: Generate QR codes
□ Install qrcode library
□ Generate QR for each wallet address
□ Store in Supabase Storage
□ Add to DonationWidget component
```

**Implementation**:
```typescript
// src/services/qrGenerator.ts
import QRCode from 'qrcode';

export const generateWalletQR = async (
  network: string,
  address: string
): Promise<string> => {
  const qrDataUrl = await QRCode.toDataURL(address, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    width: 512,
    margin: 2
  });

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('foundation-assets')
    .upload(`qr/${network}.png`, qrDataUrl, {
      contentType: 'image/png',
      upsert: true
    });

  if (error) throw error;
  return data.path;
};
```

#### Day 3-4: Transaction Monitoring Setup
```bash
# Task 1.4: Choose monitoring solution
□ Option A: Blocknative (recommended, but paid)
□ Option B: Alchemy Notify (free tier available)
□ Option C: Simple polling (free, DIY)
□ Option D: Manual checking (MVP fallback)

# Task 1.5: Implement chosen solution
□ Set up webhook endpoints
□ Create transaction_monitor edge function
□ Test with testnet transactions
□ Configure confirmations threshold (6 for BTC, 12 for ETH)
```

**Option C Implementation (Simple Polling)**:
```typescript
// supabase/functions/transaction-monitor/index.ts
import { createClient } from '@supabase/supabase-js';

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  confirmations: number;
  timestamp: Date;
}

const checkBitcoinWallet = async (address: string): Promise<Transaction[]> => {
  const response = await fetch(
    `https://blockchain.info/rawaddr/${address}`
  );
  const data = await response.json();

  return data.txs
    .filter(tx => tx.out.some(out => out.addr === address))
    .map(tx => ({
      hash: tx.hash,
      from: tx.inputs[0].prev_out.addr,
      to: address,
      value: tx.out.find(out => out.addr === address).value / 100000000,
      confirmations: tx.block_height
        ? data.n_tx - tx.block_index
        : 0,
      timestamp: new Date(tx.time * 1000)
    }));
};

Deno.serve(async (req: Request) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // Check all wallets
  const btcTxs = await checkBitcoinWallet(
    Deno.env.get('FOUNDATION_BTC_ADDRESS')!
  );

  // Process new transactions
  for (const tx of btcTxs) {
    if (tx.confirmations >= 6) {
      // Check if already recorded
      const { data: existing } = await supabase
        .from('foundation_donations')
        .select('id')
        .eq('blockchain_hash', tx.hash)
        .maybeSingle();

      if (!existing) {
        // Record new donation
        await supabase.from('foundation_donations').insert({
          amount: tx.value,
          currency: 'BTC',
          blockchain_hash: tx.hash,
          status: 'completed',
          donor_wallet: tx.from,
          confirmed_at: new Date()
        });

        // Update statistics
        await updateFoundationStats('BTC', tx.value);

        // Send confirmation email (if email provided)
        await sendDonationConfirmation(tx);
      }
    }
  }

  return new Response(JSON.stringify({ checked: btcTxs.length }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

#### Day 5: Email Notifications
```bash
# Task 1.6: Set up email service
□ Configure Resend API key in Supabase
□ Create donation confirmation template
□ Create tax receipt template (for $250+)
□ Test email sending
```

**Email Template**:
```typescript
// src/lib/emailTemplates.ts
export const donationConfirmationEmail = (
  amount: number,
  currency: string,
  txHash: string,
  donorEmail?: string
) => ({
  to: donorEmail || 'donors@tyt.foundation',
  subject: `Thank you for your ${amount} ${currency} donation`,
  html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>Thank You for Your Donation! 💙</h1>
      <p>Your generous donation has been received and confirmed.</p>

      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
        <p><strong>Amount:</strong> ${amount} ${currency}</p>
        <p><strong>Transaction Hash:</strong>
          <a href="https://blockchain.info/tx/${txHash}">${txHash.slice(0, 16)}...</a>
        </p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>

      <p>Your contribution will directly support pediatric brain cancer research.</p>

      <p>With gratitude,<br>TYT Foundation Team</p>
    </div>
  `
});
```

---

### Week 2: Donation System - Frontend & Testing

#### Day 1-2: Update DonationWidget Component
```bash
# Task 2.1: Connect to real wallets
□ Update DonationWidget with real addresses
□ Display QR codes from storage
□ Add copy-to-clipboard functionality
□ Add transaction status checking
```

**Updated Component**:
```typescript
// src/components/DonationWidget.tsx
import { useState, useEffect } from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const WALLETS = {
  BTC: { address: 'bc1q...', explorer: 'https://blockchain.info/address/' },
  ETH: { address: '0x...', explorer: 'https://etherscan.io/address/' },
  USDT_ETH: { address: '0x...', explorer: 'https://etherscan.io/address/' },
  TON: { address: 'EQ...', explorer: 'https://tonscan.org/address/' },
  SOL: { address: '...', explorer: 'https://solscan.io/account/' }
};

export default function DonationWidget() {
  const [selectedCrypto, setSelectedCrypto] = useState<keyof typeof WALLETS>('BTC');
  const [copied, setCopied] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');

  useEffect(() => {
    // Load QR code from storage
    const loadQR = async () => {
      const { data } = await supabase.storage
        .from('foundation-assets')
        .getPublicUrl(`qr/${selectedCrypto.toLowerCase()}.png`);

      setQrCode(data.publicUrl);
    };
    loadQR();
  }, [selectedCrypto]);

  const copyAddress = () => {
    navigator.clipboard.writeText(WALLETS[selectedCrypto].address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="donation-widget bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-2xl font-bold mb-4">Support Our Mission</h3>

      {/* Crypto selector */}
      <div className="flex gap-2 mb-4">
        {Object.keys(WALLETS).map(crypto => (
          <button
            key={crypto}
            onClick={() => setSelectedCrypto(crypto as keyof typeof WALLETS)}
            className={`px-4 py-2 rounded ${
              selectedCrypto === crypto
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200'
            }`}
          >
            {crypto.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* QR Code */}
      <div className="text-center mb-4">
        {qrCode && (
          <img
            src={qrCode}
            alt={`${selectedCrypto} QR Code`}
            className="w-64 h-64 mx-auto"
          />
        )}
      </div>

      {/* Address with copy button */}
      <div className="flex items-center gap-2 bg-gray-100 p-3 rounded">
        <code className="flex-1 text-sm break-all">
          {WALLETS[selectedCrypto].address}
        </code>
        <button
          onClick={copyAddress}
          className="p-2 hover:bg-gray-200 rounded"
        >
          {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
        </button>
        <a
          href={`${WALLETS[selectedCrypto].explorer}${WALLETS[selectedCrypto].address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:bg-gray-200 rounded"
        >
          <ExternalLink className="w-5 h-5" />
        </a>
      </div>

      <p className="text-sm text-gray-600 mt-4">
        Your donation will be confirmed after 6 blockchain confirmations.
        You'll receive a confirmation email with your tax receipt.
      </p>
    </div>
  );
}
```

#### Day 3: Fiat Payment Integration (Optional)
```bash
# Task 2.2: Add credit card donations
□ Set up Stripe account (or similar)
□ Create checkout session endpoint
□ Add card payment option to widget
□ Test with Stripe test cards
```

#### Day 4-5: Testing & Deployment
```bash
# Task 2.3: Full testing cycle
□ Test with testnet wallets first
□ Test transaction monitoring (6+ confirmations)
□ Test email notifications
□ Test statistics updates
□ Test edge cases (dust transactions, failed txs)

# Task 2.4: Deploy to production
□ Deploy transaction-monitor function
□ Set up cron job (every 5 minutes)
□ Monitor first 24 hours closely
□ Document troubleshooting procedures
```

**Cron Setup**:
```sql
-- Schedule transaction monitoring
SELECT cron.schedule(
  'monitor-donations',
  '*/5 * * * *',  -- Every 5 minutes
  $$
  SELECT net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/transaction-monitor',
    headers := '{"Authorization": "Bearer ' || current_setting('app.service_role_key') || '"}'
  );
  $$
);
```

---

### Week 3: Security Hardening & Impact Stories Setup

#### Day 1-2: Security Improvements
```bash
# Task 3.1: Rate limiting
□ Install rate-limit middleware
□ Apply to all API endpoints
□ Apply to contact form (10 req/hour per IP)
□ Apply to donation endpoints

# Task 3.2: Bot protection
□ Add hCaptcha to contact form
□ Add honeypot fields
□ Implement email verification for donations

# Task 3.3: Email enumeration prevention
□ Always return same message for login/signup
□ Add random delays to responses
□ Log suspicious patterns
```

**Rate Limiting Implementation**:
```typescript
// src/middleware/rateLimit.ts
import { createClient } from '@supabase/supabase-js';

const rateLimitCache = new Map<string, { count: number; resetAt: number }>();

export const rateLimit = (maxRequests: number, windowMs: number) => {
  return async (req: Request): Promise<Response | null> => {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();

    const cached = rateLimitCache.get(ip);

    if (cached && cached.resetAt > now) {
      if (cached.count >= maxRequests) {
        return new Response(
          JSON.stringify({ error: 'Too many requests' }),
          { status: 429 }
        );
      }
      cached.count++;
    } else {
      rateLimitCache.set(ip, { count: 1, resetAt: now + windowMs });
    }

    return null; // Allow request
  };
};
```

#### Day 3-5: Impact Stories Database & Schema
```bash
# Task 3.4: Create database migration
□ Write migration for impact_stories table
□ Add RLS policies
□ Create indexes
□ Test with sample data
```

**Migration File**:
```sql
-- supabase/migrations/YYYYMMDD_create_impact_stories.sql

/*
  # Create Impact Stories System

  1. New Tables
    - `impact_stories`
      - Multi-language support (EN/RU/HE)
      - Patient information (anonymized)
      - Treatment outcomes
      - Family testimonials
      - Image galleries
      - Consent tracking

  2. Security
    - Enable RLS
    - Only published stories with consent are public
    - Admin-only write access
*/

CREATE TABLE IF NOT EXISTS impact_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Multi-language titles
  title_en text NOT NULL,
  title_ru text NOT NULL,
  title_he text,

  -- Patient info (anonymized)
  patient_age integer CHECK (patient_age >= 0 AND patient_age <= 120),
  patient_initial text,  -- 'A.B.' instead of full name
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
  family_member_relation text,  -- 'mother', 'father', etc.

  -- Media
  images text[],  -- Array of Storage URLs
  video_url text,

  -- Publishing
  consent_obtained boolean DEFAULT false,
  consent_document_url text,  -- Signed consent form
  published_at timestamptz,
  featured boolean DEFAULT false,
  featured_order integer,

  -- Metadata
  hospital_name text,
  research_program text,  -- Which TYT-funded program helped

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_impact_stories_published ON impact_stories(published_at DESC)
  WHERE published_at IS NOT NULL AND consent_obtained = true;
CREATE INDEX idx_impact_stories_featured ON impact_stories(featured_order)
  WHERE featured = true;

-- RLS Policies
ALTER TABLE impact_stories ENABLE ROW LEVEL SECURITY;

-- Public can read published stories with consent
CREATE POLICY "Public can view published stories with consent"
  ON impact_stories
  FOR SELECT
  USING (
    published_at IS NOT NULL
    AND consent_obtained = true
  );

-- Admins can do everything (to be implemented with auth)
-- For now, no INSERT/UPDATE/DELETE policies (admin-only via service role)

-- Function to update updated_at
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

## PHASE 2: CONTENT & COMMUNITY (Weeks 4-9)

### Week 4: Impact Stories UI Components

#### Day 1-2: ImpactStoryCard Component
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
    in_remission: { en: 'In Remission', ru: 'В ремиссии', color: 'green' },
    ongoing_treatment: { en: 'Ongoing Treatment', ru: 'Продолжается лечение', color: 'blue' },
    completed_treatment: { en: 'Treatment Completed', ru: 'Лечение завершено', color: 'teal' },
    palliative_care: { en: 'Palliative Care', ru: 'Паллиативная помощь', color: 'purple' }
  };

  const outcome = outcomeLabels[story.outcome as keyof typeof outcomeLabels];

  return (
    <div className="impact-story-card bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
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
        <div className={`absolute top-4 right-4 px-4 py-2 bg-${outcome.color}-500 bg-opacity-90 text-white rounded-full text-sm font-semibold`}>
          {outcome[language]}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {story.title}
            </h3>
            <p className="text-gray-600 flex items-center gap-2">
              <span className="font-semibold">{story.patientInitial}</span>
              <span>•</span>
              <span>{story.patientAge} years old</span>
            </p>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="flex items-start gap-3 mb-4 p-3 bg-blue-50 rounded-lg">
          <Stethoscope className="w-5 h-5 text-blue-600 mt-1" />
          <div>
            <p className="text-sm text-gray-600 mb-1">Diagnosis</p>
            <p className="font-semibold text-gray-900">{story.diagnosis}</p>
          </div>
        </div>

        {/* Treatment Summary */}
        <p className="text-gray-700 leading-relaxed mb-6">
          {story.treatmentSummary}
        </p>

        {/* Family Quote */}
        {story.familyQuote && (
          <blockquote className="border-l-4 border-blue-500 pl-4 mb-6 italic text-gray-600">
            <p className="mb-2">"{story.familyQuote}"</p>
            {story.familyMemberRelation && (
              <footer className="text-sm text-gray-500">
                — {story.familyMemberRelation.charAt(0).toUpperCase() + story.familyMemberRelation.slice(1)}
              </footer>
            )}
          </blockquote>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {story.hospitalName && (
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>{story.hospitalName}</span>
              </div>
            )}

            {story.researchProgram && (
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-semibold">
                  TYT-Funded
                </span>
                <span>{story.researchProgram}</span>
              </div>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <Calendar className="w-4 h-4" />
              <span>{new Date(story.publishedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### Day 3-4: ImpactStoriesGrid & Service
```typescript
// src/components/ImpactStoriesGrid.tsx
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import ImpactStoryCard from './ImpactStoryCard';
import { Loader2 } from 'lucide-react';

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
      // Transform data based on language
      const transformed = data.map(story => ({
        id: story.id,
        title: story[`title_${language}`] || story.title_en,
        patientAge: story.patient_age,
        patientInitial: story.patient_initial,
        diagnosis: story.diagnosis,
        treatmentSummary: story[`treatment_summary_${language}`] || story.treatment_summary_en,
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
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Stories ({stories.length})
        </button>
        <button
          onClick={() => setFilter('featured')}
          className={`px-6 py-2 rounded-lg transition ${
            filter === 'featured'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No stories available yet.</p>
          <p className="text-sm mt-2">Check back soon for inspiring patient stories.</p>
        </div>
      )}
    </div>
  );
}
```

#### Day 5: Integration & Demo Data
```bash
# Task 4.1: Add Impact tab to FoundationPage
□ Update FoundationPage tabs
□ Add ImpactStoriesGrid component
□ Test navigation

# Task 4.2: Create 5 demo stories
□ Write compelling patient stories (anonymized)
□ Get stock photos from Pexels
□ Translate to Russian
□ Insert into database
```

**Demo Data Script**:
```sql
-- Sample impact stories (anonymized, fictional but realistic)
INSERT INTO impact_stories (
  title_en, title_ru,
  patient_age, patient_initial,
  diagnosis, diagnosis_date,
  treatment_summary_en, treatment_summary_ru,
  outcome,
  family_quote_en, family_quote_ru,
  family_member_relation,
  images,
  hospital_name,
  research_program,
  consent_obtained, published_at, featured, featured_order
) VALUES
(
  'Emma''s Journey to Remission',
  'Путь Эммы к ремиссии',
  7, 'E.M.',
  'Medulloblastoma (Group 3)',
  '2023-03-15',
  'Emma was diagnosed at age 6 with an aggressive medulloblastoma. Thanks to the advanced targeted therapy protocol developed through TYT Foundation-funded research, she completed treatment in 14 months and has been in remission for over a year.',
  'Эмме было 6 лет, когда ей диагностировали агрессивную медуллобластому. Благодаря передовому протоколу целевой терапии, разработанному в рамках исследований, финансируемых Фондом TYT, она завершила лечение за 14 месяцев и уже более года находится в ремиссии.',
  'in_remission',
  'We were told she had months to live. Today, she''s back in school, dancing, and dreaming of becoming a doctor. TYT Foundation gave us hope when we had none.',
  'Нам сказали, что ей осталось жить несколько месяцев. Сегодня она снова в школе, танцует и мечтает стать врачом. Фонд TYT дал нам надежду, когда её не было.',
  'mother',
  ARRAY['https://images.pexels.com/photos/8612977/pexels-photo-8612977.jpeg'],
  'Dana-Farber Cancer Institute',
  'Group 3 MB Targeted Therapy Trial',
  true, now() - interval '2 months', true, 1
),
(
  'Liam''s Fight Against DIPG',
  'Борьба Лиама с DIPG',
  9, 'L.K.',
  'Diffuse Intrinsic Pontine Glioma (DIPG)',
  '2024-01-10',
  'Liam is enrolled in an experimental immunotherapy trial funded by TYT Foundation. While DIPG remains one of the most challenging diagnoses, the treatment has stabilized his condition and given his family precious time together.',
  'Лиам участвует в экспериментальном испытании иммунотерапии, финансируемом Фондом TYT. Хотя DIPG остаётся одним из самых сложных диагнозов, лечение стабилизировало его состояние и дало семье драгоценное время вместе.',
  'ongoing_treatment',
  'Every day with Liam is a gift. TYT''s research gave us hope and more importantly, more days to love our son.',
  'Каждый день с Лиамом — это подарок. Исследования TYT дали нам надежду и, что важнее всего, больше дней, чтобы любить нашего сына.',
  'father',
  ARRAY['https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg'],
  'St. Jude Children''s Research Hospital',
  'DIPG Immunotherapy Phase II',
  true, now() - interval '1 month', true, 2
),
(
  'Sarah''s Success Story',
  'История успеха Сары',
  14, 'S.T.',
  'Ependymoma',
  '2022-08-20',
  'Sarah underwent surgery followed by proton therapy, a precision treatment made possible through TYT-funded equipment grants. She completed treatment 18 months ago and has shown no signs of recurrence.',
  'Сара перенесла операцию с последующей протонной терапией — высокоточным методом лечения, ставшим возможным благодаря грантам на оборудование от Фонда TYT. Она завершила лечение 18 месяцев назад, и признаков рецидива нет.',
  'completed_treatment',
  'Sarah is back to playing soccer and getting straight A''s. We''ll forever be grateful to TYT Foundation.',
  'Сара вернулась к игре в футбол и учится на отлично. Мы навсегда благодарны Фонду TYT.',
  'mother',
  ARRAY['https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg'],
  'Massachusetts General Hospital',
  'Proton Therapy Equipment Grant',
  true, now() - interval '3 months', true, 3
);
```

---

### Week 5-6: Knowledge Base Expansion

**Goal**: Add 70 new articles (50 CNS + 20 Web3), generate embeddings, improve aOi accuracy

#### Week 5 Tasks
```bash
# Task 5.1: Research & curate 50 CNS articles
□ Clinical trial phases & protocols (10 articles)
□ Treatment options & side effects (10 articles)
□ Support resources for families (10 articles)
□ Latest research breakthroughs (10 articles)
□ Survivor stories & recovery (10 articles)

# Task 5.2: Add articles to knowledge_base table
□ Use trusted sources only (PubMed, NIH, WHO)
□ Calculate trustworthiness scores
□ Translate to Russian
□ Add Hebrew summaries
```

**Article Addition Script**:
```typescript
// scripts/addKnowledgeArticles.ts
import { createClient } from '@supabase/supabase-js';

interface Article {
  title_en: string;
  title_ru: string;
  content_en: string;
  content_ru: string;
  category: string;
  tags: string[];
  source_url: string;
  source_type: string;
  trustworthiness_score: number;
}

const cnsArticles: Article[] = [
  {
    title_en: "Understanding Medulloblastoma: A Parent's Guide",
    title_ru: "Понимание медуллобластомы: руководство для родителей",
    content_en: `Medulloblastoma is the most common malignant brain tumor in children...

    ## What is Medulloblastoma?
    Medulloblastoma is a type of embryonal tumor that develops in the cerebellum...

    ## Symptoms to Watch For
    - Headaches, especially in the morning
    - Nausea and vomiting
    - Balance problems and difficulty walking
    - Vision changes
    ...`,
    content_ru: `Медуллобластома — наиболее распространённая злокачественная опухоль мозга у детей...`,
    category: 'cns-research',
    tags: ['medulloblastoma', 'diagnosis', 'symptoms', 'parents-guide'],
    source_url: 'https://pubmed.ncbi.nlm.nih.gov/example',
    source_type: 'peer_reviewed',
    trustworthiness_score: 95
  },
  // ... 49 more articles
];

const addArticles = async () => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  for (const article of cnsArticles) {
    const { data, error } = await supabase
      .from('knowledge_base')
      .insert(article);

    if (error) {
      console.error(`Failed to add article: ${article.title_en}`, error);
    } else {
      console.log(`✅ Added: ${article.title_en}`);
    }
  }
};

addArticles();
```

#### Week 6 Tasks
```bash
# Task 6.1: Generate embeddings for all new articles
□ Run batch-generate-embeddings function
□ Verify embedding quality
□ Update HNSW indexes

# Task 6.2: Test aOi with new content
□ Test 50 sample queries
□ Measure accuracy (target: 95%+)
□ Identify gaps in knowledge
□ Refine RAG parameters
```

**Testing Script**:
```typescript
// scripts/testAoiAccuracy.ts
const testQueries = [
  "What are the symptoms of medulloblastoma?",
  "How is DIPG treated?",
  "What support is available for families?",
  "Explain proton therapy vs radiation",
  "What are the side effects of chemotherapy?",
  // ... 45 more queries
];

const testAoi = async () => {
  let correct = 0;
  const results = [];

  for (const query of testQueries) {
    const response = await fetch('/functions/v1/aoi-rag-query', {
      method: 'POST',
      body: JSON.stringify({ query, context: { language: 'en' } })
    });

    const data = await response.json();

    // Manual review: does response contain relevant info?
    console.log(`\nQuery: ${query}`);
    console.log(`Response: ${data.answer.slice(0, 200)}...`);
    console.log(`Sources: ${data.sources.length}`);

    const isCorrect = prompt('Is this correct? (y/n): ') === 'y';
    if (isCorrect) correct++;

    results.push({ query, correct: isCorrect, sources: data.sources.length });
  }

  console.log(`\n✅ Accuracy: ${(correct / testQueries.length * 100).toFixed(1)}%`);
  console.log(`Target: 95%+`);
};

testAoi();
```

---

### Week 7: Partner Clinics Showcase

**Goal**: Display partner clinics on Research page

#### Implementation
```typescript
// src/components/PartnerClinicCard.tsx
import { ExternalLink, MapPin, Heart } from 'lucide-react';

interface PartnerClinic {
  id: string;
  name: string;
  location: string;
  country: string;
  specialization: string;
  partnershipType: 'research' | 'treatment' | 'education' | 'equipment';
  websiteUrl: string;
  logoUrl?: string;
  description: string;
  partnershipStartedAt: Date;
}

export default function PartnerClinicCard({ clinic }: { clinic: PartnerClinic }) {
  const partnershipTypeLabels = {
    research: { label: 'Research Partner', color: 'blue' },
    treatment: { label: 'Treatment Partner', color: 'green' },
    education: { label: 'Education Partner', color: 'purple' },
    equipment: { label: 'Equipment Grant', color: 'orange' }
  };

  const type = partnershipTypeLabels[clinic.partnershipType];

  return (
    <div className="partner-clinic-card bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition">
      {/* Logo & Name */}
      <div className="flex items-start gap-4 mb-4">
        {clinic.logoUrl ? (
          <img
            src={clinic.logoUrl}
            alt={clinic.name}
            className="w-16 h-16 object-contain"
          />
        ) : (
          <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
            <Heart className="w-8 h-8 text-blue-600" />
          </div>
        )}

        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {clinic.name}
          </h3>
          <p className="text-gray-600 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {clinic.location}, {clinic.country}
          </p>
        </div>
      </div>

      {/* Partnership Type Badge */}
      <div className={`inline-block px-3 py-1 bg-${type.color}-100 text-${type.color}-800 rounded-full text-sm font-semibold mb-4`}>
        {type.label}
      </div>

      {/* Specialization */}
      <p className="text-gray-700 mb-4">
        <span className="font-semibold">Specialization:</span> {clinic.specialization}
      </p>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed mb-4">
        {clinic.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <span className="text-sm text-gray-500">
          Partner since {new Date(clinic.partnershipStartedAt).getFullYear()}
        </span>

        <a
          href={clinic.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
        >
          Visit Website
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

// src/components/PartnerClinicsGrid.tsx
export default function PartnerClinicsGrid() {
  const [clinics, setClinics] = useState<PartnerClinic[]>([]);

  useEffect(() => {
    const loadClinics = async () => {
      const { data } = await supabase
        .from('partner_clinics')
        .select('*')
        .eq('is_active', true)
        .order('partnership_started_at', { ascending: false });

      if (data) setClinics(data);
    };
    loadClinics();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clinics.map(clinic => (
        <PartnerClinicCard key={clinic.id} clinic={clinic} />
      ))}
    </div>
  );
}
```

**Add to FoundationPage**:
```tsx
// In Research tab, add section:
<section className="mb-12">
  <h2 className="text-3xl font-bold mb-6">Our Partner Clinics</h2>
  <p className="text-gray-600 mb-8">
    TYT Foundation collaborates with leading medical institutions worldwide
    to advance pediatric brain cancer research and treatment.
  </p>
  <PartnerClinicsGrid />
</section>
```

---

### Week 8-9: Volunteer Portal

**Goal**: Build complete volunteer system for community engagement

#### Week 8: Database & Backend

**Migration**:
```sql
-- supabase/migrations/YYYYMMDD_create_volunteer_system.sql

/*
  # Create Volunteer System

  1. New Tables
    - `volunteer_opportunities` - Available volunteer positions
    - `volunteer_applications` - User applications to opportunities
    - `volunteer_hours` - Logged volunteer hours
    - `volunteer_badges` - Achievement system

  2. Security
    - Enable RLS on all tables
    - Public can view opportunities
    - Authenticated users can apply
    - Only approved volunteers can log hours
*/

-- Volunteer Opportunities
CREATE TABLE IF NOT EXISTS volunteer_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en text NOT NULL,
  title_ru text NOT NULL,
  description_en text NOT NULL,
  description_ru text NOT NULL,
  skills_required text[],
  time_commitment text NOT NULL,  -- '2 hours/week', '4 hours/month', 'one-time'
  location text CHECK (location IN ('remote', 'onsite', 'hybrid')),
  category text CHECK (category IN (
    'content_creation',
    'translation',
    'tech_support',
    'outreach',
    'medical_review',
    'fundraising',
    'event_planning'
  )),
  spots_available integer DEFAULT 1 CHECK (spots_available >= 0),
  spots_filled integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

-- RLS for opportunities
ALTER TABLE volunteer_opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active opportunities"
  ON volunteer_opportunities
  FOR SELECT
  USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

-- Volunteer Applications
CREATE TABLE IF NOT EXISTS volunteer_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid REFERENCES volunteer_opportunities(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,  -- Will link to auth.users when auth is implemented
  applicant_name text NOT NULL,
  applicant_email text NOT NULL,
  motivation text NOT NULL,
  relevant_experience text,
  availability text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'withdrawn')),
  reviewed_by uuid,  -- admin user id
  reviewed_at timestamptz,
  notes text,  -- admin notes
  created_at timestamptz DEFAULT now()
);

ALTER TABLE volunteer_applications ENABLE ROW LEVEL SECURITY;

-- Users can view their own applications
CREATE POLICY "Users can view own applications"
  ON volunteer_applications
  FOR SELECT
  USING (applicant_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Users can submit applications
CREATE POLICY "Users can submit applications"
  ON volunteer_applications
  FOR INSERT
  WITH CHECK (true);

-- Volunteer Hours (for approved volunteers)
CREATE TABLE IF NOT EXISTS volunteer_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id uuid NOT NULL,
  opportunity_id uuid REFERENCES volunteer_opportunities(id),
  hours decimal(5, 2) NOT NULL CHECK (hours > 0 AND hours <= 24),
  date date NOT NULL,
  description text NOT NULL,
  verified boolean DEFAULT false,
  verified_by uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE volunteer_hours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Volunteers can log their hours"
  ON volunteer_hours
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Volunteers can view their hours"
  ON volunteer_hours
  FOR SELECT
  USING (volunteer_id::text = current_setting('request.jwt.claims', true)::json->>'sub');

-- Volunteer Badges (gamification)
CREATE TABLE IF NOT EXISTS volunteer_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_ru text NOT NULL,
  description_en text NOT NULL,
  description_ru text NOT NULL,
  icon_url text,
  criteria_hours integer,  -- hours required
  criteria_category text,  -- specific category
  created_at timestamptz DEFAULT now()
);

-- Junction table for volunteer-badge assignments
CREATE TABLE IF NOT EXISTS volunteer_badge_assignments (
  volunteer_id uuid NOT NULL,
  badge_id uuid REFERENCES volunteer_badges(id) ON DELETE CASCADE,
  awarded_at timestamptz DEFAULT now(),
  PRIMARY KEY (volunteer_id, badge_id)
);

-- Sample badges
INSERT INTO volunteer_badges (name_en, name_ru, description_en, description_ru, criteria_hours) VALUES
('First Hour', 'Первый час', 'Completed first volunteer hour', 'Завершён первый волонтёрский час', 1),
('Dedicated Helper', 'Преданный помощник', 'Completed 10 volunteer hours', 'Завершено 10 волонтёрских часов', 10),
('Community Champion', 'Чемпион сообщества', 'Completed 50 volunteer hours', 'Завершено 50 волонтёрских часов', 50),
('Foundation Hero', 'Герой фонда', 'Completed 100 volunteer hours', 'Завершено 100 волонтёрских часов', 100);

-- Indexes
CREATE INDEX idx_volunteer_opportunities_active ON volunteer_opportunities(is_active, expires_at);
CREATE INDEX idx_volunteer_applications_status ON volunteer_applications(status, created_at DESC);
CREATE INDEX idx_volunteer_hours_volunteer ON volunteer_hours(volunteer_id, date DESC);
```

#### Week 9: Frontend

```typescript
// src/pages/VolunteerPage.tsx
import { useState, useEffect } from 'react';
import { Users, Clock, MapPin, Tag } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';

export default function VolunteerPage() {
  const { language } = useLanguage();
  const [opportunities, setOpportunities] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadOpportunities();
  }, [filter]);

  const loadOpportunities = async () => {
    let query = supabase
      .from('volunteer_opportunities')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('category', filter);
    }

    const { data } = await query;
    setOpportunities(data || []);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Join Our Volunteer Community
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Make a difference in pediatric brain cancer research.
          No matter your skills, there's a way you can contribute.
        </p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {['all', 'content_creation', 'translation', 'tech_support', 'outreach'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg ${
              filter === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {cat.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.map(opp => (
          <OpportunityCard key={opp.id} opportunity={opp} language={language} />
        ))}
      </div>
    </div>
  );
}

function OpportunityCard({ opportunity, language }) {
  const [showApplication, setShowApplication] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold flex-1">
          {opportunity[`title_${language}`]}
        </h3>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
          {opportunity.category.replace('_', ' ')}
        </span>
      </div>

      <p className="text-gray-600 mb-4">
        {opportunity[`description_${language}`]}
      </p>

      <div className="space-y-2 text-sm text-gray-600 mb-6">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{opportunity.time_commitment}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span className="capitalize">{opportunity.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>
            {opportunity.spots_filled}/{opportunity.spots_available} filled
          </span>
        </div>
      </div>

      {opportunity.skills_required && opportunity.skills_required.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Skills:</p>
          <div className="flex flex-wrap gap-2">
            {opportunity.skills_required.map(skill => (
              <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setShowApplication(true)}
        disabled={opportunity.spots_filled >= opportunity.spots_available}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {opportunity.spots_filled >= opportunity.spots_available
          ? 'Position Filled'
          : 'Apply Now'}
      </button>

      {showApplication && (
        <ApplicationModal
          opportunity={opportunity}
          onClose={() => setShowApplication(false)}
        />
      )}
    </div>
  );
}
```

---

## PHASE 3: CONTENT PLATFORM (Weeks 10-12)

### Week 10-11: Foundation Blog

**Database Migration**:
```sql
-- supabase/migrations/YYYYMMDD_create_foundation_blog.sql

CREATE TABLE IF NOT EXISTS foundation_blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,

  -- Multi-language content
  title_en text NOT NULL,
  title_ru text NOT NULL,
  title_he text,
  content_en text NOT NULL,
  content_ru text NOT NULL,
  content_he text,
  excerpt_en text,
  excerpt_ru text,

  -- Metadata
  author text NOT NULL,
  author_role text DEFAULT 'Foundation Team',
  author_avatar_url text,
  category text NOT NULL CHECK (category IN (
    'research_update',
    'patient_story',
    'tech_explained',
    'foundation_news',
    'guest_post',
    'event_recap'
  )),
  tags text[],

  -- Media
  featured_image text,
  featured_image_alt text,

  -- Publishing
  published_at timestamptz,
  updated_at timestamptz DEFAULT now(),

  -- SEO
  meta_description_en text,
  meta_description_ru text,

  -- Analytics
  view_count integer DEFAULT 0,

  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_blog_posts_published ON foundation_blog_posts(published_at DESC)
  WHERE published_at IS NOT NULL;
CREATE INDEX idx_blog_posts_category ON foundation_blog_posts(category, published_at DESC);
CREATE INDEX idx_blog_posts_slug ON foundation_blog_posts(slug);

-- RLS
ALTER TABLE foundation_blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published posts"
  ON foundation_blog_posts
  FOR SELECT
  USING (published_at IS NOT NULL AND published_at <= now());

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_blog_post_views(post_slug text)
RETURNS void AS $$
BEGIN
  UPDATE foundation_blog_posts
  SET view_count = view_count + 1
  WHERE slug = post_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Blog Post Component**:
```typescript
// src/pages/BlogPostPage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, User, Eye, Tag } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import ReactMarkdown from 'react-markdown';

export default function BlogPostPage() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [slug, language]);

  const loadPost = async () => {
    const { data, error } = await supabase
      .from('foundation_blog_posts')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (data) {
      // Increment view count
      await supabase.rpc('increment_blog_post_views', { post_slug: slug });

      setPost({
        title: data[`title_${language}`] || data.title_en,
        content: data[`content_${language}`] || data.content_en,
        excerpt: data[`excerpt_${language}`] || data.excerpt_en,
        author: data.author,
        authorRole: data.author_role,
        authorAvatar: data.author_avatar_url,
        category: data.category,
        tags: data.tags || [],
        featuredImage: data.featured_image,
        publishedAt: new Date(data.published_at),
        viewCount: data.view_count
      });
    }

    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      {/* Featured Image */}
      {post.featuredImage && (
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-96 object-cover rounded-xl mb-8"
        />
      )}

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        {post.title}
      </h1>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8 pb-8 border-b">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>
            <strong>{post.author}</strong>
            {post.authorRole && ` • ${post.authorRole}`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{post.publishedAt.toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          <span>{post.viewCount} views</span>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none mb-8">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-8 border-t">
          <Tag className="w-5 h-5 text-gray-500" />
          {post.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
```

### Week 11: Newsletter System

**Database**:
```sql
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  language text DEFAULT 'en' CHECK (language IN ('en', 'ru', 'he')),
  topics text[],  -- ['research', 'tech', 'events', 'patient_stories']
  subscribed boolean DEFAULT true,
  confirmed boolean DEFAULT false,
  confirmation_token text UNIQUE,
  confirmation_sent_at timestamptz,
  confirmed_at timestamptz,
  unsubscribe_token text UNIQUE,
  unsubscribed_at timestamptz,
  source text,  -- 'blog', 'homepage', 'donation', etc.
  created_at timestamptz DEFAULT now()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);
```

**Newsletter Widget**:
```typescript
// src/components/NewsletterSubscribe.tsx
import { useState } from 'react';
import { Mail, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const confirmationToken = crypto.randomUUID();
    const unsubscribeToken = crypto.randomUUID();

    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email,
        name,
        confirmation_token: confirmationToken,
        unsubscribe_token: unsubscribeToken,
        source: 'footer_widget'
      });

    if (!error) {
      // Send confirmation email (via Edge Function)
      await fetch('/functions/v1/send-email', {
        method: 'POST',
        body: JSON.stringify({
          to: email,
          template: 'newsletter_confirmation',
          data: { name, confirmationToken }
        })
      });

      setSuccess(true);
      setEmail('');
      setName('');
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="newsletter-widget bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <Check className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-green-900 mb-2">
          Check your email!
        </h3>
        <p className="text-green-700">
          We've sent you a confirmation link. Please click it to complete your subscription.
        </p>
      </div>
    );
  }

  return (
    <div className="newsletter-widget bg-blue-50 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Mail className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900">
          Stay Updated
        </h3>
      </div>

      <p className="text-gray-600 mb-4">
        Get monthly updates on research breakthroughs, patient stories, and foundation news.
      </p>

      <form onSubmit={handleSubscribe} className="space-y-3">
        <input
          type="text"
          placeholder="Your Name (Optional)"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>

      <p className="text-xs text-gray-500 mt-3">
        We respect your privacy. Unsubscribe anytime.
      </p>
    </div>
  );
}
```

---

## PHASE 4: POST-LAUNCH ENHANCEMENTS (Weeks 12-16)

### Week 12: Events Calendar
```sql
CREATE TABLE IF NOT EXISTS foundation_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en text NOT NULL,
  title_ru text NOT NULL,
  description_en text NOT NULL,
  description_ru text NOT NULL,
  event_type text CHECK (event_type IN (
    'conference',
    'fundraiser',
    'awareness_day',
    'webinar',
    'workshop'
  )),
  location text,
  is_virtual boolean DEFAULT false,
  virtual_link text,
  start_datetime timestamptz NOT NULL,
  end_datetime timestamptz NOT NULL,
  registration_required boolean DEFAULT false,
  registration_link text,
  featured_image text,
  created_at timestamptz DEFAULT now()
);
```

### Week 13-14: Annual Report Generator
```typescript
// Automated PDF generation with charts, statistics, stories
const generateAnnualReport = async (year: number) => {
  const data = await gatherYearData(year);
  const pdf = await createPDF(data, 'annual-report-template');
  await uploadToStorage(pdf);
  return pdf;
};
```

### Week 15-16: Advanced Analytics
```typescript
// Admin dashboard with:
// - Donation trends
// - Article engagement
// - aOi query analytics
// - Volunteer activity
// - Geographic distribution
```

---

## 📊 CONTENT ROADMAP

### CNS Articles Target (Total: 150+)

**Current**: 61 articles
**Target**: 150 articles

**Breakdown by Topic**:
- Medulloblastoma (30 articles)
- DIPG & Brainstem Gliomas (20 articles)
- Ependymoma (15 articles)
- Atypical Teratoid Rhabdoid Tumor (10 articles)
- Treatment Protocols (20 articles)
- Clinical Trials (15 articles)
- Support & Recovery (20 articles)
- Research Techniques (10 articles)
- Prevention & Risk Factors (10 articles)

**Sources Priority**:
1. PubMed (peer-reviewed papers)
2. NIH / NCI (official guidelines)
3. WHO (international standards)
4. Major Cancer Centers (MD Anderson, Dana-Farber, St. Jude)
5. Clinical Trial Registries (ClinicalTrials.gov)

**Quality Control**:
- ✅ Trustworthiness score: 90-100
- ✅ Peer-reviewed sources only
- ✅ Published within last 5 years (for treatment protocols)
- ✅ Multi-language support (EN/RU, Hebrew summaries)
- ✅ Medical disclaimer on all content

---

### Web3 Articles Target (Total: 60+)

**Current**: 34 articles
**Target**: 60 articles

**Breakdown by Topic**:
- DeFi Basics (10 articles)
- DAO Governance (10 articles)
- NFT Technology (8 articles)
- Blockchain Security (8 articles)
- DeSci Movement (8 articles)
- Tokenomics (8 articles)
- Smart Contracts (8 articles)

---

## 🛠 TECHNICAL STACK & TOOLS

### Development
- **Frontend**: React 18, TypeScript 5, Vite 5, Tailwind CSS 3
- **Backend**: Supabase Edge Functions (Deno)
- **Database**: PostgreSQL 15 with pgvector
- **Auth**: Supabase Auth (email/password + social)
- **Storage**: Supabase Storage (images, PDFs, QR codes)

### Integrations
- **Email**: Resend API
- **Payments (Fiat)**: Stripe
- **Transaction Monitoring**: Blocknative / Alchemy
- **Analytics**: Supabase Analytics
- **AI/ML**: OpenAI Embeddings (text-embedding-3-small)
- **PDF Generation**: jsPDF or Puppeteer

### Security
- **RLS**: 100% coverage on all tables
- **Rate Limiting**: 10 req/min for forms
- **Bot Protection**: hCaptcha
- **Secrets**: Supabase Vault
- **Auditing**: Audit log table for sensitive actions

---

## ✅ QUALITY ASSURANCE & TESTING

### Testing Strategy

#### Unit Tests
```bash
# Test components
npm run test:unit

# Coverage target: 80%+
```

#### Integration Tests
```bash
# Test API endpoints
npm run test:integration

# Test edge functions locally
supabase functions serve --inspect
```

#### E2E Tests
```bash
# Test critical user flows
npm run test:e2e

# Flows to test:
# - Donation flow (crypto + fiat)
# - Contact form submission
# - Volunteer application
# - Knowledge search
# - aOi query
```

#### Security Testing
```bash
# RLS policy testing
npm run test:rls

# SQL injection testing
npm run test:security

# Rate limit testing
npm run test:rate-limit
```

### Pre-Launch Checklist

**Week 16: Final QA**
```bash
□ All P0 features implemented and tested
□ Security audit passed (A+ grade maintained)
□ Performance testing (Lighthouse 90+ score)
□ SEO optimization (meta tags, sitemap, robots.txt)
□ Analytics configured (Supabase + custom events)
□ Error tracking (Sentry or similar)
□ Backup & disaster recovery plan documented
□ Legal pages updated (Privacy, Terms, Refund Policy)
□ Multi-language testing (EN/RU/HE)
□ Mobile responsiveness verified
□ Cross-browser testing (Chrome, Firefox, Safari, Edge)
□ Load testing (100+ concurrent users)
□ Email deliverability testing
□ Blockchain transaction testing (testnet → mainnet)
□ Documentation complete (user guides, admin docs)
□ Monitoring & alerting configured
```

---

## 🚀 LAUNCH PLAN

### Soft Launch (Week 15)
```bash
# Beta testers only
□ Invite 50 beta testers
□ Monitor all systems 24/7
□ Collect feedback via surveys
□ Fix critical bugs within 24h
□ Daily standup meetings
```

### Public Beta Launch (Week 16)
```bash
# Open to public with disclaimer
□ Announce on social media
□ Send newsletter to subscribers
□ Activate donation system (real wallets)
□ Enable volunteer applications
□ Start publishing blog posts (2/week)
□ Monitor donations closely
□ Respond to all emails within 24h
```

### Full Production Launch (Week 18)
```bash
# Remove beta label
□ Press release to crypto/med-tech media
□ Partner announcements
□ First donation milestone celebration
□ First volunteer success story
□ aOi knowledge base at 150+ articles
□ 100% uptime for 2 weeks straight
```

---

## 📈 SUCCESS METRICS

### Week 1-4 (Foundation)
- ✅ Real donation system operational
- ✅ First 10 donations processed
- ✅ Impact stories page live with 5+ stories
- ✅ Security grade maintained at A+ (96+/100)

### Week 5-8 (Growth)
- ✅ Knowledge base: 100+ articles
- ✅ aOi accuracy: 95%+
- ✅ Volunteer portal: 20+ applications
- ✅ Blog: 10+ published posts

### Week 9-12 (Scale)
- ✅ Total donated: $10,000+ equivalent
- ✅ Active volunteers: 50+
- ✅ Newsletter subscribers: 500+
- ✅ Monthly active users: 1,000+

### Week 13-16 (Maturity)
- ✅ Knowledge base: 150+ articles
- ✅ Partner clinics: 5+ featured
- ✅ Impact stories: 20+ published
- ✅ Annual report generated
- ✅ Community: 100+ active members

---

## 🎯 NEXT IMMEDIATE ACTIONS

### This Week (Week 1):
```bash
1. Generate crypto wallet addresses (BTC, ETH, USDT, TON, SOL)
2. Set up secure storage for private keys
3. Generate QR codes for each wallet
4. Deploy transaction-monitor edge function
5. Test donation flow end-to-end on testnet
```

### This Month (Weeks 1-4):
```bash
1. Complete donation system (P0)
2. Launch impact stories (P1)
3. Harden security (rate limiting, bot protection)
4. Add 20 new CNS articles
5. Test aOi with expanded knowledge
```

### This Quarter (Weeks 1-12):
```bash
1. Complete all P0 and P1 features
2. Launch volunteer portal
3. Launch foundation blog
4. Reach 100+ articles in knowledge base
5. Process $5,000+ in donations
6. Recruit 30+ active volunteers
```

---

## 📝 WEEKLY PROGRESS TRACKING

**Template for Weekly Updates**:
```markdown
## Week X Progress Report

### Completed ✅
- [ ] Task 1
- [ ] Task 2

### In Progress 🔄
- [ ] Task 3 (70% done)

### Blocked 🚫
- [ ] Task 4 (reason: waiting for API keys)

### Next Week Plan
1. Complete Task 4
2. Start Task 5
3. Test Task 3

### Metrics
- Donations: $X
- New articles: X
- Volunteers: X
- aOi queries: X
```

---

## 🤝 COLLABORATION & COMMUNICATION

### Team Structure (Needed)
- **Project Manager**: Oversees roadmap execution
- **Frontend Developer**: React/TypeScript
- **Backend Developer**: Supabase/Edge Functions
- **Content Curator**: Medical articles (requires medical background)
- **Translator**: English ↔ Russian ↔ Hebrew
- **Designer**: UI/UX improvements
- **Community Manager**: Volunteer coordination

### Communication Channels
- **Daily Standups**: 15 min sync on progress
- **Weekly Planning**: Set next week's goals
- **Bi-weekly Demos**: Show progress to stakeholders
- **Monthly Retrospectives**: Learn and improve

---

## 📚 DOCUMENTATION REQUIREMENTS

### User Documentation
```bash
□ Getting Started Guide
□ Donation Guide (how to send crypto)
□ Volunteer Guide (how to apply & contribute)
□ FAQ (common questions)
□ Troubleshooting (common issues)
```

### Developer Documentation
```bash
□ Architecture Overview
□ Database Schema (with ER diagram)
□ API Reference (all endpoints)
□ Edge Functions Guide
□ Deployment Guide
□ Contributing Guidelines
```

### Admin Documentation
```bash
□ Admin Dashboard Guide
□ Content Moderation Guide
□ Volunteer Management Guide
□ Donation Reconciliation Guide
□ Security Incident Response Plan
```

---

## 🔒 SECURITY & COMPLIANCE

### Regular Security Tasks
```bash
# Weekly
□ Review audit logs for suspicious activity
□ Check RLS policies for new tables
□ Update dependencies (npm audit)
□ Backup database

# Monthly
□ Security audit (automated scan)
□ Penetration testing
□ Review user permissions
□ Update security documentation

# Quarterly
□ Third-party security audit
□ Disaster recovery drill
□ Update compliance documentation
□ Review and update legal pages
```

---

## 📞 SUPPORT & CONTACT

### For Implementation Questions
- **Technical Issues**: Open GitHub issue
- **Content Questions**: contact@tyt.foundation
- **Security Concerns**: security@tyt.foundation
- **General Inquiries**: hello@tyt.foundation

---

## 🎉 CONCLUSION

This roadmap provides a **clear, actionable path** from current state (78/100) to full production launch (95+/100) over 16 weeks.

**Key Principles**:
1. **Focus on tyt.foundation** (not takeyourtoken.app)
2. **Security first** (no compromise on safety)
3. **Quality over quantity** (verified content only)
4. **Community-driven** (volunteers are partners)
5. **Transparent** (blockchain-backed reporting)

**Remember**: The goal is not just to build a website, but to create a **trusted platform** that genuinely advances pediatric brain cancer research through Web3 technology.

---

**Document Version**: 1.0
**Last Updated**: 12 января 2026
**Next Review**: After Week 4 completion
