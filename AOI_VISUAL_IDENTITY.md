# aOi Visual Identity Guide

## Overview

This document defines the visual canon for aOi (葵), the AI navigation assistant for the TYT ecosystem. This identity is **immutable** and must be followed across all platforms, assets, and implementations.

**Core Principle**: `soft + tech + academic`

---

## Table of Contents

1. [Character Canon](#character-canon)
2. [Visual Evolution](#visual-evolution)
3. [Color System](#color-system)
4. [Typography](#typography)
5. [Interface Elements](#interface-elements)
6. [Asset Generation](#asset-generation)
7. [Usage Guidelines](#usage-guidelines)
8. [Forbidden Elements](#forbidden-elements)

---

## Character Canon

### Basic Identity

```typescript
const AOI_IDENTITY = {
  name: 'aOi',
  kanji: '葵',
  meaning: 'Hollyhock / Blue-Green (growth, life, calm, intelligence)',
  pronunciation: 'ah-oh-ee',
  age_appearance: '16-18',
  gender_presentation: 'neutral-feminine',
  role: 'AI Navigation Assistant & Educational Guide',
};
```

### Character Essence

**Who is aOi?**
- Modern educational AI guide
- Bridge between technology and medicine
- Supporter of children's brain cancer research
- Trustworthy and warm presence
- NOT: chatbot, mascot, influencer, or sexualized character

**Personality Traits**:
```typescript
const PERSONALITY = {
  tone: ['calm', 'confident', 'trustworthy', 'warm'],
  approach: ['educational', 'empathetic', 'non-authoritarian'],
  forbidden: [
    'medical advice',
    'financial advice',
    'guaranteed outcomes',
    'authoritarian tone'
  ],
  communication_style: {
    beginner: "I'm here, I'll explain",
    explorer: "Let's figure this out together",
    builder: "You're capable, I'll show the way",
    guardian: "I'm monitoring to keep things safe"
  }
};
```

### Physical Description

**Face**:
- Big expressive eyes full of kindness and awareness
- Soft confident smile (not "cute", but supporting)
- Realistic proportions, no exaggeration
- Clean, precise lines
- Gender-neutral features with feminine lean

**Hair**:
- Medium length (shoulder-length or slightly shorter)
- Soft, natural style
- Color: Dark blue, blue-black, or soft violet tones
- Not overly detailed or "anime spiky"

**Clothing**:
- Minimalistic hoodie or light jacket
- Colors: Lavender (#9b87f5), Soft Blue, White
- Subtle tech/science details:
  - Small badge (brain/chip/network icon)
  - Bracelet with gentle interface glow
  - Clean, modern aesthetic
- NO: Elaborate outfits, revealing clothing, brand logos

**Background**:
- Soft abstract gradient (lavender to cyan)
- OR very subtle futuristic medical/tech interface
- Clean, minimal, non-intrusive
- NO: Busy patterns, aggressive UI, clutter

**Mood**:
- Hopeful, caring, reassuring
- Professional warmth
- Intelligent presence
- Protective but not parental

---

## Visual Evolution

aOi evolves appearance based on user level, creating a sense of growth without changing core identity.

### Level 1: Beginner

**Age Feel**: 16 (softer, more approachable)

**Visual Characteristics**:
```typescript
const BEGINNER = {
  features: 'Softer, rounder face, maximum empathy',
  eyes: 'Wide, open, extremely kind',
  posture: 'Gentle, welcoming, approachable',
  clothing: 'Simple lavender hoodie, minimal tech details',
  background: 'Soft pastel gradient, almost no interface',
  interface: 'Large, simple icons, lots of white space',
  tone: "I'm here, I'll explain everything"
};
```

**Master Prompt**:
```
aOi at beginner level: maximum empathy and warmth, very soft features,
gentle smile, welcoming posture. Soft lavender hoodie, minimal tech details.
Background: soft pastel gradient. Pure kindness in eyes.
Age appearance: 16, very soft and approachable.
```

---

### Level 2: Explorer

**Age Feel**: 17 (more confident, curious)

**Visual Characteristics**:
```typescript
const EXPLORER = {
  features: 'Clearer face, more focused gaze',
  eyes: 'Confident, curious, intelligent',
  posture: 'Leaning forward slightly, engaged',
  clothing: 'Light blue jacket, small tech badge visible',
  background: 'Faint diagrams or schemas appearing',
  interface: 'Icons + simple text, schemas emerge',
  tone: "Let's figure this out together"
};
```

**Master Prompt**:
```
aOi at explorer level: clearer, more focused gaze, subtle confidence growing.
Light blue jacket, small tech badge visible. Background: faint diagrams or
schemas appearing. Intelligent curiosity in eyes.
Age appearance: 17, confident but still warm.
```

---

### Level 3: Builder

**Age Feel**: 18 (mature, technical)

**Visual Characteristics**:
```typescript
const BUILDER = {
  features: 'More mature face proportions, sharp intelligent eyes',
  eyes: 'Focused, analytical, still kind',
  posture: 'Confident, professional, guiding',
  clothing: 'White jacket with tech details, bracelet with interface glow',
  background: 'Subtle holographic elements, micro-diagrams',
  interface: 'Diagrams, code snippets, technical data',
  tone: "You're capable, I'll show the way"
};
```

**Master Prompt**:
```
aOi at builder level: more mature appearance, confident posture,
sharp intelligent eyes. White jacket with tech details, bracelet with
interface glow. Background: subtle holographic elements. Professional warmth.
Age appearance: 18, mature but caring.
```

---

### Level 4: Guardian

**Age Feel**: 18 (authoritative, protective)

**Visual Characteristics**:
```typescript
const GUARDIAN = {
  features: 'Maximum composure, strong but caring presence',
  eyes: 'Calm, watchful, protective',
  posture: 'Upright, confident, monitoring',
  clothing: 'Full tech interface integration, command elements',
  background: 'Control center, status panels, system monitors',
  interface: 'Full dashboard, security indicators, system status',
  tone: "I'm monitoring to keep things safe"
};
```

**Master Prompt**:
```
aOi at guardian level: maximum composure and authority, strong but caring
presence. Full tech interface, command center background elements.
Protective and wise. Leadership aura.
Age appearance: 18, authoritative but still empathetic.
```

---

## Color System

### Primary Colors

```typescript
const COLORS = {
  primary: '#9b87f5',    // Lavender (main identity color)
  accent: '#00F0FF',     // Cyan (tech accent)
  gold: '#D2A44C',       // Gold (achievement, warmth)
  background: '#0A1122', // Navy (depth, sophistication)
};
```

### Color Usage

```css
/* Character */
.aoi-hoodie-beginner { color: #9b87f5; } /* Lavender */
.aoi-hoodie-explorer { color: #7dd3fc; } /* Soft Blue */
.aoi-hoodie-builder { color: #ffffff; }  /* White */
.aoi-hoodie-guardian { color: #e0e7ff; } /* Light Lavender */

/* Interface Elements */
.aoi-interface-glow { color: #00F0FF; }  /* Cyan */
.aoi-badge { color: #D2A44C; }           /* Gold */
.aoi-background { color: #0A1122; }      /* Navy */

/* Text */
.aoi-text-primary { color: #9b87f5; }
.aoi-text-accent { color: #00F0FF; }
.aoi-text-warm { color: #D2A44C; }
```

### Gradients

```css
/* Background gradients */
.aoi-bg-beginner {
  background: linear-gradient(135deg, #9b87f5 0%, #e0e7ff 100%);
}

.aoi-bg-explorer {
  background: linear-gradient(135deg, #7dd3fc 0%, #9b87f5 100%);
}

.aoi-bg-builder {
  background: linear-gradient(135deg, #9b87f5 0%, #00F0FF 50%, #0A1122 100%);
}

.aoi-bg-guardian {
  background: linear-gradient(135deg, #0A1122 0%, #9b87f5 50%, #00F0FF 100%);
}
```

---

## Typography

### Font Recommendations

**Primary**: Inter, SF Pro, or similar modern sans-serif
**Accent**: Fira Code (for code examples)
**Japanese**: Noto Sans JP (for 葵)

```css
.aoi-text {
  font-family: 'Inter', -apple-system, system-ui, sans-serif;
  font-weight: 400;
  line-height: 1.5;
}

.aoi-heading {
  font-family: 'Inter', -apple-system, system-ui, sans-serif;
  font-weight: 600;
  line-height: 1.2;
}

.aoi-code {
  font-family: 'Fira Code', 'Monaco', monospace;
  font-weight: 400;
}

.aoi-kanji {
  font-family: 'Noto Sans JP', sans-serif;
  font-weight: 500;
}
```

### Text Hierarchy

```typescript
const TYPOGRAPHY = {
  display: {
    size: '3rem',
    weight: 600,
    usage: 'Hero sections, major headings'
  },
  h1: {
    size: '2rem',
    weight: 600,
    usage: 'Main page titles'
  },
  h2: {
    size: '1.5rem',
    weight: 600,
    usage: 'Section titles'
  },
  body: {
    size: '1rem',
    weight: 400,
    lineHeight: '1.5',
    usage: 'Main content'
  },
  caption: {
    size: '0.875rem',
    weight: 400,
    usage: 'Helper text, captions'
  }
};
```

---

## Interface Elements

### Badges

```typescript
const BADGES = {
  beginner: {
    icon: '🌱',
    color: '#9b87f5',
    shape: 'circle',
    size: 'small'
  },
  explorer: {
    icon: '🔍',
    color: '#00F0FF',
    shape: 'circle',
    size: 'medium'
  },
  builder: {
    icon: '🔧',
    color: '#D2A44C',
    shape: 'hexagon',
    size: 'medium'
  },
  guardian: {
    icon: '🛡️',
    color: '#D2A44C',
    shape: 'shield',
    size: 'large'
  }
};
```

### Interface Glow

```css
.aoi-interface-glow {
  box-shadow:
    0 0 10px rgba(0, 240, 255, 0.3),
    0 0 20px rgba(0, 240, 255, 0.2),
    0 0 30px rgba(0, 240, 255, 0.1);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}
```

### Status Indicators

```typescript
const STATUS_INDICATORS = {
  online: {
    color: '#10b981',
    icon: '●',
    label: 'aOi is online'
  },
  thinking: {
    color: '#00F0FF',
    icon: '◐',
    label: 'aOi is thinking',
    animated: true
  },
  offline: {
    color: '#6b7280',
    icon: '○',
    label: 'aOi is offline (fallback mode)'
  }
};
```

---

## Asset Generation

### Master Prompt (Universal)

```
A modern Japanese anime girl named aOi,
designed as an educational AI guide and protector.

Age appearance: adaptive 16–18 (safe, non-sexualized),
mature kawaii, intelligent, warm and empathetic.

Big expressive eyes full of kindness and awareness,
soft confident smile, calm and trustworthy presence.

Modern anime art style, high quality illustration,
clean precise lines, soft diffused lighting,
realistic proportions, no exaggeration.

Wearing a minimalistic hoodie or light jacket
in soft pastel colors (lavender, soft blue, white),
subtle science or technology details
(small badge, bracelet, gentle interface glow).

Background: soft abstract gradient or very subtle
futuristic medical / educational interface,
clean, minimal, non-intrusive.

Mood: hopeful, caring, reassuring.

Style keywords:
modern anime, kawaii but mature,
educational character, empathy,
science-friendly, clean aesthetic,
high detail, 4k quality.

No sexualization.
No glamour.
No lifestyle photography.
No real-person resemblance.
```

### Level-Specific Prompts

See [Visual Evolution](#visual-evolution) section for level-specific prompts.

### Asset Specifications

```typescript
const ASSET_SPECS = {
  avatar: {
    size: '512x512px',
    format: 'PNG with transparency',
    usage: 'Profile pictures, small UI elements'
  },
  hero: {
    size: '1920x1080px',
    format: 'PNG or WebP',
    usage: 'Hero sections, landing pages'
  },
  thumbnail: {
    size: '256x256px',
    format: 'PNG',
    usage: 'Chat bubbles, notifications'
  },
  og_image: {
    size: '1200x630px',
    format: 'PNG or JPG',
    usage: 'Social media sharing'
  }
};
```

---

## Usage Guidelines

### DO

- Use aOi to guide users through complex topics
- Show aOi evolving with user progress
- Maintain soft + tech + academic aesthetic
- Keep backgrounds minimal and non-distracting
- Use aOi to create trust and empathy
- Include appropriate level badge/indicator
- Respect the color system
- Keep proportions realistic

### DON'T

- Don't sexualize or glamorize aOi
- Don't use aOi for marketing/hype
- Don't add unnecessary accessories
- Don't use busy or distracting backgrounds
- Don't change core identity (葵)
- Don't use aOi in medical/financial advice contexts
- Don't create "real person" photos
- Don't add brand logos or commercial elements

### Context-Appropriate Usage

```typescript
const USAGE_CONTEXTS = {
  educational: {
    appropriate: true,
    examples: ['Academy lessons', 'Knowledge articles', 'Tutorials']
  },
  guidance: {
    appropriate: true,
    examples: ['Navigation', 'Help system', 'Onboarding']
  },
  medical_explanation: {
    appropriate: true,
    condition: 'With disclaimer, educational only'
  },
  medical_advice: {
    appropriate: false,
    never: 'aOi NEVER gives medical advice'
  },
  financial_advice: {
    appropriate: false,
    never: 'aOi NEVER gives investment advice'
  },
  marketing: {
    appropriate: false,
    reason: 'aOi is not a mascot or brand character'
  }
};
```

---

## Forbidden Elements

### NEVER Include

- Sexualized clothing or poses
- Revealing outfits
- Suggestive expressions
- Glamour photography style
- Lifestyle influencer aesthetic
- Real-person resemblance
- Commercial brand logos
- Medical symbols (stethoscope, etc.)
- Financial symbols (money, charts)
- Aggressive or dark themes
- Childish or "chibi" style (except for specific educational contexts)

### Style Violations

**INCORRECT Examples**:
- aOi in bikini ❌
- aOi with makeup/glamour ❌
- aOi as "realistic child photo" ❌
- aOi with TikTok-style poses ❌
- aOi with commercial products ❌
- aOi in hospital scrubs ❌
- aOi holding money ❌

**CORRECT Examples**:
- aOi in simple hoodie, teaching ✅
- aOi with soft smile, guiding ✅
- aOi with tech badge, explaining ✅
- aOi with gentle interface glow ✅
- aOi in educational context ✅

---

## File Organization

### Asset Location

```
/public/aoi/
  ├── beginner-neutral.png
  ├── beginner-happy.png
  ├── beginner-thinking.png
  ├── explorer-neutral.png
  ├── explorer-thinking.png
  ├── explorer-excited.png
  ├── builder-neutral.png
  ├── builder-excited.png
  ├── builder-focused.png
  ├── guardian-neutral.png
  ├── guardian-monitoring.png
  └── guardian-protective.png
```

### TypeScript Config

Location: `/src/config/aoiAssets.ts`

```typescript
export const AOI_CHARACTER = {
  name: 'aOi',
  kanji: '葵',
  age: '16-18',
  role: 'AI Navigation Assistant',
  personality: ['empathetic', 'intelligent', 'trustworthy', 'warm'],
  colors: {
    primary: '#9b87f5',
    secondary: '#00F0FF',
    accent: '#D2A44C',
  },
  description: 'Modern Japanese anime girl, educational guide character...',
};
```

---

## Validation Checklist

Before using any aOi asset:

- [ ] Age appearance: 16-18, non-sexualized
- [ ] Clothing: Modest, minimalistic
- [ ] Background: Clean, minimal
- [ ] Expression: Appropriate for context
- [ ] Style: soft + tech + academic
- [ ] No forbidden elements
- [ ] Matches level characteristics
- [ ] High quality (4k)
- [ ] Color system followed
- [ ] Proportions realistic
- [ ] Educational purpose clear
- [ ] No commercial/brand elements

---

**Last Updated**: 2025-12-28
**Version**: 1.0.0
**Canonical Status**: IMMUTABLE CORE
**Maintained By**: TYT Design Team

---

**Remember**: aOi is not a mascot. She is a trusted guide, a bridge between complex technology and human understanding, and a symbol of hope for children's medical research.
