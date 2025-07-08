# Testing Guide for design-tokens-sync

This directory contains a comprehensive test suite for the design-tokens-sync package, covering all features, platforms, and edge cases.

## 🧪 Test Structure

```
test/
├── README.md                           # This file
├── comprehensive-testing-plan.md       # Complete testing strategy
├── setup.js                           # Global test setup
├── globalSetup.js                     # Jest global setup
├── globalTeardown.js                  # Jest global teardown
├── fixtures/                          # Test data and samples
│   ├── tokens/
│   │   ├── valid-tokens.json          # Complete valid token set
│   │   ├── minimal-tokens.json        # Minimal required tokens
│   │   ├── malformed.json             # Invalid JSON for error testing
│   │   └── large-tokens.json          # Large token set for performance
│   ├── configs/                       # Configuration files
│   ├── projects/                      # Sample project structures
│   └── outputs/                       # Expected output samples
├── unit/                              # Unit tests
│   ├── core/                          # Core module tests
│   │   ├── token-processor.test.js    # TokenProcessor functionality
│   │   ├── token-validator.test.js    # TokenValidator functionality
│   │   ├── file-generator.test.js     # FileGenerator functionality
│   │   └── git-manager.test.js        # GitManager functionality
│   ├── cli/                           # CLI module tests
│   ├── analytics/                     # Analytics module tests
│   └── utils/                         # Utility module tests
├── integration/                       # Integration tests
│   ├── full-workflow.test.js          # End-to-end workflows
│   ├── project-initialization.test.js # Project setup scenarios
│   ├── multi-platform.test.js         # Cross-platform generation
│   └── platforms/                     # Platform-specific tests
├── cli/                               # CLI integration tests
│   ├── cli-integration.test.js        # Full CLI testing (existing)
│   ├── cli-error-handling.test.js     # Error scenarios
│   └── cli-performance.test.js        # Performance benchmarks
├── mobile/                            # Mobile platform tests
│   ├── mobile-integration.test.js     # Cross-platform mobile (existing)
│   ├── mobile-generator.test.js       # Platform generators (existing)
│   └── platform-specific/             # Individual platform tests
├── performance/                       # Performance and load tests
│   ├── large-token-sets.test.js       # Large dataset handling
│   ├── concurrent-operations.test.js  # Parallel processing
│   └── memory-usage.test.js           # Memory consumption
└── security/                          # Security and validation tests
    ├── input-sanitization.test.js     # Input validation
    ├── file-permissions.test.js       # File system security
    └── path-traversal.test.js         # Path security
```

## 🚀 Running Tests

### Quick Start
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Categories

#### Unit Tests
```bash
# Run all unit tests
npm run test:unit

# Run specific module tests
npm run test:unit -- test/unit/core/
npm run test:unit -- test/unit/cli/
npm run test:unit -- test/unit/analytics/
```

#### Integration Tests
```bash
# Run all integration tests
npm run test:integration

# Run platform-specific integration tests
npm run test:integration -- test/integration/platforms/
```

#### CLI Tests
```bash
# Run CLI integration tests
npm run test:cli

# Run specific CLI command tests
npm run test:cli -- --testNamePattern="Init Command"
```

#### Mobile Platform Tests
```bash
# Run all mobile platform tests
npm run test:mobile

# Run specific mobile platform tests
npm run test:mobile -- --testNamePattern="React Native"
npm run test:mobile -- --testNamePattern="Flutter"
```

#### Performance Tests
```bash
# Run performance tests (longer timeout)
npm run test:performance

# Run specific performance categories
npm run test:performance -- --testNamePattern="Token Processing"
npm run test:performance -- --testNamePattern="Memory Management"
```

#### Security Tests
```bash
# Run security tests
npm run test:security

# Run specific security tests
npm run test:security -- --testNamePattern="Input Sanitization"
```

### Continuous Integration
```bash
# Run CI test suite (non-interactive)
npm run test:ci
```

## 📊 Coverage Requirements

The test suite maintains high coverage standards:

- **Line Coverage**: 85%
- **Branch Coverage**: 80%
- **Function Coverage**: 90%
- **Statement Coverage**: 85%

### Critical Path Coverage (100%)
- Token loading and parsing
- File generation for all platforms
- CLI command execution
- Error handling and recovery

### Coverage Reports
```bash
# Generate HTML coverage report
npm run test:coverage

# View coverage in browser
open coverage/lcov-report/index.html
```

## 🔧 Test Configuration

### Jest Configuration
The test suite uses Jest with the following key configurations:

```javascript
// jest.config.js highlights
{
  testEnvironment: 'node',
  testTimeout: 30000,
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 90,
      lines: 85,
      statements: 85
    }
  }
}
```

### Environment Variables
```bash
# Test environment (automatically set)
NODE_ENV=test
DESIGN_TOKENS_TEST=true

# Optional: Enable garbage collection in Node.js for memory tests
node --expose-gc npm test
```

## 📝 Test Data and Fixtures

### Test Fixtures
- **valid-tokens.json**: Complete, valid token set with all categories
- **minimal-tokens.json**: Minimal required tokens for basic testing
- **malformed.json**: Invalid JSON for error testing
- **large-tokens.json**: Large token set for performance testing

### Helper Functions
```javascript
// Available in all tests via setup.js
global.createTestProject(path, options)  // Create test project structure
global.cleanupTestProject(path)          // Clean up test files
global.suppressConsole()                 // Suppress console output
global.restoreConsole()                  // Restore console output
```

## 🎯 Writing Tests

### Test Structure Template
```javascript
import { ModuleToTest } from '../../src/module/ModuleToTest.js';
import fs from 'fs-extra';
import path from 'path';

describe('ModuleToTest', () => {
  let testDir;
  let moduleInstance;

  beforeEach(async () => {
    suppressConsole();
    testDir = path.join(global.TEST_TMP_DIR, `test-${Date.now()}`);
    await fs.ensureDir(testDir);
    moduleInstance = new ModuleToTest();
  });

  afterEach(async () => {
    restoreConsole();
    await fs.remove(testDir);
  });

  describe('Feature Group', () => {
    test('should perform expected behavior', async () => {
      // Arrange
      const input = 'test input';
      
      // Act
      const result = await moduleInstance.method(input);
      
      // Assert
      expect(result).toBeDefined();
      expect(result).toEqual(expectedOutput);
    });
  });
});
```

### Testing Best Practices

#### 1. Test Organization
- Group related tests in `describe` blocks
- Use descriptive test names that explain the expected behavior
- Follow the Arrange-Act-Assert pattern

#### 2. Async Testing
```javascript
// Correct: Use async/await
test('should handle async operations', async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});

// Correct: Return promise
test('should handle promises', () => {
  return asyncFunction().then(result => {
    expect(result).toBeDefined();
  });
});
```

#### 3. Error Testing
```javascript
// Test error scenarios
test('should throw error for invalid input', async () => {
  await expect(functionThatShouldThrow()).rejects.toThrow('Expected error message');
});

// Test error recovery
test('should recover gracefully from errors', async () => {
  // Simulate error condition
  // Verify graceful handling
});
```

#### 4. Performance Testing
```javascript
test('should complete within performance threshold', async () => {
  const startTime = Date.now();
  await performanceFunction();
  const endTime = Date.now();
  
  expect(endTime - startTime).toBeLessThan(1000); // < 1 second
});
```

#### 5. Memory Testing
```javascript
test('should not leak memory', async () => {
  const initialMemory = process.memoryUsage().heapUsed;
  
  // Perform operations
  for (let i = 0; i < 100; i++) {
    await memoryIntensiveOperation();
  }
  
  if (global.gc) global.gc(); // Force garbage collection
  
  const finalMemory = process.memoryUsage().heapUsed;
  const increase = finalMemory - initialMemory;
  
  expect(increase).toBeLessThan(10 * 1024 * 1024); // < 10MB
});
```

## 🔍 Debugging Tests

### Running Individual Tests
```bash
# Run specific test file
npm test -- test/unit/core/token-processor.test.js

# Run specific test case
npm test -- --testNamePattern="should load valid tokens"

# Run tests with verbose output
npm test -- --verbose

# Run tests with debugging
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Common Issues

#### 1. Test Timeouts
```javascript
// Increase timeout for slow tests
test('slow operation', async () => {
  // Test code
}, 60000); // 60 second timeout
```

#### 2. File System Cleanup
```javascript
// Ensure proper cleanup
afterEach(async () => {
  await fs.remove(testDir);
  // Clean up any global state
});
```

#### 3. Async Test Issues
```javascript
// Always return or await async operations
test('async test', async () => {
  await asyncOperation(); // Don't forget await
});
```

## 📈 Performance Benchmarks

### Current Performance Targets

| Operation | Target | Current |
|-----------|---------|---------|
| Process 1K tokens | < 1s | ~200ms |
| Process 10K tokens | < 5s | ~2s |
| Validate 5K tokens | < 3s | ~1s |
| Generate CSS (5K tokens) | < 2s | ~500ms |
| Analytics scan (500 files) | < 15s | ~8s |

### Memory Usage Targets

| Operation | Target | Current |
|-----------|---------|---------|
| Base memory usage | < 50MB | ~30MB |
| Large token processing | < 100MB increase | ~60MB |
| Multiple operations | < 10MB increase | ~5MB |

## 🚀 Continuous Integration

### GitHub Actions Integration
The test suite runs automatically on:
- Push to main branch
- Pull requests
- Manual workflow dispatch

### Test Matrix
- **Operating Systems**: Ubuntu, Windows, macOS
- **Node.js Versions**: 16, 18, 20
- **Test Types**: Unit, Integration, Performance

### Coverage Reporting
- Coverage reports are uploaded to Codecov
- Coverage badges in README
- Coverage trend tracking

## 📋 Test Checklist

### Before Committing
- [ ] All tests pass locally
- [ ] Coverage thresholds met
- [ ] No console errors or warnings
- [ ] Performance tests within limits
- [ ] Security tests pass

### Before Releasing
- [ ] Full test suite passes on CI
- [ ] Performance benchmarks verified
- [ ] Security audit clean
- [ ] Manual testing of critical workflows
- [ ] Documentation tests pass

This comprehensive test suite ensures the design-tokens-sync package is reliable, performant, and secure across all supported platforms and use cases. 