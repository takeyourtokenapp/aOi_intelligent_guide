# aOi Avatar Assets

This folder contains the official aOi character images for different variants.

## Variant Structure

| Variant | Filename | Description | Usage |
|---------|----------|-------------|-------|
| hero | `aoi-hero.png` | Full character for hero sections | Homepage hero, landing pages |
| pointing | `aoi-pointing.png` | aOi pointing to content | Navigation hints, tutorials |
| presenting | `aoi-presenting.png` | aOi presenting information | Feature showcases, announcements |
| portrait | `aoi-portrait.png` | Close-up portrait | Chat avatar, profile displays |
| celebration | `aoi-celebration.png` | Happy/excited pose | Success states, achievements, 404 page |

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

## Fallback Behavior

The AoiAvatarVariant component will:
1. Try to load from `/assets/aoi/[filename]`
2. Fall back to `/aoi/[existing-image]`
3. Show kanji "葵" character if all images fail

## Current Fallback Mapping

- hero -> /aoi/aoi-hero.png
- pointing -> /aoi/explorer-thinking.png
- presenting -> /aoi/builder-excited.png
- portrait -> /aoi/image.png
- celebration -> /aoi/builder-excited.png
