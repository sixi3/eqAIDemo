# Design Tokens Workflow

## 🎯 Overview

This workflow ensures design tokens from Tokens Studio automatically sync to your codebase with proper validation and review.

## 👨‍🎨 For Designers

### Setup (One-time)
1. **Install Tokens Studio** in Figma
2. **Connect to GitHub:**
   - Go to Tokens Studio → Settings → Sync
   - Choose "GitHub" as sync provider
   - Connect to your repository
   - Set file path: `tokens.json`
   - Set branch: `design-tokens` or `main`

### Daily Workflow
1. **Update tokens** in Tokens Studio
2. **Save changes** (auto-pushes to GitHub)
3. **Monitor GitHub** for PR creation
4. **Review and approve** PR when ready

### Best Practices
- Use semantic naming: `color.primary.500`, `spacing.md`
- Document token purposes in descriptions
- Test changes in Figma before saving
- Coordinate with developers for major changes

## 👨‍💻 For Developers

### Setup (One-time)
```bash
# Clone repository
git clone <your-repo>
cd <your-repo>

# Install dependencies
npm install

# Install new token dependencies
npm install --save-dev chokidar concurrently
```

### Daily Workflow
```bash
# Pull latest changes
git pull origin main

# Start development with token watching
npm run dev:tokens

# Or start regular development
npm run dev

# Update tokens manually if needed
npm run tokens:update
```

### Available Commands
- `npm run tokens:update` - Update Tailwind config from tokens.json
- `npm run tokens:watch` - Watch tokens.json for changes
- `npm run tokens:validate` - Validate token structure
- `npm run dev:tokens` - Start dev server with token watching

### Integration in Components
```tsx
// Use design tokens in components
<button className="bg-primary-500 hover:bg-primary-600">
  Click me
</button>

// Or use CSS custom properties
<div style={{ backgroundColor: 'var(--color-primary-500)' }}>
  Custom styling
</div>
```

## 🔧 For DevOps

### Setup (One-time)
1. **Enable GitHub Actions** in repository
2. **Set up branch protection** (optional)
3. **Configure deployment** triggers
4. **Add Slack notifications** (optional)

### Monitoring
- Watch GitHub Actions for token sync jobs
- Monitor PR creation from token changes
- Validate deployment after token updates
- Set up alerts for failed token validations

## 🔄 Automation Flow

```
Designer updates Tokens Studio
         ↓
Auto-push to GitHub (design-tokens branch)
         ↓
GitHub Action triggers
         ↓
Validates tokens.json
         ↓
Updates Tailwind config & CSS
         ↓
Creates Pull Request
         ↓
Code review & approval
         ↓
Merge to main
         ↓
Deploy to production
```

## 🚨 Troubleshooting

### Common Issues

**1. Tokens not updating in development:**
```bash
# Stop dev server and restart with token watching
npm run dev:tokens
```

**2. GitHub Action failing:**
- Check tokens.json syntax
- Verify all required token categories exist
- Run `npm run tokens:validate` locally

**3. Merge conflicts in tokens.json:**
- Coordinate with team on token changes
- Use feature branches for major token updates
- Resolve conflicts in Tokens Studio, not directly in JSON

**4. Missing token classes in Tailwind:**
- Run `npm run tokens:update`
- Restart development server
- Check if token names match Tailwind conventions

### Emergency Procedures

**Rollback tokens:**
```bash
# Revert to previous tokens.json
git checkout HEAD~1 tokens.json
npm run tokens:update
```

**Manual token sync:**
```bash
# Force update from tokens.json
npm run tokens:update
git add .
git commit -m "🎨 Manual token sync"
```

## 📊 Metrics & Monitoring

### Track These Metrics
- Token update frequency
- Time from design to deployment
- Number of token-related issues
- Developer adoption of token classes

### Success Indicators
- ✅ Zero manual token updates
- ✅ Consistent design across components
- ✅ Fast design-to-code iterations
- ✅ Reduced design system maintenance

## 🔐 Security & Governance

### Access Control
- Limit Tokens Studio write access
- Require PR reviews for token changes
- Use branch protection rules
- Monitor for unauthorized changes

### Quality Gates
- Automated token validation
- Required code review
- Design system team approval
- Automated testing of token changes 