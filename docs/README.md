# Documentation Index

Complete documentation for TakeYourToken.app platform.

---

## Quick Navigation

- **[Root README](../README.md)** - Project overview and quick start
- **[Architecture](#architecture)** - System design and integration
- **[Setup Guides](#setup-guides)** - Deployment and configuration
- **[Development](#development)** - Development notes and templates
- **[Security](#security)** - Security updates and policies
- **[aOi Guide](#aoi-ai-guide)** - AI assistant documentation

---

## Architecture

Core system architecture and design documents:

### Foundation Architecture
- **[TYT Foundation Architecture](../TYT_FOUNDATION_ARCHITECTURE.md)** - Complete platform architecture
- **[Cross-Domain Architecture](architecture/AOI_CROSS_DOMAIN_ARCHITECTURE.md)** - Integration between domains
- **[Communication System](architecture/COMMUNICATION_SYSTEM_OVERVIEW.md)** - Contact and notification system

### Research & Mission
- **[Research Manifesto](../TYT_RESEARCH_MANIFESTO_I-QCC.md)** - I-QCC research framework and mission

---

## Setup Guides

Deployment, configuration, and initial setup:

### Deployment
- **[Deployment Guide](setup/DEPLOYMENT_GUIDE.md)** - Production deployment instructions
- **[Deployment Checklist](setup/DEPLOYMENT_CHECKLIST.md)** - Pre-launch checklist
- **[Deployment Ready](setup/DEPLOYMENT_READY.md)** - Final deployment status

### Configuration
- **[Multilingual Theme Guide](setup/MULTILINGUAL_THEME_GUIDE.md)** - Language and theme setup
- **[Demo Stats Config](setup/DEMO_STATS_CONFIG.md)** - Lead generation statistics
- **[Admin Dashboard Guide](setup/ADMIN_DASHBOARD_GUIDE.md)** - Admin panel setup

### Private Setup (Gitignored)
- **[Add First Admin](private/ADD_FIRST_ADMIN.md)** - Initial admin setup
- **[Email Setup Guide](private/EMAIL_SETUP_GUIDE.md)** - Email service configuration
- **[Email System Complete](private/EMAIL_SYSTEM_SETUP_COMPLETE.md)** - Email verification
- **[Telegram Bot Setup](private/TELEGRAM_BOT_SETUP.md)** - Telegram notifications

---

## Development

Development notes, implementation details, and templates:

### Implementation Notes
- **[Project Analysis](development/PROJECT_ANALYSIS.md)** - Initial project analysis
- **[Implementation Complete](development/IMPLEMENTATION_COMPLETE.md)** - Feature completion log
- **[Integration Summary](development/INTEGRATION_SUMMARY.md)** - Integration milestones
- **[Contact Form Fixes](development/CONTACT_FORM_FIXES_SUMMARY.md)** - Form improvements

### Templates
- **[Medical Content](development/templates/TEMPLATE_MEDICAL_CONTENT.md)** - Medical information templates
- **[Web3 Content](development/templates/TEMPLATE_WEB3_CONTENT.md)** - Web3 education templates
- **[Response Formats](development/templates/TEMPLATE_RESPONSE_FORMATS.md)** - API response templates

---

## Security

Security updates, RLS policies, and vulnerability fixes:

### Security Updates
- **[Security Advisory Fixes](security/SECURITY_ADVISORY_FIXES.md)** - Vulnerability patches
- **[Security Performance Fixes](security/SECURITY_PERFORMANCE_FIXES.md)** - Performance & security
- **[Remaining Issues Resolved](security/REMAINING_SECURITY_ISSUES_RESOLVED.md)** - Final security audit

### Database Security
- **[Contact Form RLS Fix](security/CONTACT_FORM_RLS_FIX.md)** - RLS policy corrections
- **[Null Safety Fixes](security/NULL_SAFETY_FIXES.md)** - Null pointer protection
- **[Foreign Key Indexes](security/FOREIGN_KEY_INDEXES_ADDED.md)** - Database optimization

---

## aOi AI Guide

Documentation for the aOi (葵) AI assistant:

### Core Documentation
- **[aOi Integration Complete](aoi/AOI_INTEGRATION_COMPLETE.md)** - Complete integration guide
- **[aOi Integration Summary](aoi/README_AOI_INTEGRATION.md)** - Technical deep-dive
- **[Prompt for aOi Guide Repo](aoi/PROMPT_FOR_AOI_GUIDE_REPO.md)** - Guide repository setup

### Character Design
- **[Visual Identity](aoi/AOI_VISUAL_IDENTITY.md)** - Character design guidelines
- **[Character Design Update](aoi/AOI_CHARACTER_DESIGN_UPDATE.md)** - Design iterations
- **[Character Integration](aoi/AOI_CHARACTER_INTEGRATION.md)** - Implementation details
- **[Hero Redesign](aoi/AOI_HERO_REDESIGN.md)** - Hero section updates
- **[Organic Redesign](aoi/AOI_ORGANIC_REDESIGN.md)** - Natural design evolution

### Visual Assets
- **[Image Integration](aoi/AOI_IMAGE_INTEGRATION.md)** - Image implementation
- **[Images Deployed](aoi/AOI_IMAGES_DEPLOYED.md)** - Asset deployment status
- **[Avatar Cropping](aoi/AOI_AVATAR_CROPPING.md)** - Avatar optimization
- **[Size Optimization](aoi/AOI_SIZE_OPTIMIZATION.md)** - File size reduction

### Integration & Status
- **[Header Integration](aoi/AOI_HEADER_INTEGRATION.md)** - Navigation integration
- **[Integration Status](aoi/AOI_INTEGRATION_STATUS.md)** - Current status
- **[Deployment Ready](aoi/AOI_DEPLOYMENT_READY.md)** - Production readiness
- **[Redesign Summary](aoi/AOI_REDESIGN_SUMMARY.md)** - Design changes summary

### Technical Implementation
- **[API Contract](aoi/AOI_API_CONTRACT.md)** - API specifications
- **[Knowledge Schema](aoi/AOI_KNOWLEDGE_SCHEMA.md)** - Knowledge base structure
- **[Self-Learning Implementation](aoi/AOI_SELF_LEARNING_IMPLEMENTATION.md)** - ML integration
- **[Test Scenarios](aoi/AOI_TEST_SCENARIOS.md)** - Testing documentation

### Guidelines & Safety
- **[Legal Constraints](aoi/AOI_LEGAL_CONSTRAINTS.md)** - Legal compliance
- **[Safety Checklist](aoi/AOI_SAFETY_CHECKLIST.md)** - Safety guidelines

---

## Visual Assets

Character images and visual identity:

- **[aOi Character Images](../public/aoi/)** - Avatar and character assets
- **[aOi Image README](../public/aoi/README.md)** - Asset usage guidelines

---

## File Organization

### Root Documentation
```
project/
├── README.md                           # Main README (public-safe)
├── TYT_FOUNDATION_ARCHITECTURE.md     # Core architecture
└── TYT_RESEARCH_MANIFESTO_I-QCC.md    # Research mission
```

### Organized Documentation
```
docs/
├── README.md                    # This file
├── architecture/                # System design
├── setup/                       # Deployment guides
├── development/                 # Dev notes & templates
├── security/                    # Security docs
├── aoi/                         # aOi documentation
└── private/                     # Sensitive docs (gitignored)
```

---

## Documentation Standards

### Security Rules

**NEVER commit to GitHub:**
- API keys or tokens
- Passwords or secrets
- Personal email addresses
- Supabase project URLs/IDs
- Database credentials
- Private setup instructions

**Safe to commit:**
- Architecture documentation
- Public API contracts
- Development guides (without secrets)
- Code examples (with placeholders)
- Design guidelines

### Document Naming

- `COMPONENT_NAME.md` - Component documentation
- `FEATURE_SUMMARY.md` - Feature completion
- `*_GUIDE.md` - Step-by-step guides
- `*_FIX.md` - Bug fix documentation
- `TEMPLATE_*.md` - Content templates

---

## Contributing to Docs

### Adding New Documentation

1. Choose appropriate directory:
   - Architecture → `docs/architecture/`
   - Setup → `docs/setup/`
   - Development → `docs/development/`
   - Security → `docs/security/`
   - aOi → `docs/aoi/`
   - Sensitive → `docs/private/`

2. Follow naming conventions
3. Update this index
4. Check for sensitive information
5. Ensure `.gitignore` covers sensitive files

### Updating Existing Docs

1. Keep version history in comments
2. Update modification date
3. Link related documents
4. Test all code examples

---

## Quick Reference

### For New Developers
1. Start with [Root README](../README.md)
2. Review [Architecture](../TYT_FOUNDATION_ARCHITECTURE.md)
3. Follow [Deployment Guide](setup/DEPLOYMENT_GUIDE.md)
4. Read [Security Docs](security/)

### For Content Writers
1. Use [Templates](development/templates/)
2. Follow [aOi Guidelines](aoi/AOI_VISUAL_IDENTITY.md)
3. Check [Legal Constraints](aoi/AOI_LEGAL_CONSTRAINTS.md)

### For Administrators
1. See [Private Setup](private/)
2. Review [Admin Guide](setup/ADMIN_DASHBOARD_GUIDE.md)
3. Configure [Email System](private/EMAIL_SETUP_GUIDE.md)

---

## Maintenance

### Regular Updates Needed
- Deployment guides (when infrastructure changes)
- API contracts (when endpoints change)
- Security docs (after vulnerability fixes)
- Integration status (after major features)

### Deprecated Documents
Obsolete documents moved to `docs/archive/` or deleted if no historical value.

---

## Support

For questions about documentation:
- Check this index first
- Review related documents
- See main [README](../README.md) for contact info

---

**Last Updated**: January 8, 2026
**Maintained By**: TYT Foundation Development Team
**Status**: ✅ Complete and organized
