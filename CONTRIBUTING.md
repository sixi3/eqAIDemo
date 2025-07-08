# Contributing to design-tokens-sync

Thank you for your interest in contributing to design-tokens-sync! This guide will help you get started.

## 🚀 Quick Start

1. **Fork the repository** on GitHub
2. **Clone your fork:**
   ```bash
   git clone https://github.com/your-username/design-tokens-sync.git
   cd design-tokens-sync
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Run tests:**
   ```bash
   npm test
   ```

## 🏗️ Development Workflow

### Setting up the development environment

```bash
# Install dependencies
npm install

# Run tests in watch mode
npm run test:watch

# Test the CLI locally
node bin/design-tokens-sync.js --help

# Test in a sample project
npm pack
cd /path/to/test-project
npm install /path/to/design-tokens-sync-1.0.0.tgz
```

### Making Changes

1. **Create a branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Add tests** for new functionality

4. **Run the test suite:**
   ```bash
   npm test
   npm run test:coverage
   ```

5. **Commit your changes:**
   ```bash
   git commit -m "feat: add new feature description"
   ```

## 📁 Project Structure

```
design-tokens-sync/
├── bin/                    # CLI entry point
├── src/
│   ├── cli/               # CLI command implementations
│   ├── core/              # Core processing modules
│   ├── analytics/         # Analytics engine
│   └── utils/             # Utility functions
├── templates/             # Project templates
│   ├── react/            # React-specific templates
│   ├── vue/              # Vue-specific templates
│   └── github-actions/   # CI/CD workflows
├── test/                  # Test files
└── docs/                  # Additional documentation
```

## 🧪 Testing

We use Jest for testing. Our test strategy includes:

### Integration Tests
- CLI command functionality
- End-to-end workflows
- Template validation

### Test Commands
```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode for development
npm run test:coverage      # Generate coverage report
npm run test:ci           # CI-optimized test run
```

### Writing Tests

Create tests in the `test/` directory following this pattern:

```javascript
describe('Feature Name', () => {
  test('should do something specific', () => {
    // Test implementation
  });
});
```

## 🎨 Code Style

### JavaScript/ES6
- Use ES6 modules (`import`/`export`)
- Use async/await for asynchronous operations
- Follow JSDoc conventions for documentation
- Use meaningful variable and function names

### Example Code Style

```javascript
/**
 * Transform raw tokens into standardized format
 * @param {Object} rawTokens - Raw token data from Token Studio
 * @returns {Object} Transformed tokens
 */
export async function transformTokens(rawTokens) {
  const transformed = {
    colors: extractColors(rawTokens),
    spacing: extractSpacing(rawTokens),
    typography: extractTypography(rawTokens)
  };
  
  return transformed;
}
```

### CLI Commands
- Use Commander.js patterns
- Provide helpful descriptions and examples
- Include proper error handling
- Add progress indicators for long operations

## 📦 Adding New Features

### New CLI Commands

1. **Create command file** in `src/cli/`
2. **Add to main CLI** in `bin/design-tokens-sync.js`
3. **Write tests** in `test/cli/`
4. **Update documentation**

Example:
```javascript
// src/cli/new-command.js
export async function newCommand(options) {
  console.log('🚀 Running new command...');
  // Implementation
}
```

### New Output Formats

1. **Add format to FileGenerator** in `src/core/FileGenerator.js`
2. **Create template** if needed
3. **Add tests**
4. **Update configuration schema**

### New Frameworks

1. **Create template directory** in `templates/framework-name/`
2. **Add framework detection** in `src/cli/init.js`
3. **Create example components**
4. **Add documentation**

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected vs actual behavior**
4. **Environment details:**
   - Node.js version
   - npm version
   - Operating system
   - Package version

Use this template:

```markdown
## Bug Description
Brief description of the issue

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Node.js: v18.0.0
- npm: 8.0.0
- OS: macOS 12.0
- Package: design-tokens-sync@1.0.0
```

## 💡 Feature Requests

We welcome feature requests! Please:

1. **Check existing issues** to avoid duplicates
2. **Describe the use case** clearly
3. **Explain the expected behavior**
4. **Consider implementation** if possible

## 📝 Documentation

### README Updates
- Keep examples current and working
- Add new features to the feature list
- Update installation and usage instructions

### Code Documentation
- Use JSDoc for functions and classes
- Include examples in complex functions
- Document configuration options

### Examples
Add practical examples in the `examples/` directory for:
- Framework integrations
- Custom configurations
- Advanced use cases

## 🔄 Release Process

1. **Update version** in `package.json`
2. **Update CHANGELOG.md**
3. **Create release notes**
4. **Tag the release**
5. **Publish to npm**

## 🏆 Recognition

Contributors will be:
- Listed in the README
- Mentioned in release notes
- Added to the contributors section

## 📞 Getting Help

- **GitHub Issues:** For bugs and feature requests
- **GitHub Discussions:** For questions and ideas
- **Email:** sixi3@example.com for private matters

## 📋 Commit Convention

We follow conventional commits:

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: test changes
chore: maintenance tasks
```

Examples:
```
feat: add Vue template support
fix: resolve token validation edge case
docs: update API documentation
test: add CLI integration tests
```

---

Thank you for contributing to design-tokens-sync! 🎉 