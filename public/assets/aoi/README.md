# aOi Character Assets

This folder contains all official aOi character images used throughout the TYT platform.

## Current Image Inventory

| Variant | Filename | Size | Description | Usage |
|---------|----------|------|-------------|-------|
| **fullbody** | `aoi-fullbody-welcome.png` | 294KB | NEW: Full body transparent background | Hero carousel, HomePage, full character displays |
| **portrait** | `portrait-close.png` | 1.4MB | Close-up face portrait | Avatars, chat, navigation buttons |
| **hero** | `hero-welcome.png` | 1.1MB | Full body standing welcome pose | Hero sections, AoiCharacter hero variant |
| **guiding** | `guiding-left.png` | 294KB | Pointing/guiding left gesture | Guided sections, tutorials |
| **pointing** | `pointing-right.png` | 1.1MB | Pointing right hand gesture | Navigation hints, directional cues |
| **presenting** | `presenting-open.png` | 1.1MB | Both hands presenting | Builder level, feature showcases |
| **standing** | `standing-neutral.png` | 294KB | Neutral standing pose | Guardian level, composed states |
| **celebration** | `celebration.jpg` | 884KB | Happy/celebrating expression | Success states, 404 page |

## Image Guidelines

Based on the canonical aOi character design:

- **Style**: Modern Japanese anime, soft + tech + academic
- **Colors**: Lavender, soft blue, white clothing
- **Expression**: Warm, empathetic, intelligent
- **Age appearance**: 16-18 (non-sexualized, educational)
- **Background**: Soft gradient or minimal tech elements

## Adding New Images

1. Generate or create image following the style guidelines
2. Save as PNG with transparent or soft gradient background
3. Recommended sizes:
   - hero: 512x512 or larger
   - portrait: 256x256 minimum
   - Others: 384x384 minimum
4. Optimize for web (compress without quality loss)

## Usage by Context

### Hero/Welcome Sections
- **Primary**: `aoi-fullbody-welcome.png` (transparent background, ideal for hero)
- **Fallback**: `hero-welcome.png`
- **Components**: HeroCarousel, HomePage aOi section

### Avatar/Chat/Navigation
- **Primary**: `portrait-close.png` (close-up, ideal for small circular avatars)
- **Components**: AoiAvatarVariant, AoiChatAvatar, AoiNavigationAvatar

### Full Character Display
- **Primary**: `aoi-fullbody-welcome.png`
- **Components**: AoiCharacterFull, AoiCharacter (full variant)

### Level-Based Character Evolution
- **Beginner** (10-14): `portrait-close.png` - Soft, empathetic
- **Explorer** (14-18): `guiding-left.png` - Active, teaching
- **Builder** (18-25): `presenting-open.png` - Confident, demonstrating
- **Guardian** (25+): `standing-neutral.png` - Composed, authoritative

### Special States
- **Celebration/Success**: `celebration.jpg`
- **Pointing/Navigation**: `pointing-right.png`

## Fallback Strategy

All components use multi-level fallback:
1. Primary asset from `/assets/aoi/[filename]`
2. Alternative asset (configured in aoiVariants.ts)
3. Ultimate fallback: Japanese character "葵" with gradient background

## Configuration Files

Image variants are managed in:
- **Type definitions**: `/src/config/aoiVariants.ts` - Main variant configuration
- **Asset metadata**: `/src/config/aoiAssets.ts` - Level-based asset mapping
- **Components**: Various avatar and character components

## aOi Character Identity

- **Name**: aOi (葵) - Japanese for "mallow flower"
- **Symbolism**: Growth (🌱), Wisdom (🧠), Intelligence (🧬)
- **Role**: AI Navigation Assistant & Educational Guide
- **Core Function**: Bridge complex systems (blockchain, quantum computing, neuro-oncology) to learners
- **Evolution**: Adapts appearance across 4 levels based on user age/experience

## Design Principles

All aOi images follow these strict guidelines:

✅ **YES:**
- Soft + tech + academic aesthetic
- Modern anime style, clean lines, high quality
- Empathetic, intelligent, trustworthy presence
- Age-appropriate (16-18 appearance)
- Educational character focus
- Colors: lavender, soft blue, white, gold accents
- Subtle tech details (badge, bracelet, interface glow)

❌ **NO:**
- Sexualization or glamour styling
- Lifestyle/fashion photography aesthetic
- Childish or immature appearance
- Aggressive UI elements
- Real-person resemblance

## Technical Specifications

- **Format**: PNG (transparent) preferred, JPG acceptable
- **Size Range**: 300KB - 1.5MB optimal
- **Background**: Transparent or soft gradient
- **Resolution**: High-res for responsive scaling
- **Naming**: kebab-case, descriptive (e.g., `aoi-fullbody-welcome.png`)

## Adding New Images

1. Generate/create following design guidelines above
2. Optimize for web (compress without quality loss)
3. Save as PNG with transparent background
4. Place file in `/public/assets/aoi/`
5. Update `/src/config/aoiVariants.ts` with new variant
6. Update this README
7. Test across viewport sizes and themes (light/dark)
8. Verify fallback chain functions correctly
