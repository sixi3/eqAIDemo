# 📦 NPM Publication Guide

Final steps to publish design-tokens-sync to npm registry.

## 🎯 Pre-Publication Checklist

✅ **Package Development Complete**
- Core functionality implemented and tested
- CLI commands working properly  
- Templates and workflows created
- Documentation comprehensive
- Tests passing (16/16 integration tests)
- Local testing successful

✅ **Release Automation Ready**
- standard-version configured
- GitHub Actions workflow created
- Conventional commit format setup
- .npmignore optimized

## 🔐 NPM Authentication

1. **Create NPM Account** (if not already done):
   ```bash
   # Visit https://www.npmjs.com/signup
   # Create account with username: your-npm-username
   ```

2. **Login to NPM**:
   ```bash
   npm login
   # Enter your npm credentials
   ```

3. **Verify Authentication**:
   ```bash
   npm whoami
   # Should show your npm username
   ```

## 📝 Package Name Verification

1. **Check Availability**:
   ```bash
   npm view design-tokens-sync
   # If package doesn't exist, you can proceed
   # If it exists, you'll need to choose a different name
   ```

2. **Alternative Names** (if needed):
   - `@your-username/design-tokens-sync`
   - `design-tokens-synchronizer`
   - `figma-design-tokens-sync`
   - `tokens-sync-cli`

## 🚀 Publication Steps

### Option 1: Manual Publication (Recommended for first release)

1. **Final Testing**:
   ```bash
   npm run test:coverage  # Ensure all tests pass
   npm run lint:package   # Ensure code quality
   ```

2. **Pack and Inspect**:
   ```bash
   npm pack
   tar -tzf design-tokens-sync-1.0.0.tgz  # Inspect contents
   ```

3. **Publish to NPM**:
   ```bash
   npm publish --access public
   ```

### Option 2: Automated Publication via GitHub Actions

1. **Add NPM Token to GitHub**:
   - Go to npm.com → Profile → Access Tokens
   - Generate new token (Type: Automation)
   - Copy the token
   - Go to GitHub repo → Settings → Secrets → Actions
   - Add secret: `NPM_TOKEN` with your token

2. **Push to Main Branch**:
   ```bash
   git add .
   git commit -m "feat: initial package release"
   git push origin main
   ```

3. **Monitor GitHub Actions**:
   - Check Actions tab for workflow execution
   - Verify successful testing and publication

## 🔍 Post-Publication Verification

1. **Check NPM Registry**:
   ```bash
   npm view design-tokens-sync
   ```

2. **Test Installation**:
   ```bash
   mkdir test-install && cd test-install
   npm init -y
   npm install design-tokens-sync
   npx design-tokens-sync --help
   ```

3. **Verify GitHub Release**:
   - Check Releases tab on GitHub
   - Verify release notes and changelog

## 📊 Package Information

Current package details:
- **Name**: design-tokens-sync  
- **Version**: 1.0.0
- **Size**: 85.7 kB packed, 400.0 kB unpacked
- **Files**: 54 files included
- **Dependencies**: 12 production dependencies
- **Node**: >=16.0.0
- **License**: MIT

## 🏷️ Scoped Publication (Alternative)

If the name is taken, publish as scoped package:

1. **Update package.json**:
   ```json
   {
     "name": "@your-username/design-tokens-sync"
   }
   ```

2. **Publish with scope**:
   ```bash
   npm publish --access public
   ```

## 📈 Post-Launch Tasks

After successful publication:

1. **Update Documentation**:
   - Add npm install instructions to README
   - Update package URLs in documentation
   - Add npm badge to README

2. **Community Engagement**:
   - Share on Twitter/LinkedIn
   - Post in design system communities
   - Add to awesome lists
   - Create dev.to article

3. **Monitor Usage**:
   - Track npm download stats
   - Monitor GitHub issues
   - Respond to user feedback

## 🚨 Troubleshooting

### Publication Fails

```bash
# Name conflict
npm error 403 Forbidden - PUT https://registry.npmjs.org/design-tokens-sync
# Solution: Choose different name or use scoped package

# Authentication error  
npm error code ENEEDAUTH
# Solution: npm login

# Version exists
npm error 403 You cannot publish over the previously published versions
# Solution: Bump version with npm version patch/minor/major
```

### GitHub Actions Fails

1. **Check logs** in Actions tab
2. **Verify NPM_TOKEN** secret is set correctly
3. **Check branch protection** rules
4. **Ensure repository permissions** are correct

## 🎉 Success!

Once published successfully:

- ✅ Package available on npm: `npm install design-tokens-sync`
- ✅ CLI accessible globally: `npx design-tokens-sync`
- ✅ Automated releases configured
- ✅ Full documentation available
- ✅ Community ready!

---

**Ready to make design systems better for everyone!** 🎨✨ 