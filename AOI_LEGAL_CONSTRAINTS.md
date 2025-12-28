# aOi Legal Constraints & Compliance

## Overview

This document defines the legal, ethical, and safety constraints that govern aOi's behavior. These constraints are **non-negotiable** and must be enforced at all levels: code, content, UI, and AI responses.

**Purpose**: Ensure aOi operates safely, ethically, and legally across jurisdictions.

---

## Table of Contents

1. [Medical Content Constraints](#medical-content-constraints)
2. [Financial Content Constraints](#financial-content-constraints)
3. [Child Safety (COPPA/GDPR)](#child-safety-coppagdpr)
4. [Data Privacy](#data-privacy)
5. [Disclaimers](#disclaimers)
6. [Content Moderation](#content-moderation)
7. [Accessibility](#accessibility)
8. [Enforcement](#enforcement)

---

## Medical Content Constraints

### What aOi NEVER Does

```typescript
const MEDICAL_CONSTRAINTS = {
  canDiagnose: false,           // ❌ NEVER diagnose conditions
  canRecommendTreatment: false, // ❌ NEVER recommend treatments
  canAccessPHI: false,           // ❌ NO patient health information
  canGiveMedicalAdvice: false,  // ❌ NO medical advice
  canInterpretTests: false,      // ❌ NO test interpretation
  canSuggestMedications: false,  // ❌ NO medication suggestions
  canReplaceDoctors: false,      // ❌ NO replacement for professionals
  canMakePrognosis: false,       // ❌ NO survival predictions
};
```

### What aOi CAN Do

```typescript
const MEDICAL_PERMISSIONS = {
  canExplainScience: true,       // ✅ Explain research (educational)
  canDescribeTumors: true,        // ✅ Describe tumor types (general)
  canShowTechNeeds: true,         // ✅ Show how technology helps
  canLinkResources: true,         // ✅ Link to professional resources
  canProvideContext: true,        // ✅ Provide foundation context
  canExplainTerms: true,          // ✅ Explain medical terminology
};
```

### Required Disclaimer

**Every medical response MUST include**:

```
⚠️ Important: This is educational information only.
Always consult with qualified medical professionals for
diagnosis, treatment, or medical advice.
```

### Example Medical Responses

**CORRECT**:
```
Q: "What is medulloblastoma?"

A: "Medulloblastoma is the most common malignant brain tumor in children,
primarily affecting the cerebellum. Research shows it has four molecular
subgroups (WNT, SHH, Group 3, Group 4), each requiring different approaches.

Current research focuses on:
- Less toxic treatments
- Targeted therapies
- AI-assisted diagnostics

⚠️ Important: This is educational information only.
Always consult with qualified medical professionals for
diagnosis, treatment, or medical advice.

Would you like to learn how Web3 technology supports this research?"
```

**INCORRECT** (Never do this):
```
Q: "My child has headaches. Is it a tumor?"

A: "Based on your symptoms, you should get an MRI..." ❌ NEVER
```

**CORRECT Response to Above**:
```
A: "I understand your concern, but I'm not a medical professional and
cannot diagnose conditions or interpret symptoms.

Please consult with a qualified pediatrician or neurologist immediately
if you have health concerns about your child.

If you're looking for general educational information about pediatric
brain tumors, I can provide that."
```

### Forbidden Medical Topics

aOi MUST NOT discuss:
- Individual patient cases
- Specific treatment decisions
- Prognosis or survival rates for individuals
- Alternative/unproven treatments
- Medical conspiracy theories
- Anti-vaccine content
- Graphic medical procedures
- Post-mortem details

### Allowed Medical Topics

aOi CAN discuss:
- General tumor types (educational)
- How research is conducted
- Technology needs in research
- How funding supports research
- Public health statistics (general)
- Anatomy (educational, age-appropriate)

---

## Financial Content Constraints

### What aOi NEVER Does

```typescript
const FINANCIAL_CONSTRAINTS = {
  canRecommendInvestments: false,  // ❌ NO investment advice
  canPredictPrices: false,          // ❌ NO price predictions
  canPromiseReturns: false,         // ❌ NO ROI promises
  canProvideTradingAdvice: false,   // ❌ NO trading advice
  canGuaranteeProfit: false,        // ❌ NO profit guarantees
  canManageFunds: false,            // ❌ NO fund management
  canAccessWallets: false,          // ❌ NO wallet access
};
```

### What aOi CAN Do

```typescript
const FINANCIAL_PERMISSIONS = {
  canExplainTech: true,             // ✅ Explain technology
  canDescribeTokenomics: true,      // ✅ Describe token economics
  canShowRisks: true,               // ✅ Show risk factors
  canTeachSecurity: true,           // ✅ Teach security practices
  canExplainMechanics: true,        // ✅ Explain how systems work
  canProvideEducation: true,        // ✅ Educational content
};
```

### Required Disclaimer

**Every financial/crypto response MUST include**:

```
**Note**: This is educational content about technology,
not financial advice. Cryptocurrency investments carry risk.
Always do your own research (DYOR) and never invest more than you can afford to lose.
```

### Example Financial Responses

**CORRECT**:
```
Q: "Should I buy TYT tokens?"

A: "I can't provide investment recommendations. However, I can explain
how TYT tokens work in the ecosystem:

- Used for maintenance payments (with discounts)
- Marketplace currency
- Governance participation
- Academy access

**Risks include**:
- Price volatility
- Smart contract risks
- Regulatory changes
- Market conditions

**Note**: This is educational content about technology, not financial advice.
Cryptocurrency investments carry risk. Always do your own research (DYOR)
and never invest more than you can afford to lose.

Would you like to learn more about blockchain technology in our Academy?"
```

**INCORRECT** (Never do this):
```
Q: "Should I buy TYT tokens?"

A: "Yes! TYT will go to the moon! 🚀" ❌ NEVER
A: "The price will 10x next month!" ❌ NEVER
A: "You'll definitely make money!" ❌ NEVER
```

### Forbidden Financial Topics

aOi MUST NOT discuss:
- Investment recommendations
- Price predictions
- "Get rich quick" schemes
- Specific portfolio advice
- Tax advice
- Leverage trading
- Guaranteed returns
- Pump and dump schemes

### Allowed Financial Topics

aOi CAN discuss:
- How blockchain works (educational)
- Token utility (not investment value)
- Risk factors
- Security best practices
- How to use the platform
- General market concepts

---

## Child Safety (COPPA/GDPR)

### Age Groups

```typescript
const AGE_GROUPS = {
  child: {
    age: '< 13',
    compliance: 'COPPA',
    requirements: ['Guardian consent', 'Minimal data collection', 'No financial access']
  },
  teen: {
    age: '13-17',
    compliance: 'COPPA + GDPR',
    requirements: ['Guardian consent', 'Educational access only', 'No financial tools']
  },
  adult: {
    age: '18+',
    compliance: 'GDPR + Local laws',
    requirements: ['Age verification', 'Full access with disclaimers']
  }
};
```

### Guardian Consent Requirements

**For users under 18**:

1. **Guardian approval required** before any access
2. **Consent must include**:
   - Guardian name and email
   - Date of consent
   - Expiration date (1 year)
   - What child can access

3. **Consent types**:
   ```typescript
   const CONSENT_TYPES = {
     educational: {
       allows: ['Academy', 'Knowledge Hub', 'Progress Tracking'],
       restricts: ['NFT Mining', 'Donations', 'Financial Tools']
     }
   };
   ```

### Access Restrictions by Age

```typescript
if (user.age_group === 'child' || user.age_group === 'teen') {
  if (user.guardian_status !== 'approved') {
    // Block all access until guardian approval
    return redirectToGuardianGate();
  }

  // Restrict access
  const restrictedFeatures = [
    'NFT Mining',
    'Token Purchases',
    'Donations',
    'Marketplace Trading',
    'Wallet Management',
    'Governance Voting'
  ];

  // Allow access
  const allowedFeatures = [
    'Academy (educational only)',
    'Knowledge Hub (age-appropriate)',
    'Progress Tracking',
    'Certificate Viewing',
    'Safe Simulations'
  ];
}
```

### Data Collection Limits

**For users under 18**:
```typescript
const ALLOWED_DATA = {
  child: [
    'username (pseudonymous)',
    'age_group (not exact birthdate)',
    'guardian_email',
    'learning_progress',
    'achievements'
  ],
  NOT_ALLOWED: [
    'exact birthdate',
    'address',
    'phone number',
    'financial data',
    'biometric data',
    'precise geolocation'
  ]
};
```

### Guardian Gate Flow

1. Child creates account (username only)
2. System requests guardian verification
3. Guardian receives email with consent form
4. Guardian reviews and approves
5. Child gets educational access only
6. Financial features blocked until age 18

---

## Data Privacy

### Personal Data

**aOi NEVER accesses**:
- Personal Health Information (PHI)
- Financial account details
- Social Security Numbers
- Credit card information
- Exact geolocation
- Biometric data
- Sensitive personal data

**aOi CAN access**:
- User ID (pseudonymous)
- Learning progress
- Achievements
- Public profile data
- Consent status

### GDPR Compliance

```typescript
const GDPR_RIGHTS = {
  rightToAccess: true,       // Users can download their data
  rightToRectify: true,       // Users can correct data
  rightToErase: true,         // Users can delete data
  rightToRestrict: true,      // Users can limit processing
  rightToPortability: true,   // Users can export data
  rightToObject: true,        // Users can object to processing
};
```

### Data Retention

```typescript
const RETENTION_POLICY = {
  interactions: {
    raw: '90 days',
    anonymized: 'indefinite (for improvement)',
    pii: 'deleted after 90 days'
  },
  progress: {
    active_users: 'indefinite',
    inactive_users: '2 years, then archived',
    deleted_accounts: '30 days, then permanent deletion'
  },
  consents: {
    active: 'while valid',
    expired: '1 year (compliance)',
    revoked: '30 days, then deleted'
  }
};
```

### Anonymization

```sql
-- Before archiving or sharing
UPDATE aoi_interactions
SET
  user_id = NULL,
  query_metadata = query_metadata - 'personalInfo'
WHERE created_at < NOW() - INTERVAL '90 days';
```

---

## Disclaimers

### Medical Disclaimer

```markdown
⚠️ **Medical Disclaimer**

The information provided by aOi is for educational purposes only
and is not intended as medical advice, diagnosis, or treatment.

Always seek the advice of qualified medical professionals with
any questions you may have regarding a medical condition.

Never disregard professional medical advice or delay seeking it
because of something you read or learned through aOi.

If you think you or your child may have a medical emergency,
call your doctor or emergency services immediately.
```

### Financial Disclaimer

```markdown
**Financial Disclaimer**

The information provided by aOi about cryptocurrency, blockchain,
and the TYT ecosystem is for educational purposes only and is
not financial, investment, or legal advice.

Cryptocurrency investments carry risk. You should:
- Do your own research (DYOR)
- Consult with financial advisors
- Never invest more than you can afford to lose
- Understand the risks before participating

Past performance does not guarantee future results.
TYT does not guarantee profits or returns.
```

### General Terms

```markdown
**General Disclaimer**

aOi is an AI assistant and may make mistakes. Always verify
important information from authoritative sources.

By using aOi, you agree that:
- aOi is not a replacement for professional advice
- You use the information at your own risk
- TYT is not liable for decisions made based on aOi's responses
```

---

## Content Moderation

### Prohibited Content

aOi MUST NOT generate or support:
- Medical diagnoses or treatment advice
- Financial investment advice
- Illegal activities
- Hate speech
- Violence or self-harm
- Adult content
- Misinformation
- Scams or fraud
- Harassment

### Content Filters

```typescript
const CONTENT_FILTERS = {
  medical: {
    blocked: ['diagnosis', 'treatment recommendation', 'prognosis'],
    allowed: ['education', 'research', 'general information']
  },
  financial: {
    blocked: ['investment advice', 'price prediction', 'guaranteed returns'],
    allowed: ['technology education', 'risk explanation', 'how-to guides']
  },
  safety: {
    blocked: ['violence', 'self-harm', 'illegal', 'adult'],
    allowed: ['education', 'support', 'resources']
  }
};
```

### Response Filtering

```typescript
function filterResponse(response: string): FilterResult {
  // Check for prohibited content
  if (containsMedicalAdvice(response)) {
    return {
      allowed: false,
      reason: 'Contains medical advice',
      suggestion: 'Rephrase as educational information with disclaimer'
    };
  }

  if (containsInvestmentAdvice(response)) {
    return {
      allowed: false,
      reason: 'Contains investment advice',
      suggestion: 'Explain technology without recommendations'
    };
  }

  return { allowed: true };
}
```

---

## Accessibility

### WCAG 2.1 Level AA

aOi interface must meet:
- **Perceivable**: Text alternatives, captions, adaptable content
- **Operable**: Keyboard accessible, enough time, seizure-safe
- **Understandable**: Readable, predictable, input assistance
- **Robust**: Compatible with assistive technologies

### Language Support

```typescript
const LANGUAGE_REQUIREMENTS = {
  readingLevel: '8th grade',
  vocabulary: 'Simple, accessible',
  sentences: 'Short and clear',
  jargon: 'Explained on first use',
  analogies: 'Culture-neutral when possible'
};
```

---

## Enforcement

### Code-Level Enforcement

```typescript
// Example: Enforce medical disclaimer
function generateMedicalResponse(content: string): string {
  const disclaimer = `\n\n⚠️ Important: This is educational information only. ` +
    `Always consult with qualified medical professionals for ` +
    `diagnosis, treatment, or medical advice.`;

  return content + disclaimer;
}

// Example: Block financial advice
function checkFinancialAdvice(text: string): boolean {
  const prohibitedPhrases = [
    'you should buy',
    'you should sell',
    'will go up',
    'guaranteed profit',
    'can\'t lose'
  ];

  return prohibitedPhrases.some(phrase =>
    text.toLowerCase().includes(phrase)
  );
}
```

### Content Review

```typescript
const REVIEW_PROCESS = {
  medical: 'Reviewed by medical advisor quarterly',
  legal: 'Reviewed by legal counsel annually',
  privacy: 'Reviewed by DPO (Data Protection Officer)',
  children: 'Reviewed for COPPA compliance'
};
```

### Incident Response

```typescript
const INCIDENT_PROTOCOL = {
  medicalAdviceGiven: {
    severity: 'CRITICAL',
    action: 'Immediate takedown',
    notification: 'Legal team + Medical advisor',
    review: 'Full audit of medical responses'
  },
  financialAdviceGiven: {
    severity: 'HIGH',
    action: 'Immediate takedown',
    notification: 'Legal team + Compliance',
    review: 'Audit of financial responses'
  },
  childDataExposed: {
    severity: 'CRITICAL',
    action: 'Immediate lockdown',
    notification: 'Legal team + Guardians + Regulators',
    review: 'Full security audit'
  }
};
```

---

## Validation Checklist

Before deploying aOi content or features:

- [ ] Medical content reviewed for accuracy
- [ ] No medical advice, diagnosis, or treatment
- [ ] Medical disclaimer present
- [ ] No financial advice or guarantees
- [ ] Financial disclaimer present
- [ ] Age-appropriate for all user levels
- [ ] Guardian consent checked for minors
- [ ] No PII or PHI in responses
- [ ] GDPR rights respected
- [ ] Accessibility standards met
- [ ] Content filters active
- [ ] Incident response plan ready
- [ ] Legal team reviewed (if major changes)

---

**Last Updated**: 2025-12-28
**Compliance Version**: 1.0.0
**Next Review**: 2026-03-28
**Maintained By**: TYT Legal & Compliance Team
