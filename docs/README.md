# TYT Foundation - Documentation

> **Last Updated**: 16 January 2026
> **Project**: tyt.foundation / takeyourtoken.app ecosystem
> **Status**: Active development

---

## Quick Navigation

### Core Documentation

- **[Root README](../README.md)** - Project overview and quick start
- **[PROJECT_STATUS_REPORT.md](../PROJECT_STATUS_REPORT.md)** - Comprehensive status report (85/100 complete)
- **[NEXT_STEPS.md](../NEXT_STEPS.md)** - Implementation roadmap (12 weeks to beta)
- **[FOUNDATION_ARCHITECTURE.md](FOUNDATION_ARCHITECTURE.md)** - Technical architecture details

---

## Architecture

### Foundation Architecture
- **[FOUNDATION_ARCHITECTURE.md](FOUNDATION_ARCHITECTURE.md)** - Complete technical architecture
  - Database schema (40 tables)
  - API endpoints and services
  - Cross-domain integration
  - Security model (RLS policies)
  - aOi integration architecture

---

## Research Documents

### Medical Research
- **tyt_foundation.pdf** - Foundation mission and research focus
- **aoi_digital_mentor_1.pdf** - aOi character design and educational approach
- **aoi_digital_mentor_2.pdf** - aOi implementation guidelines

---

## Key Concepts

### Two Domains, One Mission

**tyt.foundation** (Shows & Educates)
- Medical knowledge base
- Scientific articles and research
- Foundation transparency and reports
- Partnerships (I-QCC)
- Educational content

**takeyourtoken.app** (Implements & Executes)
- Web3 Academy
- User accounts and authentication
- Donation processing
- Progress tracking
- Real-time statistics

### aOi (葵) - The Bridge
- AI curator and navigator between domains
- Adaptive learning guide
- Trust verification system
- Knowledge interpreter (NOT medical advisor)
- Progress tracking and personalization

---

## Database Architecture

### Foundation Trust Layer (B0-B6)
✅ **100% Complete** (as of January 16, 2026)

**Public Views:**
- `foundation_public_ledger` - Complete transparency with 3-tier verification
- `foundation_orbital_events` - Orbital witness timestamping
- `foundation_aoi_confidence_view` - aOi verification scores

**Key Features:**
- Multi-level proof stack (SHA-256 + Merkle + Orbital + aOi)
- Cross-domain traceability
- Read-only foundation domain
- RLS security (100% coverage)

See [PROJECT_STATUS_REPORT.md](../PROJECT_STATUS_REPORT.md) for full details.

---

## Implementation Status

### Completed (85/100)
✅ Trust Layer (B0-B6) - 100%
✅ Database Schema - 40 tables with RLS
✅ Knowledge Base - 105 articles with embeddings
✅ Core Pages - 9 operational pages
✅ aOi RAG - Vector search functional
✅ Security - A+ grade (96/100)

### In Progress
🔄 Donation processing backend
🔄 Impact stories system
🔄 Content expansion (target: 200+ articles)

### Planned
📋 Volunteer portal
📋 Foundation blog
📋 Partner clinics showcase
📋 Privacy policy & GDPR compliance

See [NEXT_STEPS.md](../NEXT_STEPS.md) for detailed roadmap.

---

## Development Guidelines

### Security Rules

**NEVER commit to version control:**
- API keys or tokens
- Passwords or secrets
- Personal information
- Database credentials
- Environment variables with sensitive data

**Safe to document:**
- Architecture and design patterns
- Public API contracts
- Code structure and organization
- Configuration templates (with placeholders)

### Code Organization

```
project/
├── src/
│   ├── components/       # React components
│   ├── pages/           # Page components
│   ├── services/        # API and business logic
│   ├── contexts/        # React contexts
│   ├── config/          # Configuration
│   └── lib/             # Utilities
├── supabase/
│   ├── migrations/      # Database migrations
│   └── functions/       # Edge functions
├── docs/                # Documentation (this directory)
└── public/              # Static assets
```

---

## Testing & Quality

### Security Checks
- ✅ RLS policies on all tables
- ✅ No authentication bypass vulnerabilities
- ✅ Foreign key indexes for performance
- ✅ Input validation and sanitization
- ✅ Rate limiting on Edge Functions

### Performance
- ✅ Vector search optimization
- ✅ Database indexes on frequently queried columns
- ✅ Efficient SQL queries with proper joins
- ✅ Edge Function caching where appropriate

---

## Contributing

### Adding New Features

1. **Plan First**
   - Update [NEXT_STEPS.md](../NEXT_STEPS.md)
   - Document architecture changes
   - Consider security implications

2. **Implement**
   - Follow existing patterns
   - Add proper RLS policies
   - Write clear comments
   - Test thoroughly

3. **Document**
   - Update [PROJECT_STATUS_REPORT.md](../PROJECT_STATUS_REPORT.md)
   - Add technical notes to [FOUNDATION_ARCHITECTURE.md](FOUNDATION_ARCHITECTURE.md)
   - Update this README if needed

### Database Changes

1. Create migration file: `supabase/migrations/[timestamp]_descriptive_name.sql`
2. Always include detailed comments
3. Add RLS policies immediately
4. Test with different user roles
5. Document in [PROJECT_STATUS_REPORT.md](../PROJECT_STATUS_REPORT.md)

---

## Support & Contact

### For Developers
- Review [PROJECT_STATUS_REPORT.md](../PROJECT_STATUS_REPORT.md) for current state
- Check [NEXT_STEPS.md](../NEXT_STEPS.md) for upcoming tasks
- See [FOUNDATION_ARCHITECTURE.md](FOUNDATION_ARCHITECTURE.md) for technical details

### For Contributors
- Understand the mission in [Root README](../README.md)
- Follow security guidelines above
- Maintain code quality standards

---

## Version History

- **16 January 2026** - Documentation cleanup, trust layer complete
- **12 January 2026** - Knowledge base expansion, embedding generation
- **8 January 2026** - Foundation trust layer implementation begins

---

**Maintained By**: TYT Foundation Development Team
**License**: Proprietary
**Status**: Active Development (Beta Launch: Q1 2026)
