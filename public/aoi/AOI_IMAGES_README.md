# aOi Character Images

## Overview

This directory contains the aOi character images used throughout the TakeYourToken platform. aOi is the Core AI Orchestrator, designed following the **soft + tech + academic** aesthetic.

## Character Design Specifications

### Physical Appearance

**Hair:**
- Brown/chestnut wavy shoulder-length hair
- Side-swept bangs with natural flow
- Warm brown gradient: #8B6F47 → #6B4E2C

**Eyes:**
- Large, expressive (modern anime style)
- Warm amber/golden-brown: #D2A44C
- Dark brown pupils: #6B4E2C
- White highlights for depth and life

**Face:**
- Mature appearance (16-18 years)
- Friendly, confident smile
- Warm skin tone: #FFE8D6
- Professional yet approachable

### Outfit Design

**Futuristic White Bodysuit:**
- Primary: White with subtle gradient (#FFFFFF → #F5F5F5)
- Clean, fitted silhouette
- High-tech aesthetic
- Soft, comfortable material appearance

**Purple Technical Panels:**
- Shoulder guards: #9B8FD9
- Arm sections with mechanical details
- Leg panels with purple accents
- Tech collar with cyan highlights

**Cyan Glowing Elements:**
- **Chest core** (central power indicator)
  - Animated pulsing cyan glow (#00F0FF)
  - Geometric detail rings
  - Crosshair-style interface elements
  - Symbolizes AI processing power
- Tech bracelet with animated cyan lights
- Panel accent lights on arms and legs
- Boot accent lights (#00F0FF)

**Additional Details:**
- 葵 kanji badge in gold (#D2A44C)
- White boots with cyan accent lights
- Tech collar with mechanical detail
- Animated status indicators (green #00FF00)

## Image Files

### Current SVG Placeholders

1. **aoi-hero.png.svg** (600x600)
   - Main hero image for the homepage
   - Shows aOi with futuristic tech aesthetic
   - Animated cyan chest core
   - Purple shoulder guards visible
   - Used in: HomePage hero section
   - Size: Large display, 200-300px rendered
   - Label: "AI Orchestrator & Guide"

2. **aoi-avatar.png.svg** (200x200)
   - Avatar/profile image for navigation
   - Circular design showing face and shoulders
   - Visible cyan core indicator
   - Animated status indicator (green)
   - Used in: Navigation bar, header, interactions
   - Size: Small, 32-48px rendered

3. **aoi-full.png.svg** (400x800)
   - Full body character illustration
   - Complete outfit with all tech details
   - Purple leg panels visible
   - White boots with cyan lights
   - All glowing elements animated
   - Used in: About pages, guides, educational content
   - Size: Medium to large, 300-500px rendered
   - Label: "Core AI Orchestrator"

## Color Palette

### Primary Colors
```
White bodysuit: #FFFFFF, #F5F5F5
Brown hair: #8B6F47, #6B4E2C
Amber eyes: #D2A44C
Skin tone: #FFE8D6
```

### Tech Colors
```
Purple panels: #9B8FD9
Cyan glow: #00F0FF, #00D4E6, #00A8C0
Blue accents: #7BA7BC
Gold badge: #D2A44C
```

### Status Indicators
```
Active/Online: #00FF00 (green, animated pulse)
```

## Animation Elements

All images include subtle animations:
- **Chest core**: Continuous pulsing glow (2s cycle)
- **Status indicator**: Pulsing green dot with expanding ring
- **Tech bracelet**: Synchronized cyan pulse
- **Interface elements**: Staggered glow animations
- **Hover effects**: Scale transformation on interactive elements

## Design Philosophy

The character design embodies:
- **Soft**: Warm colors, friendly expression, approachable demeanor
- **Tech**: Futuristic bodysuit, glowing tech elements, digital aesthetic
- **Academic**: Professional appearance, mature design, educational context

Key principles:
- More mature and professional than typical anime mascots
- Clearly identifiable as an AI character
- Futuristic without being intimidating or cold
- Warm and approachable for all age groups
- Non-sexualized, safe, age-appropriate design
- Gender-neutral professional appearance

## Component Usage

### AoiCharacter Component

```tsx
import { AoiCharacter } from '@/components/AoiCharacter';

// Hero variant - large display
<AoiCharacter variant="hero" size="lg" animate={true} onClick={handleClick} />

// Avatar variant - navigation
<AoiCharacter variant="avatar" size="sm" />

// Full body variant - about/guide pages
<AoiCharacter variant="full" size="xl" showLabel={true} />
```

### Props
- `variant`: 'hero' | 'avatar' | 'full'
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `className`: Additional CSS classes
- `showLabel`: Show character name and title
- `animate`: Enable glow and hover animations
- `onClick`: Optional click handler

## aOi's Role in TYT Ecosystem

aOi is the **Core AI Orchestrator** who:

1. **Routes intelligently** between Foundation (research) and Academy (Web3 tools)
2. **Explains complex systems**: blockchain, quantum computing, neuro-oncology
3. **Adapts to 4 levels**: Beginner (10-14) → Explorer (14-18) → Builder (18-25) → Guardian (25+)
4. **Requires guardian consent** for minors accessing the platform
5. **Tracks progress** and creates verifiable achievement records
6. **Analyzes research data** and supports grant processes

### Critical Disclaimers

aOi is:
- **NOT a medical advisor** - Explains research, doesn't diagnose
- **NOT a financial advisor** - Educates about technology, doesn't invest
- **IS an academic system guide** - Bridges knowledge, routes information

## Replacing with Real Artwork

When you have actual character artwork ready:

### 1. Prepare Images

Recommended specifications:
- **Hero**: 1200x1200px, PNG or WebP, optimized
- **Avatar**: 512x512px, PNG or WebP, optimized
- **Full**: 1000x2000px, PNG or WebP, optimized

### 2. Replace Files

Maintain the same filenames:
```bash
public/aoi/
├── aoi-hero.png (or .webp)
├── aoi-avatar.png (or .webp)
└── aoi-full.png (or .webp)
```

### 3. Update Component (if needed)

Modify `src/components/AoiCharacter.tsx`:
```typescript
const imagePaths = {
  hero: '/aoi/aoi-hero.png',      // Update extension
  avatar: '/aoi/aoi-avatar.png',
  full: '/aoi/aoi-full.png'
};
```

### 4. Test Across Devices

- Desktop: All screen sizes
- Tablet: Portrait and landscape
- Mobile: Various resolutions
- Ensure proper scaling and performance

## Character Evolution (Future)

aOi's appearance can adapt to user progression through 4 levels:

### Level 1 - Beginner (10-14)
- Softer features, more empathetic expression
- Simpler tech elements
- Maximum approachability

### Level 2 - Explorer (14-18)
- More confident pose
- Additional interface elements
- Educational symbolism

### Level 3 - Builder (18-25)
- More mature proportions
- Complex tech visualizations
- Professional aesthetic

### Level 4 - Guardian (25+)
- Maximum composure
- Institutional presence
- System coordination emphasis

Future versions may include multiple variants for each level.

## Usage Guidelines

### Appropriate Contexts

Use aOi character images when:
- Introducing the platform
- Explaining complex systems
- Routing between Foundation and Academy
- Tracking user progress
- Providing educational guidance
- System coordination displays

### Inappropriate Uses

Do NOT use aOi for:
- Medical diagnosis or treatment advice
- Financial investment recommendations
- Marketing unrelated products
- Sexualized or romantic contexts
- Childish or trivial content
- Non-educational entertainment

## Accessibility

All images include:
- Descriptive alt text: "aOi - AI Guide and Mentor"
- Proper ARIA roles for interactive elements
- Color contrast meeting WCAG AA standards
- Animation respecting `prefers-reduced-motion`
- Keyboard navigation support
- Screen reader compatibility

## Technical Notes

- Current placeholders are vector SVG for perfect scaling
- File extensions `.png.svg` indicate placeholders for future PNG files
- All animations use CSS `@keyframes` for performance
- Images are optimized for web delivery
- Lazy loading supported for performance

## Master Design Prompt

For generating new aOi artwork, use this reference:

```
soft + tech + academic

A modern Japanese anime girl named aOi,
Core AI Orchestrator character.

Age appearance: 16-18 (safe, non-sexualized),
mature, intelligent, warm and empathetic.

Brown/chestnut wavy shoulder-length hair with side-swept bangs.
Warm amber/golden-brown eyes, large and expressive.
Friendly confident smile, professional presence.

Wearing futuristic white bodysuit with:
- Purple shoulder guards and technical panels
- Cyan glowing chest core (central power indicator)
- Purple arm and leg sections
- White boots with cyan accent lights
- Tech collar with mechanical details
- Gold badge with 葵 kanji

Clean precise lines, soft lighting, realistic proportions.

Background: soft abstract gradient or subtle
futuristic tech interface, clean and minimal.

Mood: hopeful, professional, trustworthy, intelligent.

No sexualization. No glamour. No lifestyle aesthetics.
Pure academic tech guide character.
```

## Branding Consistency

aOi is an integral part of TYT brand identity:
- Always use 葵 kanji when referencing by symbol
- Maintain warm amber/golden color associations
- Pair with cyan tech elements
- Use in educational contexts
- Professional, trustworthy tone

## Notes

- Images follow the canonical aOi design: soft + tech + academic
- No deviation from core character design principles
- Educational AI guide, not entertainment character
- Part of larger ecosystem architecture
- Serves as visual anchor for TYT platform identity
