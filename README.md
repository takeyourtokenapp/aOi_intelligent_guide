# TakeYourToken.app - Web3 Learning Platform with AI Guide

[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)
[![Built with Vite](https://img.shields.io/badge/Built%20with-Vite-646CFF.svg)](https://vitejs.dev)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6.svg)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E.svg)](https://supabase.com)

> Web3 educational platform with AI guide (aOi) connecting technology education and children's brain cancer research.

**Two domains • One mission • Connected by aOi**

---

## Overview

TakeYourToken.app combines blockchain education with charitable impact through:

- **Web3 Academy**: Progressive learning path from beginner to expert
- **AI Guide (aOi 葵)**: Adaptive assistant that grows with users
- **Foundation Integration**: Supporting TYT Children's Brain Cancer Research
- **Cross-Domain Architecture**: Seamless connection between education and impact

### Key Features

- Multilingual support (English, Russian, Hebrew)
- Progressive user levels (Beginner → Explorer → Builder → Guardian)
- Intelligent contact system with email routing
- Real-time statistics and gamification
- Secure authentication and RLS protection
- Dark mode and responsive design

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Visit `http://localhost:5173` to see the platform.

---

## Technology Stack

### Frontend
- React 18 + TypeScript
- Vite (fast development)
- Tailwind CSS
- Lucide React icons

### Backend
- Supabase (PostgreSQL + Auth + Edge Functions)
- Row Level Security (RLS)
- Edge Functions (Deno)

### Infrastructure
- Netlify/Vercel deployment
- GitHub Actions CI/CD
- Resend email service

---

## Project Structure

```
takeyourtoken.app/
├── src/
│   ├── components/          # React components
│   │   ├── AoiAssistant.tsx    # AI chat interface
│   │   ├── AoiAvatar.tsx       # Character avatar
│   │   ├── ContactForm.tsx     # Contact with routing
│   │   └── ...
│   ├── pages/              # Page components
│   ├── contexts/           # Language, Theme, Progress
│   ├── services/           # API services
│   └── config/             # Configuration
├── supabase/
│   ├── functions/          # Edge Functions
│   └── migrations/         # Database migrations
├── docs/                   # Documentation (organized)
│   ├── architecture/       # System design
│   ├── setup/              # Deployment guides
│   ├── development/        # Dev notes
│   ├── security/           # Security updates
│   ├── aoi/                # aOi documentation
│   └── private/            # Sensitive docs (gitignored)
└── public/
    ├── aoi/                # Character assets
    └── logo.png
```

---

## Documentation

Comprehensive documentation in [`docs/`](docs/):

### Core Documents
- **[TYT Foundation Architecture](TYT_FOUNDATION_ARCHITECTURE.md)** - Platform architecture
- **[Research Manifesto](TYT_RESEARCH_MANIFESTO_I-QCC.md)** - Mission and vision
- **[Documentation Index](docs/README.md)** - Complete docs map

### By Category
- **[Architecture](docs/architecture/)** - System design and integration
- **[Setup Guides](docs/setup/)** - Deployment and configuration
- **[Development](docs/development/)** - Development notes
- **[Security](docs/security/)** - Security policies and fixes
- **[aOi Guide](docs/aoi/)** - AI assistant documentation

---

## Core Concepts

### aOi (葵) - AI Guide

aOi is an adaptive AI assistant:
- Visual Identity: Modern anime educational guide (16-18, safe)
- Personality: Soft + Tech + Academic
- Evolution: Grows with user from beginner to guardian
- Purpose: Educational guidance, NOT medical/financial advice

### Progressive Learning Path

1. **Beginner** (10-14): Basics with guardian approval
2. **Explorer** (14-18): Active learning
3. **Builder** (18-25): Real contributions
4. **Guardian** (25+): Leadership and stewardship

### Contact System

Intelligent email routing based on inquiry type:
- General inquiries → `contact@tyt.foundation`
- Technical support → `support@tyt.foundation`
- Partnerships → `partnerships@tyt.foundation`

**Privacy**: Email addresses hidden from public, visible to registered users only.

---

## Environment Setup

### Required Variables

Create `.env` file (never commit!):

```bash
# Supabase (REQUIRED)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Email (Optional - for notifications)
RESEND_API_KEY=your_resend_key

# Telegram (Optional - for alerts)
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_ADMIN_CHAT_ID=your_chat_id
```

**CRITICAL**: Never commit `.env`, API keys, or passwords to repository!

---

## Security

Security is paramount:

### Database Security
- **RLS Policies**: All tables protected
- **Input Validation**: Client and server-side
- **Email Privacy**: Hidden from public view
- **Anonymous submissions**: Validated but safe

### Sensitive Files (gitignored)
- `ADD_FIRST_ADMIN.md` - Contains admin email
- `EMAIL_SETUP_GUIDE.md` - Contains Supabase URLs
- `TELEGRAM_BOT_SETUP.md` - Contains tokens
- `docs/private/` - All sensitive documentation

See [`docs/security/`](docs/security/) for details.

---

## Development

### Scripts

```bash
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview build
npm run lint       # Lint code
npm run typecheck  # TypeScript check
```

### Using aOi Components

```tsx
import { AoiAssistant } from './components/AoiAssistant';
import { AoiAvatar } from './components/AoiAvatar';
import { CrossDomainBridge } from './components/CrossDomainBridge';

function App() {
  return (
    <>
      <AoiAvatar level="explorer" size="lg" />
      <AoiAssistant />
      <CrossDomainBridge type="to-foundation" />
    </>
  );
}
```

---

## Deployment

### Build

```bash
npm run build
```

Outputs to `dist/` directory.

### Deploy to Netlify/Vercel

1. Connect GitHub repository
2. Set environment variables in dashboard
3. Deploy from `main` branch
4. Add custom domain (optional)

See [`docs/setup/DEPLOYMENT_GUIDE.md`](docs/setup/DEPLOYMENT_GUIDE.md) for details.

---

## Demo Statistics

Platform shows realistic placeholder statistics when database is empty:
- 127 active learners
- 423 total users
- 89 courses completed
- $8,250 foundation contributions

**Behavior**: Automatically replaced by real data as users join.

See [`docs/setup/DEMO_STATS_CONFIG.md`](docs/setup/DEMO_STATS_CONFIG.md) for context.

---

## Contributing

### Guidelines

1. **Private Repository**: Unauthorized access prohibited
2. **No Sensitive Data**: Never commit keys, passwords, emails
3. **Code Quality**: Follow TypeScript/React best practices
4. **Documentation**: Update docs with features
5. **Testing**: Test before committing

### Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and test
npm run dev
npm run build

# Commit with clear messages
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/your-feature
```

---

## Links

- **Platform**: https://takeyourtoken.app
- **Foundation**: https://tyt.foundation
- **Documentation**: [`docs/`](docs/)

---

## License

**Proprietary Software** - All Rights Reserved

Unauthorized copying, modification, distribution, or use is strictly prohibited.

---

## Support

For questions or support:
- Use contact form on website (registered users only)
- See documentation in `docs/` directory

---

## Acknowledgments

Built with:
- [React](https://reactjs.org) - UI framework
- [Vite](https://vitejs.dev) - Build tool
- [Supabase](https://supabase.com) - Backend platform
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Lucide](https://lucide.dev) - Icons

Supporting children's brain cancer research through technology education.

---

**Status**: ✅ Production Ready
**Version**: 1.0.0
**aOi says**: "Technology meets medicine. Let's learn together."

---

**© 2026 TYT Foundation. All rights reserved.**
