# aOi Image Upload Instructions

## Current Status

The aOi image system is configured and ready, but **real PNG/JPG images need to be uploaded**.

Currently, all image files in this directory are placeholder files (13 bytes). The system will display the Japanese character "葵" as a fallback until real images are uploaded.

## Required Images

Upload the following images to `/public/assets/aoi/`:

### 1. Primary Full Body Image
- **Filename**: `aoi-fullbody-welcome.png`
- **Size**: ~300KB recommended
- **Format**: PNG with transparent background
- **Usage**: Hero carousel, main welcome sections
- **Requirements**:
  - Full body character without background
  - Transparent PNG
  - Welcoming/friendly pose
  - Clean, high-resolution

### 2. Portrait Close-Up
- **Filename**: `portrait-close.png`
- **Size**: 1-2MB acceptable
- **Format**: PNG
- **Usage**: Avatars, chat bubbles, navigation
- **Requirements**:
  - Face/upper body focus
  - Suitable for circular cropping
  - Warm, trustworthy expression

### 3. Hero Welcome
- **Filename**: `hero-welcome.png`
- **Size**: 1-1.5MB
- **Format**: PNG
- **Usage**: Alternative hero sections
- **Requirements**:
  - Standing pose
  - Full body visible
  - Suitable for large displays

### 4. Level-Based Images

#### Guiding Left
- **Filename**: `guiding-left.png`
- **Usage**: Explorer level (14-18), tutorials
- **Pose**: Pointing or guiding gesture toward the left

#### Pointing Right
- **Filename**: `pointing-right.png`
- **Usage**: Navigation hints, directional cues
- **Pose**: Pointing or gesturing toward the right

#### Presenting Open
- **Filename**: `presenting-open.png`
- **Usage**: Builder level (18-25), feature showcases
- **Pose**: Both hands open, presenting content

#### Standing Neutral
- **Filename**: `standing-neutral.png`
- **Usage**: Guardian level (25+), composed states
- **Pose**: Neutral standing, authoritative yet warm

### 5. Celebration
- **Filename**: `celebration.jpg`
- **Size**: ~800KB
- **Format**: JPG acceptable
- **Usage**: Success states, 404 page, achievements
- **Pose**: Happy, celebrating expression

## Design Requirements

All images MUST follow these guidelines:

### Visual Style
- **Aesthetic**: soft + tech + academic
- **Style**: Modern Japanese anime, clean lines
- **Colors**: Lavender, soft blue, white, gold accents
- **Details**: Subtle tech elements (badge, bracelet, glow)

### Character Traits
- **Age appearance**: 16-18 (educational context)
- **Expression**: Warm, empathetic, intelligent
- **Personality**: Trustworthy, composed, friendly
- **Role**: AI guide and educational assistant

### Technical Specs
- **Format**: PNG (transparent background) preferred
- **Resolution**: High-res for responsive scaling
- **Size**: 300KB - 1.5MB optimal
- **Compression**: Optimized for web

### Strict Prohibitions
❌ NO sexualization or glamour styling
❌ NO lifestyle/fashion photography aesthetic
❌ NO childish or immature appearance
❌ NO aggressive UI elements overlaid
❌ NO real-person resemblance

## Upload Process

### Method 1: Direct File Upload (Bolt.new)
1. Click the file tree icon in left sidebar
2. Navigate to `/public/assets/aoi/`
3. Right-click and select "Upload File"
4. Select your prepared images
5. Ensure filenames match exactly

### Method 2: Replace Placeholder Files
1. Each image currently exists as a 13-byte placeholder
2. Simply overwrite with your real image
3. Keep the exact same filename

### Method 3: Drag & Drop
1. Open `/public/assets/aoi/` in file explorer
2. Drag images directly into the Bolt editor

## After Upload

1. **Verify file sizes**:
   ```bash
   ls -lh public/assets/aoi/*.png public/assets/aoi/*.jpg
   ```
   Should show sizes like 300K, 1.1M, etc (not "13" or "20")

2. **Test in browser**:
   - Clear cache
   - Reload application
   - Check hero carousel
   - Check avatar displays
   - Test dark/light mode

3. **Check fallbacks**:
   - Temporarily rename an image
   - Verify fallback displays correctly
   - Restore original filename

## Fallback Chain

The system has 3-level fallback protection:

```
Primary Image
  ↓ (if fails)
Alternative Asset Image
  ↓ (if fails)
Japanese Character 葵 + Gradient
```

### Current Fallback Configuration

| Primary | Fallback |
|---------|----------|
| `hero-welcome.png` | `aoi-fullbody-welcome.png` |
| `aoi-fullbody-welcome.png` | `standing-neutral.png` |
| `portrait-close.png` | `hero-welcome.png` |
| `celebration.jpg` | `presenting-open.png` |
| `pointing-right.png` | `presenting-open.png` |
| `presenting-open.png` | `standing-neutral.png` |
| `guiding-left.png` | `aoi-fullbody-welcome.png` |
| `standing-neutral.png` | `aoi-fullbody-welcome.png` |

## Troubleshooting

### Images show as "葵" character
- Images are still placeholder files (13 bytes)
- Upload real PNG/JPG images
- Verify file sizes after upload

### Images don't load
- Check browser console for errors
- Verify filenames match exactly (case-sensitive)
- Check file permissions
- Clear browser cache

### Images display but look wrong
- Verify transparent background (PNG)
- Check image resolution
- Ensure design follows aOi guidelines
- Optimize file size if too large (>2MB)

### Mobile display issues
- Test responsive breakpoints
- Verify images scale correctly
- Check objectPosition settings in config

## Configuration Files

Image settings are managed in:
- `/src/config/aoiVariants.ts` - Variant definitions and paths
- `/src/config/aoiAssets.ts` - Level-based asset mapping
- `/src/components/AoiAvatarVariant.tsx` - Avatar component logic
- `/src/components/AoiCharacter.tsx` - Full character display
- `/src/components/HeroCarousel.tsx` - Hero section

## Support

If you encounter issues:
1. Check this documentation
2. Verify image meets all requirements
3. Test fallback chain
4. Check browser console for errors
5. Review component error handling

---

**Status**: Ready for image upload
**Last Updated**: 2026-01-12
**System**: TYT Foundation - aOi Character System
