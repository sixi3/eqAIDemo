# Release Process

This document outlines the release process for design-tokens-sync.

## 🚀 Automated Releases

The package uses automated releases via GitHub Actions and standard-version.

### Prerequisites

1. **NPM Token**: Add `NPM_TOKEN` secret to GitHub repository
   - Go to npm.com → Access Tokens → Generate New Token (Automation)
   - Add to GitHub: Settings → Secrets → Actions → New repository secret

2. **Git Permissions**: Ensure GitHub Actions can push to main branch
   - Settings → Actions → General → Workflow permissions → Read and write

3. **Branch Protection** (Optional but recommended):
   - Require pull request reviews
   - Require status checks to pass

## 📦 Release Types

### Automatic Releases (Recommended)

Releases are triggered automatically when:
- Code is pushed to `main` branch
- Commits follow conventional commit format
- Changes include `feat:`, `fix:`, `perf:`, or `refactor:` commits

```bash
# Examples of commits that trigger releases
feat: add new token format support
fix: resolve validation edge case
perf: optimize token parsing
```

### Manual Releases

Trigger releases manually via GitHub Actions:

1. Go to Actions → Release & Publish → Run workflow
2. Select release type: patch, minor, or major
3. Click "Run workflow"

### Local Development Releases

For testing and development:

```bash
# Dry run (see what would be released)
npm run release:dry

# Create patch release
npm run release:patch

# Create minor release  
npm run release:minor

# Create major release
npm run release:major
```

## 📋 Release Workflow

1. **Testing**: All tests must pass
2. **Linting**: Code must pass lint checks
3. **Version Bump**: Automatically determined from commit messages
4. **Changelog**: Auto-generated from conventional commits
5. **Git Tag**: Created and pushed to repository
6. **NPM Publish**: Package published to npm registry
7. **GitHub Release**: Release notes created
8. **Notifications**: Optional Slack notifications

## 🔄 Conventional Commits

Use conventional commit format for automatic changelog generation:

```bash
# Feature (minor version bump)
feat: add support for Vue templates

# Bug fix (patch version bump)  
fix: resolve token validation issue

# Breaking change (major version bump)
feat!: change API structure
# or
feat: new API
BREAKING CHANGE: API structure has changed

# Other types (patch version bump)
perf: improve token parsing speed
refactor: restructure validation logic
docs: update API documentation
test: add integration tests
ci: update GitHub Actions
```

## 📊 Versioning Strategy

Following [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features (backward compatible)
- **PATCH** (1.0.0 → 1.0.1): Bug fixes (backward compatible)

## 🔍 Pre-release Checklist

Before releasing:

- [ ] All tests pass (`npm test`)
- [ ] Code is linted (`npm run lint:package`)
- [ ] Documentation is updated
- [ ] CHANGELOG.md is reviewed
- [ ] Breaking changes are documented
- [ ] Version number is appropriate

## 📚 Release Notes

Release notes are automatically generated from:
- Conventional commit messages
- Merged pull requests
- Closed issues

### Manual Release Notes

To add custom release notes:

1. Edit CHANGELOG.md before release
2. Use conventional commit format in your commit messages
3. Add detailed descriptions in commit body

Example:
```bash
feat: add analytics dashboard

Added comprehensive analytics dashboard with:
- Token usage visualization
- Trend analysis
- Component adoption metrics

Closes #123
```

## 🔒 Security Releases

For security fixes:

1. **Immediate**: Create patch release with security fix
2. **Coordinate**: Notify users via GitHub Security Advisory
3. **Document**: Add security section to release notes

```bash
# Security fix commit
fix: resolve XSS vulnerability in token parser

SECURITY: Fixes potential XSS in token name parsing
```

## 🚨 Hotfix Process

For critical bugs in production:

1. **Branch**: Create hotfix branch from latest tag
2. **Fix**: Apply minimal fix
3. **Test**: Run full test suite  
4. **Release**: Create patch release
5. **Merge**: Merge back to main

```bash
# Create hotfix branch
git checkout -b hotfix/critical-bug v1.2.3

# Apply fix and test
# ...

# Release hotfix
npm run release:patch

# Merge back
git checkout main
git merge hotfix/critical-bug
```

## 📊 Release Metrics

Track release metrics:
- Release frequency
- Time between releases
- Issue resolution time
- User adoption of new versions

## 🔧 Troubleshooting

### Release Fails

1. **Check logs** in GitHub Actions
2. **Verify permissions** for GitHub and npm
3. **Check branch protection** rules
4. **Validate package.json** syntax

### NPM Publish Fails

1. **Check npm token** is valid
2. **Verify package name** availability
3. **Check version** doesn't already exist
4. **Review .npmignore** file

### Git Push Fails

1. **Check branch protection** rules
2. **Verify GitHub token** permissions
3. **Check for merge conflicts**

## 📞 Support

For release issues:
- Check GitHub Actions logs
- Review npm publish logs
- Contact maintainers via GitHub issues

---

**Note**: This release process follows industry best practices for open-source npm packages. 