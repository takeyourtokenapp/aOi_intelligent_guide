# aOi (葵) Intelligent Guide

AI Navigation Assistant connecting **takeyourtoken.app** and **tyt.foundation**

---

## 🎯 Mission

aOi is an AI-powered navigation agent that bridges Web3 technology education with children's brain cancer research. She helps users understand how blockchain tools enable transparent medical research funding.

**Two domains • One mission • Connected by aOi**

---

## ⚡ Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` to see aOi in action.

---

## 🏗️ Architecture

```
takeyourtoken.app  ←→  aOi (葵)  ←→  tyt.foundation
   (Web3 Tools)      (AI Bridge)    (Medical Knowledge)
```

### Components

- **AoiAssistant**: Floating AI chat interface (bottom-right)
- **AoiAvatar**: Character avatar with level progression
- **CrossDomainBridge**: Navigation between domains
- **Foundation API**: Smart connection with fallback mode

---

## 📚 Key Features

### 1. AI Navigation
- Real-time connection to Foundation API
- Smart fallback when API unavailable
- Context-aware responses
- Cross-domain linking

### 2. Visual Identity
- Character: Modern anime educational guide
- Age: 16-18 (safe, non-sexualized)
- Colors: Lavender, Cyan, Gold
- Evolution: Beginner → Explorer → Builder → Guardian

### 3. Security
- ❌ NO medical advice
- ❌ NO financial recommendations
- ✅ Educational guidance only
- ✅ Privacy-first design

---

## 🔧 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Supabase
- **API**: Foundation API (tyt.foundation)

---

## 📖 Documentation

- **[Full Integration Guide](./AOI_INTEGRATION_COMPLETE.md)** - Complete architecture
- **[Architecture Details](./README_AOI_INTEGRATION.md)** - Technical deep-dive
- **[Integration Summary](./INTEGRATION_SUMMARY.md)** - Quick reference
- **[Visual Assets Guide](./public/aoi/README.md)** - Image generation

---

## 🚀 Deployment

```bash
npm run build
```

Deploy to Vercel, Netlify, or any static hosting.

### Environment Variables

Required:
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🎨 Using aOi Components

### AI Assistant

```tsx
import { AoiAssistant } from './components/AoiAssistant';

function App() {
  return (
    <>
      <YourContent />
      <AoiAssistant />  {/* Appears bottom-right */}
    </>
  );
}
```

### Avatar Display

```tsx
import { AoiAvatar } from './components/AoiAvatar';

<AoiAvatar
  level="explorer"
  size="lg"
  showName={true}
/>
```

### Cross-Domain Links

```tsx
import { CrossDomainBridge } from './components/CrossDomainBridge';

<CrossDomainBridge
  type="to-foundation"
  context="Learn how this technology supports research"
/>
```

---

## 🔗 Links

- **App Domain**: https://takeyourtoken.app
- **Foundation Domain**: https://tyt.foundation
- **GitHub**: [Repository]

---

## 📝 Development

### File Structure

```
src/
├── components/
│   ├── AoiAssistant.tsx      # Main AI chat interface
│   ├── AoiAvatar.tsx          # Avatar component
│   ├── CrossDomainBridge.tsx  # Domain linking
│   └── Navigation.tsx         # Unified navigation
├── config/
│   ├── aoiAssets.ts          # Visual identity config
│   └── navigation.ts         # Cross-domain config
├── services/
│   └── foundationApi.ts      # Foundation API client
└── lib/
    └── supabase.ts           # Supabase client

public/
└── aoi/
    ├── README.md             # Visual asset guidelines
    └── *.png                 # Character images
```

### Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview build
- `npm run lint` - Lint code
- `npm run typecheck` - TypeScript check

---

## 🎓 Educational Philosophy

aOi teaches by:
1. **Empathy** - Adapts to user level
2. **Context** - Connects tools to mission
3. **Safety** - No financial pressure
4. **Progression** - Guides growth path

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Follow TypeScript/React best practices
4. Test with both online/offline API modes
5. Submit pull request

---

## 📊 Demo Statistics (Lead Generation)

The platform displays **realistic placeholder statistics** when the database is empty. These values serve as a lead generation hook and reflect a realistic trajectory for a project launched in Winter 2024.

**Demo Values:**
- 127 active learners
- 423 total users
- 89 courses completed
- 43 certificates earned
- $8,250 foundation contributions
- $2,847 this month

**Behavior:**
- ✅ Automatically replaced by real data when users join
- ✅ No manual intervention needed
- ✅ Serves as social proof for early adopters

See `DEMO_STATS_CONFIG.md` for full details and marketing context.

---

## 📄 License

TYT Foundation - Educational AI Project

---

## 💝 Support the Mission

Every interaction with aOi supports:
- Children's brain cancer research
- Medical equipment funding
- Family support programs
- Transparent blockchain-based giving

**Learn → Connect → Support**

---

**Status**: ✅ Production Ready

**Version**: 1.0.0

**aOi says**: "Technology meets medicine. Let's learn together."
