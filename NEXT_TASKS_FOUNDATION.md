# Foundation: Next Tasks & Implementation Plan

> **Based on**: REPORT_FOUNDATION_INVENTORY.md
> **Target**: Transform foundation into full public trust layer
> **Timeline**: 6-8 weeks
> **Scope**: Add-only (no breaking changes)

---

## 🎯 MISSION

Make TYT Foundation the **most transparent medical research foundation** by implementing:
- ✅ **Public Ledger UI** with advanced filters
- ✅ **Reports Integrity Panel** (hash/merkle/orbital/aOi)
- ✅ **Orbital Events Page** (read-only)
- ✅ **aOi Transparency Page** (what it does/doesn't do)

---

## 📋 TASK BREAKDOWN

### PHASE 1: PROOF INFRASTRUCTURE (Week 1-2) - P0

**Goal**: Add missing proof primitives to enable trust layer

#### Task 1.1: Database Migration - Proof Columns

**Priority**: P0
**Estimated Time**: 2 hours
**File**: `supabase/migrations/[timestamp]_add_proof_primitives.sql`

**Implementation**:

```sql
/*
  # Add Proof & Integrity Primitives

  1. New Columns
    - fund_transparency: merkle_root, merkle_proof, orbital_timestamp, orbital_witness_url, aoi_verified, aoi_verified_at, aoi_verification_signature
    - foundation_impact_reports: report_hash, merkle_root, orbital_timestamp, orbital_witness_url, aoi_verified, aoi_verified_at, multi_sig_threshold, multi_sig_signatures
    - foundation_grants: approval_hash, multi_sig_threshold, multi_sig_signatures, aoi_verified, aoi_verified_at

  2. Indexes
    - idx_fund_transparency_merkle_root
    - idx_fund_transparency_aoi_verified
    - idx_reports_report_hash

  3. Security
    - No RLS changes needed (read-only fields)
*/

-- fund_transparency enhancements
ALTER TABLE fund_transparency ADD COLUMN IF NOT EXISTS
  merkle_root text,
  merkle_proof jsonb,
  orbital_timestamp timestamptz,
  orbital_witness_url text,
  aoi_verified boolean DEFAULT false,
  aoi_verified_at timestamptz,
  aoi_verification_signature text;

-- foundation_impact_reports enhancements
ALTER TABLE foundation_impact_reports ADD COLUMN IF NOT EXISTS
  report_hash text,
  merkle_root text,
  orbital_timestamp timestamptz,
  orbital_witness_url text,
  aoi_verified boolean DEFAULT false,
  aoi_verified_at timestamptz,
  multi_sig_threshold integer DEFAULT 3,
  multi_sig_signatures jsonb DEFAULT '[]';

-- foundation_grants enhancements
ALTER TABLE foundation_grants ADD COLUMN IF NOT EXISTS
  approval_hash text,
  multi_sig_threshold integer DEFAULT 2,
  multi_sig_signatures jsonb DEFAULT '[]',
  aoi_verified boolean DEFAULT false,
  aoi_verified_at timestamptz;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_fund_transparency_merkle_root
  ON fund_transparency(merkle_root) WHERE merkle_root IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_fund_transparency_aoi_verified
  ON fund_transparency(aoi_verified, aoi_verified_at);

CREATE INDEX IF NOT EXISTS idx_reports_report_hash
  ON foundation_impact_reports(report_hash);

CREATE INDEX IF NOT EXISTS idx_fund_transparency_type_created
  ON fund_transparency(transaction_type, created_at DESC);
```

**Success Criteria**:
- ✅ All columns added without errors
- ✅ Indexes created
- ✅ Migration runs cleanly on production
- ✅ No RLS policy changes needed

---

#### Task 1.2: Merkle Tree Utilities

**Priority**: P0
**Estimated Time**: 4-6 hours
**Files**: `src/utils/merkleTree.ts`, `src/utils/merkleTree.test.ts`

**Implementation**:

```typescript
// src/utils/merkleTree.ts

import { createHash } from 'crypto';

export interface MerkleProof {
  leaf: string;
  root: string;
  proof: Array<{
    position: 'left' | 'right';
    hash: string;
  }>;
  index: number;
}

/**
 * Generate SHA-256 hash of data
 */
export function sha256(data: string): string {
  return createHash('sha256').update(data).digest('hex');
}

/**
 * Generate merkle root from array of transaction hashes
 * @param leaves - Array of transaction hashes (already hashed)
 * @returns Merkle root hash
 */
export function generateMerkleRoot(leaves: string[]): string {
  if (leaves.length === 0) return '';
  if (leaves.length === 1) return leaves[0];

  // Build tree bottom-up
  let currentLevel = [...leaves];

  while (currentLevel.length > 1) {
    const nextLevel: string[] = [];

    for (let i = 0; i < currentLevel.length; i += 2) {
      const left = currentLevel[i];
      const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left;

      // Concatenate and hash
      const combined = sha256(left + right);
      nextLevel.push(combined);
    }

    currentLevel = nextLevel;
  }

  return currentLevel[0];
}

/**
 * Generate merkle proof for a specific leaf
 */
export function generateMerkleProof(
  leaves: string[],
  leafIndex: number
): MerkleProof {
  if (leafIndex < 0 || leafIndex >= leaves.length) {
    throw new Error('Invalid leaf index');
  }

  const proof: MerkleProof['proof'] = [];
  let currentLevel = [...leaves];
  let currentIndex = leafIndex;

  while (currentLevel.length > 1) {
    const nextLevel: string[] = [];

    for (let i = 0; i < currentLevel.length; i += 2) {
      const left = currentLevel[i];
      const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left;

      // If current index is in this pair, add sibling to proof
      if (i === currentIndex || i + 1 === currentIndex) {
        if (i === currentIndex && i + 1 < currentLevel.length) {
          proof.push({ position: 'right', hash: right });
        } else if (i + 1 === currentIndex) {
          proof.push({ position: 'left', hash: left });
        }
      }

      nextLevel.push(sha256(left + right));
    }

    // Update index for next level
    currentIndex = Math.floor(currentIndex / 2);
    currentLevel = nextLevel;
  }

  return {
    leaf: leaves[leafIndex],
    root: currentLevel[0],
    proof,
    index: leafIndex,
  };
}

/**
 * Verify merkle proof
 */
export function verifyMerkleProof(proof: MerkleProof): boolean {
  let currentHash = proof.leaf;

  for (const step of proof.proof) {
    if (step.position === 'left') {
      currentHash = sha256(step.hash + currentHash);
    } else {
      currentHash = sha256(currentHash + step.hash);
    }
  }

  return currentHash === proof.root;
}

/**
 * Generate transaction hash for fund_transparency record
 */
export function generateTransactionHash(transaction: {
  id: string;
  transaction_type: string;
  amount_usd: number | null;
  description: string;
  created_at: string;
}): string {
  const data = `${transaction.id}|${transaction.transaction_type}|${transaction.amount_usd}|${transaction.description}|${transaction.created_at}`;
  return sha256(data);
}
```

**Success Criteria**:
- ✅ Merkle root generates correctly
- ✅ Proof generation works for any leaf
- ✅ Verification succeeds for valid proofs
- ✅ Verification fails for invalid proofs
- ✅ Unit tests pass (100% coverage)

---

#### Task 1.3: Orbital Witness Integration

**Priority**: P0
**Estimated Time**: 4-6 hours
**Files**: `src/utils/orbitalWitness.ts`

**Implementation**:

```typescript
// src/utils/orbitalWitness.ts

/**
 * Orbital Witness Service Integration
 *
 * Using OpenTimestamps (free, Bitcoin-based)
 * Docs: https://opentimestamps.org/
 */

export interface OrbitalProof {
  hash: string;
  timestamp: Date;
  proofUrl: string;
  verified: boolean;
  blockchainTx?: string;
}

/**
 * Submit hash to OpenTimestamps for timestamping
 * @param hash - SHA-256 hash to timestamp
 * @returns Proof URL
 */
export async function timestampHash(hash: string): Promise<string> {
  try {
    // OpenTimestamps API
    const response = await fetch('https://alice.btc.calendar.opentimestamps.org/timestamp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-sha256-hash',
        'Accept': 'application/vnd.opentimestamps.ots',
      },
      body: Buffer.from(hash, 'hex'),
    });

    if (!response.ok) {
      throw new Error(`OpenTimestamps API error: ${response.status}`);
    }

    // Get proof file (binary)
    const proofData = await response.arrayBuffer();

    // Store proof in IPFS or S3 (for now, return placeholder)
    // TODO: Implement actual storage
    const proofUrl = `https://opentimestamps.org/info?ots=${hash}`;

    return proofUrl;
  } catch (error) {
    console.error('Error timestamping hash:', error);
    throw error;
  }
}

/**
 * Verify orbital timestamp
 * @param hash - Original hash
 * @param proofUrl - URL to proof file
 * @returns Verification result
 */
export async function verifyTimestamp(
  hash: string,
  proofUrl: string
): Promise<OrbitalProof> {
  try {
    // For OpenTimestamps, verification is done via their service
    const response = await fetch(`https://alice.btc.calendar.opentimestamps.org/timestamp/${hash}`);

    if (!response.ok) {
      return {
        hash,
        timestamp: new Date(),
        proofUrl,
        verified: false,
      };
    }

    const data = await response.json();

    return {
      hash,
      timestamp: new Date(data.timestamp * 1000),
      proofUrl,
      verified: true,
      blockchainTx: data.attestations?.[0]?.txHash,
    };
  } catch (error) {
    console.error('Error verifying timestamp:', error);
    return {
      hash,
      timestamp: new Date(),
      proofUrl,
      verified: false,
    };
  }
}

/**
 * Batch timestamp multiple hashes
 */
export async function batchTimestamp(hashes: string[]): Promise<Map<string, string>> {
  const results = new Map<string, string>();

  for (const hash of hashes) {
    try {
      const proofUrl = await timestampHash(hash);
      results.set(hash, proofUrl);

      // Rate limiting (1 request per second)
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Failed to timestamp ${hash}:`, error);
    }
  }

  return results;
}
```

**Success Criteria**:
- ✅ Can submit hash to OpenTimestamps
- ✅ Receives proof URL
- ✅ Can verify timestamp
- ✅ Handles errors gracefully
- ✅ Rate limiting works

---

#### Task 1.4: aOi Verification Edge Function

**Priority**: P0
**Estimated Time**: 6-8 hours
**File**: `supabase/functions/aoi-verify-transaction/index.ts`

**Implementation**:

```typescript
// supabase/functions/aoi-verify-transaction/index.ts

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface VerificationRequest {
  transactionId: string;
  transactionType: 'fund_transparency' | 'foundation_grant' | 'foundation_report';
}

interface VerificationResult {
  verified: boolean;
  checks: {
    formatValid: boolean;
    amountsMatch: boolean;
    sourceDestValid: boolean;
    blockchainHashValid?: boolean;
  };
  signature: string;
  timestamp: string;
  errors: string[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { transactionId, transactionType }: VerificationRequest = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch transaction
    const { data: transaction, error } = await supabase
      .from(transactionType)
      .select('*')
      .eq('id', transactionId)
      .single();

    if (error || !transaction) {
      throw new Error(`Transaction not found: ${transactionId}`);
    }

    // Verification checks
    const checks = {
      formatValid: true,
      amountsMatch: true,
      sourceDestValid: true,
      blockchainHashValid: true,
    };

    const errors: string[] = [];

    // Check 1: Format validation
    if (transactionType === 'fund_transparency') {
      if (!transaction.transaction_type) {
        checks.formatValid = false;
        errors.push('Missing transaction_type');
      }
      if (!transaction.description || transaction.description.length < 5) {
        checks.formatValid = false;
        errors.push('Invalid description');
      }
    }

    // Check 2: Amount validation
    if (transaction.amount_usd !== null) {
      if (transaction.amount_usd <= 0) {
        checks.amountsMatch = false;
        errors.push('Amount must be positive');
      }
    }

    // Check 3: Source/Destination validation
    if (transactionType === 'fund_transparency') {
      if (transaction.transaction_type === 'donation' && !transaction.source) {
        checks.sourceDestValid = false;
        errors.push('Donation must have source');
      }
      if (transaction.transaction_type === 'grant' && !transaction.destination) {
        checks.sourceDestValid = false;
        errors.push('Grant must have destination');
      }
    }

    // Check 4: Blockchain hash validation (if present)
    if (transaction.blockchain_hash) {
      // TODO: Verify against Etherscan API
      // For now, just check format
      if (!/^0x[a-fA-F0-9]{64}$/.test(transaction.blockchain_hash)) {
        checks.blockchainHashValid = false;
        errors.push('Invalid blockchain hash format');
      }
    }

    // Overall verification result
    const verified = Object.values(checks).every(check => check === true);

    // Generate signature (simplified - in production, use proper signing)
    const signatureData = `${transactionId}|${verified}|${new Date().toISOString()}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(signatureData);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const result: VerificationResult = {
      verified,
      checks,
      signature,
      timestamp: new Date().toISOString(),
      errors,
    };

    // Update transaction with verification result
    if (verified) {
      await supabase
        .from(transactionType)
        .update({
          aoi_verified: true,
          aoi_verified_at: new Date().toISOString(),
          aoi_verification_signature: signature,
        })
        .eq('id', transactionId);
    }

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Verification error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
```

**Success Criteria**:
- ✅ Function deploys without errors
- ✅ Can verify fund_transparency records
- ✅ Updates aoi_verified flag correctly
- ✅ Generates signature
- ✅ Returns detailed error messages

---

#### Task 1.5: Report Hash Generation

**Priority**: P0
**Estimated Time**: 2-3 hours
**File**: `src/utils/reportHash.ts`

**Implementation**:

```typescript
// src/utils/reportHash.ts

import { sha256 } from './merkleTree';

export interface ReportData {
  report_type: string;
  period_start: string;
  period_end: string;
  total_donated: number;
  families_count: number;
  grants_count: number;
  trials_count: number;
  report_data: any;
}

/**
 * Generate canonical hash for impact report
 * @param report - Report data
 * @returns SHA-256 hash
 */
export function generateReportHash(report: ReportData): string {
  // Canonical serialization (order matters!)
  const canonical = [
    report.report_type,
    report.period_start,
    report.period_end,
    report.total_donated.toString(),
    report.families_count.toString(),
    report.grants_count.toString(),
    report.trials_count.toString(),
    JSON.stringify(report.report_data, Object.keys(report.report_data).sort()),
  ].join('|');

  return sha256(canonical);
}

/**
 * Verify report hash
 */
export function verifyReportHash(report: ReportData, expectedHash: string): boolean {
  const calculatedHash = generateReportHash(report);
  return calculatedHash === expectedHash;
}
```

**Success Criteria**:
- ✅ Hash generation is deterministic
- ✅ Same data → same hash
- ✅ Verification works correctly

---

### PHASE 2: PUBLIC LEDGER UI (Week 2-3) - P0

**Goal**: Build advanced ledger interface with filters and export

#### Task 2.1: Create LedgerPage Component

**Priority**: P0
**Estimated Time**: 8-12 hours
**Files**: `src/pages/LedgerPage.tsx`

**Features**:
- Date range picker (from/to)
- Amount range slider
- Transaction type multi-select
- Source/destination text search
- Keyword search in description
- Real-time filter updates
- Pagination (50 per page)
- Export to CSV/PDF/JSON
- Proof verification inline

**UI Mockup**:
```
┌─────────────────────────────────────────────────────────────┐
│  🔍 Advanced Ledger                                         │
├─────────────────────────────────────────────────────────────┤
│  Filters:                                                   │
│  [Date Range] [Amount $] [Type ▼] [Search...] [Export ▼]  │
├─────────────────────────────────────────────────────────────┤
│  Transaction #12345                  $10,000   2024-01-15  │
│  Donation from "John Doe" → Foundation                     │
│  ✅ Verified • 🔗 0x1234...abcd • 📄 Proof                 │
│  [View Details] [Verify Proof]                             │
├─────────────────────────────────────────────────────────────┤
│  Transaction #12346                  $5,000    2024-01-14  │
│  Grant to "Research Lab A"                                 │
│  ✅ Verified • ⚠️ No blockchain hash • 📄 Proof            │
│  [View Details] [Verify Proof]                             │
└─────────────────────────────────────────────────────────────┘
```

**Success Criteria**:
- ✅ All filters work correctly
- ✅ Export generates valid files
- ✅ Pagination smooth
- ✅ Proof panels expand/collapse
- ✅ Mobile responsive

---

#### Task 2.2: Transaction Detail Modal

**Priority**: P1
**Estimated Time**: 4-6 hours
**File**: `src/components/TransactionDetailModal.tsx`

**Features**:
- Full transaction details
- Merkle proof display
- Orbital timestamp verification
- aOi verification status
- Blockchain explorer embed
- Download proof button
- Related transactions list

**Success Criteria**:
- ✅ Modal opens on click
- ✅ All data displayed correctly
- ✅ Proof verification works
- ✅ Can download proof as JSON

---

#### Task 2.3: Export Functionality

**Priority**: P1
**Estimated Time**: 4-6 hours
**Files**: `src/utils/exportLedger.ts`

**Formats**:
- CSV (Excel-compatible)
- PDF (formatted report)
- JSON (developer-friendly)

**Implementation**:

```typescript
// src/utils/exportLedger.ts

export async function exportToCSV(transactions: any[]): Promise<Blob> {
  const headers = ['Date', 'Type', 'Amount (USD)', 'Source', 'Destination', 'Description', 'Blockchain Hash', 'Verified'];

  const rows = transactions.map(tx => [
    new Date(tx.created_at).toISOString(),
    tx.transaction_type,
    tx.amount_usd || '',
    tx.source || '',
    tx.destination || '',
    tx.description,
    tx.blockchain_hash || '',
    tx.aoi_verified ? 'Yes' : 'No',
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  return new Blob([csv], { type: 'text/csv' });
}

export async function exportToPDF(transactions: any[]): Promise<Blob> {
  // TODO: Use jsPDF or similar library
  throw new Error('PDF export not implemented yet');
}

export async function exportToJSON(transactions: any[]): Promise<Blob> {
  const json = JSON.stringify(transactions, null, 2);
  return new Blob([json], { type: 'application/json' });
}
```

**Success Criteria**:
- ✅ CSV downloads correctly
- ✅ Opens in Excel without errors
- ✅ JSON is valid
- ✅ PDF (future) formats nicely

---

### PHASE 3: REPORTS PAGE (Week 3-4) - P0

**Goal**: Display impact reports with integrity verification

#### Task 3.1: Create ReportsPage Component

**Priority**: P0
**Estimated Time**: 10-14 hours
**File**: `src/pages/ReportsPage.tsx`

**Features**:
- Reports list (grid or table)
- Filter by type (monthly, quarterly, annual)
- Filter by year
- Sort by date (newest first)
- Report detail view
- Integrity panel (hash, merkle, orbital, aOi)
- Download PDF button
- Share link button

**UI Mockup**:
```
┌─────────────────────────────────────────────────────────────┐
│  📄 Impact Reports                                          │
├─────────────────────────────────────────────────────────────┤
│  [2024 ▼] [Quarterly ▼] [Sort: Newest ▼]                  │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Q4 2024 Impact Report                                │  │
│  │ October - December 2024                              │  │
│  │ $85,000 donated • 45 families supported              │  │
│  │ ✅ Verified • 📄 View Report • ⬇ Download PDF       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Success Criteria**:
- ✅ Reports load from database
- ✅ Filters work correctly
- ✅ Detail view displays full report
- ✅ Integrity panel shows all proofs
- ✅ Can download PDF

---

#### Task 3.2: Report Integrity Panel

**Priority**: P0
**Estimated Time**: 4-6 hours
**Component**: `src/components/ReportIntegrityPanel.tsx`

**Features**:
- Report hash display with "Verify" button
- Merkle root display (if batched)
- Orbital timestamp with verification status
- aOi verification badge
- Multi-sig status (if required)
- "Recalculate Hash" button (for user verification)

**UI Mockup**:
```
┌────────────────────────────────────────────────────────────┐
│  🛡 Integrity Verification                                 │
├────────────────────────────────────────────────────────────┤
│  Report Hash:                                              │
│  a7b3c...89d2  [Copy] [Verify]                            │
│                                                            │
│  Merkle Root:                                              │
│  4f2e1...5c8a  (Batch #42, Position 7/12)                │
│                                                            │
│  Orbital Timestamp:                                        │
│  ✅ Verified on Bitcoin                                    │
│  2024-01-15 14:32:17 UTC                                   │
│  [View Proof]                                              │
│                                                            │
│  aOi Verification:                                         │
│  ✅ Verified by aOi                                        │
│  2024-01-15 14:35:02 UTC                                   │
│  Signature: 3a9f...d7e2                                    │
│                                                            │
│  Multi-Sig Status:                                         │
│  ✅ 3/3 signatures collected                               │
│  [View Signers]                                            │
└────────────────────────────────────────────────────────────┘
```

**Success Criteria**:
- ✅ All proofs display correctly
- ✅ "Verify" button recalculates hash
- ✅ Shows success/failure clearly
- ✅ Links to external proofs work

---

### PHASE 4: ORBITAL EVENTS PAGE (Week 4-5) - P1

**Goal**: Display all orbital-timestamped events

#### Task 4.1: Create OrbitalEventsPage

**Priority**: P1
**Estimated Time**: 12-16 hours
**File**: `src/pages/OrbitalEventsPage.tsx`

**Features**:
- Events list (all timestamped items)
- Search by hash
- Filter by date range
- Filter by event type (transaction, report, grant)
- Verification status badges
- Link to original item
- "Verify Proof" button
- Statistics panel (total events, success rate, avg time)

**UI Mockup**:
```
┌────────────────────────────────────────────────────────────┐
│  🌌 Orbital Witness Events                                 │
├────────────────────────────────────────────────────────────┤
│  Statistics:                                               │
│  Total Events: 1,247 • Success Rate: 99.8% • Avg: 15 min │
├────────────────────────────────────────────────────────────┤
│  [Date Range] [Type ▼] [Search hash...]                   │
├────────────────────────────────────────────────────────────┤
│  Event #1247                                               │
│  Hash: a7b3c...89d2                                        │
│  Type: Impact Report                                       │
│  Timestamp: 2024-01-15 14:32:17 UTC                       │
│  ✅ Verified on Bitcoin (block 825,341)                    │
│  [View Item] [View Proof] [Verify]                        │
└────────────────────────────────────────────────────────────┘
```

**Success Criteria**:
- ✅ All events display correctly
- ✅ Search works
- ✅ Verification status accurate
- ✅ Can verify proofs externally
- ✅ Statistics update in real-time

---

### PHASE 5: aOi TRANSPARENCY PAGE (Week 5-6) - P1

**Goal**: Explain what aOi is, does, and doesn't do

#### Task 5.1: Create AoiTransparencyPage

**Priority**: P1
**Estimated Time**: 6-8 hours
**File**: `src/pages/AoiTransparencyPage.tsx`

**Sections**:
1. **What is aOi?**
   - Core AI Orchestrator
   - Navigation Assistant
   - Knowledge Curator
   - Security Auditor

2. **What aOi Does**:
   - Explains Web3/blockchain/medical concepts
   - Guides users between app and foundation
   - Verifies transaction integrity
   - Curates knowledge base
   - Tracks user progress

3. **What aOi Doesn't Do**:
   - ❌ No medical advice or diagnosis
   - ❌ No financial recommendations
   - ❌ No access to private data
   - ❌ No autonomous transactions
   - ❌ No replacement for professionals

4. **How aOi Works**:
   - RAG (Retrieval-Augmented Generation) architecture
   - Trusted sources (PubMed, NIH, WHO)
   - Human curator approval
   - Versioning and auditing
   - Open-source components

5. **Data Sources**:
   - List of trusted sources
   - Update frequency (weekly/monthly)
   - Curator process
   - How to submit knowledge

6. **Limitations**:
   - Not real-time (knowledge lag)
   - May have outdated information
   - Requires human verification
   - Language limitations

7. **Verification Log**:
   - Table of aOi-verified transactions
   - Verification signatures
   - Audit trail

**UI Mockup**:
```
┌────────────────────────────────────────────────────────────┐
│  葵 aOi Transparency                                       │
├────────────────────────────────────────────────────────────┤
│  What is aOi?                                              │
│                                                            │
│  aOi (葵) is the Core AI Orchestrator for the TYT         │
│  ecosystem. She navigates between knowledge (Foundation)  │
│  and tools (App), curates content, verifies integrity,    │
│  and guides users through complex systems.                 │
│                                                            │
│  ✅ What aOi Does        ❌ What aOi Doesn't Do           │
│  • Explains concepts     • Medical advice                 │
│  • Verifies data         • Financial advice               │
│  • Guides navigation     • Access private data            │
│                                                            │
│  [View Verification Log] [View Data Sources]              │
└────────────────────────────────────────────────────────────┘
```

**Success Criteria**:
- ✅ Clear, non-technical language
- ✅ Addresses all key questions
- ✅ Links to verification log
- ✅ Builds trust, not fear

---

### PHASE 6: POLISH & OPTIMIZATION (Week 6-8) - P2

**Optional enhancements for better UX**

#### Task 6.1: Real-Time Subscriptions

**Priority**: P2
**Estimated Time**: 4-6 hours

**Implementation**:
```typescript
// Real-time updates on TransparencyPage
useEffect(() => {
  const channel = supabase
    .channel('fund_transparency_changes')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'fund_transparency',
    }, (payload) => {
      setTransactions(prev => [payload.new, ...prev]);
      // Show toast notification
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

**Success Criteria**:
- ✅ New transactions appear immediately
- ✅ Toast notifications shown
- ✅ No page reload needed

---

#### Task 6.2: Data Mirroring (App ↔ Foundation)

**Priority**: P2
**Estimated Time**: 8-10 hours

**Implementation**:
- Create read-only views in database
- Add Foundation stats widget to App dashboard
- Add User progress widget to Foundation
- Sync via Supabase realtime

**Success Criteria**:
- ✅ Stats visible on both domains
- ✅ Updates in real-time
- ✅ No performance impact

---

## 📊 PROGRESS TRACKING

### Week 1-2: Proof Infrastructure

- [ ] Task 1.1: Database Migration
- [ ] Task 1.2: Merkle Tree Utilities
- [ ] Task 1.3: Orbital Witness Integration
- [ ] Task 1.4: aOi Verification Edge Function
- [ ] Task 1.5: Report Hash Generation

**Expected Progress**: 30%

### Week 3-4: Ledger & Reports

- [ ] Task 2.1: Create LedgerPage Component
- [ ] Task 2.2: Transaction Detail Modal
- [ ] Task 2.3: Export Functionality
- [ ] Task 3.1: Create ReportsPage Component
- [ ] Task 3.2: Report Integrity Panel

**Expected Progress**: 65%

### Week 5-6: Orbital & aOi Pages

- [ ] Task 4.1: Create OrbitalEventsPage
- [ ] Task 5.1: Create AoiTransparencyPage

**Expected Progress**: 85%

### Week 7-8: Polish & Launch

- [ ] Task 6.1: Real-Time Subscriptions
- [ ] Task 6.2: Data Mirroring
- [ ] Final testing
- [ ] Documentation
- [ ] Launch

**Expected Progress**: 100%

---

## 🚀 QUICK START GUIDE

### For Developers

1. **Start with Phase 1**:
   ```bash
   # Run database migration
   npm run supabase:migrate

   # Implement merkle utilities
   code src/utils/merkleTree.ts

   # Test merkle tree
   npm run test merkleTree
   ```

2. **Deploy edge function**:
   ```bash
   npm run supabase:deploy aoi-verify-transaction
   ```

3. **Build UI components**:
   ```bash
   # Create LedgerPage
   code src/pages/LedgerPage.tsx

   # Run dev server
   npm run dev
   ```

### For Project Managers

- **Week 1**: Focus on backend (proof infrastructure)
- **Week 2-3**: Focus on frontend (ledger UI)
- **Week 4**: Reports page
- **Week 5**: Orbital & aOi pages
- **Week 6-8**: Testing and polish

---

## 📞 QUESTIONS & CLARIFICATIONS

### Q: Should we integrate with OpenTimestamps or build custom?
**A**: Use OpenTimestamps (free, Bitcoin-based, proven). Custom solution would take 10x longer.

### Q: How often should we batch merkle roots?
**A**: Daily batches (all transactions from previous day). Allows efficient verification while maintaining granularity.

### Q: Should aOi verification be automatic or manual?
**A**: Automatic for routine checks (format, amounts), manual review for high-value transactions (>$10k).

### Q: PDF generation library?
**A**: Use `jsPDF` (client-side) or `puppeteer` (server-side). Client-side preferred for simplicity.

### Q: Real-time or polling for updates?
**A**: Supabase realtime (WebSockets). Already included, no extra cost.

---

## 🎯 SUCCESS METRICS

### Technical Metrics

- ✅ 100% of transactions have merkle proofs
- ✅ 99%+ orbital timestamp success rate
- ✅ <5 seconds average verification time
- ✅ All reports have integrity panels
- ✅ Export works for all data formats

### User Experience Metrics

- ✅ Ledger page loads <2 seconds
- ✅ Filters respond instantly
- ✅ Mobile responsive (100% compatibility)
- ✅ Accessibility score >95 (Lighthouse)

### Trust Metrics

- ✅ aOi transparency page reduces support tickets by 30%
- ✅ Proof verification success rate >99%
- ✅ User confidence score increases (survey)

---

**End of Task List**

*Ready to implement? Start with Phase 1, Task 1.1.*
*Questions? Contact OlekF (olekfribel@hotmail.com)*
