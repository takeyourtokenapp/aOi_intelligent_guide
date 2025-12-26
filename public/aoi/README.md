# aOi Visual Assets

This directory contains visual assets for aOi (葵), the AI navigation assistant.

## Asset Requirements

All images should follow the master prompt guidelines:

```
A modern Japanese anime girl named Aoi, cute but intelligent, warm and empathetic,
designed as an educational guide character. Age appearance: 16–18 (safe, non-sexualized).
Big expressive eyes full of kindness and awareness, soft confident smile. Modern anime
art style, high quality illustration, clean lines, soft lighting. Wearing a minimalistic
hoodie or light jacket in soft pastel colors (lavender, soft blue, white), subtle tech
or science details (small badge, bracelet, interface glow). Calm, trustworthy, smart
presence — not childish, not sexualized. Background: soft abstract gradient or light
futuristic medical/tech interface, very subtle. Mood: hopeful, caring, reassuring.
Style keywords: modern anime, kawaii but mature, educational character, empathy,
science-friendly, clean aesthetic, high detail, 4k quality.
```

## Directory Structure

```
/public/aoi/
  ├── README.md (this file)
  ├── beginner-neutral.png
  ├── explorer-thinking.png
  ├── builder-excited.png
  └── guardian-neutral.png
```

## Asset Specifications

### Technical Requirements
- Format: PNG with transparency
- Size: 512x512px minimum, 1024x1024px recommended
- Color space: sRGB
- Compression: Optimized for web

### Visual Levels

#### 1. Beginner (🌱)
- **Appearance**: Maximum empathy, very soft features
- **Colors**: Soft lavender, pastel pink
- **Tech details**: Minimal
- **Expression**: Gentle, welcoming
- **Background**: Soft pastel gradient

#### 2. Explorer (🔍)
- **Appearance**: Clearer gaze, growing confidence
- **Colors**: Light blue, lavender
- **Tech details**: Small badge or bracelet
- **Expression**: Curious, intelligent
- **Background**: Faint diagrams/schemas

#### 3. Builder (🔨)
- **Appearance**: More mature, confident
- **Colors**: White, tech blue
- **Tech details**: Interface glow, multiple elements
- **Expression**: Professional, focused
- **Background**: Holographic elements

#### 4. Guardian (🛡️)
- **Appearance**: Maximum composure, authority
- **Colors**: Full spectrum with gold accents
- **Tech details**: Command center interface
- **Expression**: Protective, wise
- **Background**: Advanced tech interface

## DO NOT Include
- ❌ Sexualized features or poses
- ❌ Glamour photography style
- ❌ Lifestyle imagery
- ❌ Overly childish elements
- ❌ Dark or ominous themes

## DO Include
- ✅ Educational, professional aesthetic
- ✅ Empathy and intelligence
- ✅ Soft tech integration
- ✅ Clean, modern anime style
- ✅ Trustworthy presence
- ✅ Medical/science context (subtle)

## Color Palette

```css
Primary Colors:
- Lavender: #9b87f5
- Cyan: #00F0FF
- Gold: #D2A44C

Supporting Colors:
- Soft Blue: #7dd3fc
- White: #ffffff
- Magenta (accent): #FF00FF

Background:
- Navy: #0A1122
- Dark Blue: #1a2744
```

## Usage in Code

```typescript
import { AoiAvatar } from '@/components/AoiAvatar';

// Basic usage
<AoiAvatar level="explorer" emotion="thinking" />

// With name and custom size
<AoiAvatar
  level="guardian"
  size="xl"
  showName={true}
/>
```

## Generating Images

Use AI image generators (Midjourney, DALL-E, Stable Diffusion) with the prompts from `/src/config/aoiAssets.ts`.

### Recommended Workflow
1. Copy the master prompt from `AOI_PROMPTS.master`
2. Add level-specific prompt from `AOI_PROMPTS[level]`
3. Generate multiple variations
4. Select the best one that matches guidelines
5. Optimize for web (compress, resize)
6. Name according to convention: `{level}-{emotion}.png`

## Foundation API Integration

These assets can be used across both domains:
- takeyourtoken.app (learning tools)
- tyt.foundation (medical knowledge)

The same aOi avatar maintains consistency across the entire ecosystem.

---

**Remember**: aOi is an educational AI guide connecting technology and medicine. Every visual should reflect empathy, intelligence, and trust.
