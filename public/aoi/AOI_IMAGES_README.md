# aOi Character Images

## Overview

This directory contains the aOi character images used throughout the TakeYourToken platform. aOi is the AI guide and mentor, designed following the **soft + tech + academic** aesthetic.

## Image Files

### Current Placeholder Images (SVG)

1. **aoi-hero.png.svg** (600x600)
   - Main hero image for the homepage
   - Shows aOi in a gentle, welcoming pose
   - Used in: HomePage hero section
   - Size: Large display, approximately 200-300px rendered

2. **aoi-avatar.png.svg** (200x200)
   - Avatar/profile image for navigation
   - Compact circular design
   - Used in: Navigation bar, header, user interactions
   - Size: Small, 32-48px rendered

3. **aoi-full.png.svg** (400x800)
   - Full body character illustration
   - Shows complete character design with hoodie/jacket
   - Used in: About pages, detailed guides, educational content
   - Size: Medium to large, 300-500px rendered

## Design Specifications

### Color Palette
- **Primary Purple**: #9B8FD9 (soft lavender)
- **Secondary Blue**: #7BA7BC (calm blue)
- **Accent Green**: #8FA68E (gentle sage)
- **Gold Accent**: #D2A44C (warm gold for tech details)
- **Cyan Glow**: #00F0FF (interface elements)

### Character Features
- Big expressive eyes (kind and aware)
- Gentle confident smile
- Minimalistic hoodie/light jacket
- Tech details: badge with 葵 kanji, bracelet, subtle interface glows
- Clean, non-sexualized, academic aesthetic

### Animation Elements
- Pulsing glow effects
- Status indicator (green dot, animated)
- Subtle hover scale effects
- Soft gradient backgrounds

## Component Usage

### AoiCharacter Component

```tsx
import { AoiCharacter } from '@/components/AoiCharacter';

// Hero variant
<AoiCharacter variant="hero" size="lg" animate={true} />

// Avatar variant
<AoiCharacter variant="avatar" size="sm" />

// Full body variant
<AoiCharacter variant="full" size="xl" showLabel={true} />
```

### Props
- `variant`: 'hero' | 'avatar' | 'full'
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `className`: Additional CSS classes
- `showLabel`: Show "aOi (葵) - AI Guide & Mentor" label
- `animate`: Enable hover and glow animations
- `onClick`: Optional click handler

## Replacing with Real Artwork

When you have actual character artwork ready:

1. Replace the SVG files with PNG/WebP images
2. Maintain the same filenames:
   - `aoi-hero.png` or `aoi-hero.webp`
   - `aoi-avatar.png` or `aoi-avatar.webp`
   - `aoi-full.png` or `aoi-full.webp`

3. Update `src/components/AoiCharacter.tsx` image paths if needed

4. Recommended image specs:
   - **Hero**: 1200x1200px, PNG/WebP, optimized
   - **Avatar**: 512x512px, PNG/WebP, optimized
   - **Full**: 1000x2000px, PNG/WebP, optimized

## Character Evolution

aOi's appearance adapts to user progression:

- **Level 1 (Beginner)**: Softer features, maximum empathy
- **Level 2 (Explorer)**: More confident, includes helpful visuals
- **Level 3 (Builder)**: Mature proportions, technical elements
- **Level 4 (Guardian)**: Professional, protective presence

Future versions may include multiple variants for each level.

## Accessibility

- All images include descriptive alt text
- SVG elements include proper ARIA labels
- Color contrast meets WCAG AA standards
- Animations respect `prefers-reduced-motion`

## Notes

- Current placeholders are vector SVG for perfect scaling
- File extensions include `.png.svg` to indicate they're placeholders for future PNG files
- All images follow the canonical aOi design: soft + tech + academic
- No sexualization, no glamour, no lifestyle aesthetics
