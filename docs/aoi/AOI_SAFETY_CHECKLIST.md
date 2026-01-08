# aOi Safety Checklist

## Pre-Deployment Checklist

### Medical Content Safety
- [ ] All medical content reviewed by medical advisor
- [ ] Medical disclaimers present in every medical response
- [ ] No diagnosis, treatment, or prognosis advice
- [ ] No PHI (Personal Health Information) accessed or stored
- [ ] Age-appropriate language for all levels
- [ ] Sources cited for all medical claims
- [ ] Last reviewed dates current (<90 days)

### Financial Content Safety
- [ ] No investment recommendations
- [ ] No price predictions or guarantees
- [ ] Financial disclaimers present
- [ ] Risk factors clearly stated
- [ ] Educational focus maintained
- [ ] No "get rich quick" language

### Child Safety (COPPA/GDPR)
- [ ] Guardian consent system functional
- [ ] Age verification in place
- [ ] Financial features blocked for minors
- [ ] No personal data collection beyond minimum
- [ ] Parental controls accessible
- [ ] Educational content age-appropriate

### Data Privacy
- [ ] RLS policies enabled on all tables
- [ ] No PHI in database
- [ ] Anonymization after 90 days
- [ ] GDPR rights implemented (access, delete, export)
- [ ] Encryption at rest and in transit
- [ ] Audit logging enabled

### API Security
- [ ] Rate limiting configured
- [ ] CORS headers properly set
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive info
- [ ] Authentication where required
- [ ] Timeout limits set

### Content Moderation
- [ ] Response filtering active
- [ ] Prohibited content blocked
- [ ] Hate speech detection enabled
- [ ] Violent content filtered
- [ ] Adult content blocked

### Cross-Domain Integration
- [ ] Foundation API responding
- [ ] Fallback mode tested
- [ ] Cross-domain links validated
- [ ] SSO or session sharing working
- [ ] Domain verification configured

### Visual Identity
- [ ] All assets non-sexualized
- [ ] Age-appropriate imagery (16-18)
- [ ] No glamour or lifestyle style
- [ ] Soft + tech + academic maintained
- [ ] Color system followed
- [ ] No forbidden elements present

### Accessibility
- [ ] WCAG 2.1 Level AA compliance
- [ ] Screen reader compatible
- [ ] Keyboard navigation functional
- [ ] Color contrast sufficient
- [ ] Text alternatives for images
- [ ] Responsive design working

### Documentation
- [ ] API contract accurate
- [ ] Knowledge schema documented
- [ ] Legal constraints clear
- [ ] Test scenarios passing
- [ ] Deployment guide current

---

## Pre-Content-Publication Checklist

Before publishing any knowledge base content:

### Medical Content
- [ ] Source is peer-reviewed or authoritative
- [ ] Citation included with link
- [ ] Last reviewed date set
- [ ] Disclaimer added
- [ ] Age-appropriate flag set correctly
- [ ] No graphic descriptions
- [ ] Language at 8th-grade level
- [ ] Keywords tagged

### Web3 Content
- [ ] Starts with "What" and "Why"
- [ ] Uses analogies
- [ ] No jargon without explanation
- [ ] Practical example included (if applicable)
- [ ] Difficulty level set
- [ ] Related courses linked
- [ ] Disclaimer included (no financial advice)

---

## Incident Response Checklist

If medical advice detected:
- [ ] Immediate content takedown
- [ ] Notify legal team
- [ ] Notify medical advisor
- [ ] Audit all medical responses
- [ ] Review filters
- [ ] Document incident
- [ ] Update training data

If financial advice detected:
- [ ] Immediate content takedown
- [ ] Notify legal/compliance
- [ ] Audit financial responses
- [ ] Review filters
- [ ] Document incident

If child data exposed:
- [ ] Immediate system lockdown
- [ ] Notify legal team
- [ ] Notify affected guardians
- [ ] Notify regulators (if required)
- [ ] Full security audit
- [ ] Incident report
- [ ] Remediation plan

---

## Monthly Review Checklist

- [ ] Review aoi_interactions logs for issues
- [ ] Check error rates
- [ ] Verify disclaimer presence in samples
- [ ] Test random medical queries
- [ ] Test random financial queries
- [ ] Verify child access restrictions
- [ ] Review rate limiting effectiveness
- [ ] Check fallback mode usage
- [ ] Update knowledge base (if needed)
- [ ] Review and update documentation

---

## Quarterly Review Checklist

- [ ] Medical content review by advisor
- [ ] Legal compliance review
- [ ] GDPR/COPPA compliance audit
- [ ] Security penetration testing
- [ ] Load testing
- [ ] Accessibility audit
- [ ] User feedback analysis
- [ ] Update training data
- [ ] Refresh test scenarios
- [ ] Documentation update

---

**Last Updated**: 2025-12-28
**Review Frequency**: Pre-deployment, Monthly, Quarterly
**Maintained By**: TYT Safety & Compliance Team
