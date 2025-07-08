# API Documentation

Complete API reference for design-tokens-sync.

## Core Modules

### TokenProcessor

The main processing engine for design tokens.

```javascript
import { TokenProcessor } from 'design-tokens-sync/core';
```

#### Constructor

```javascript
new TokenProcessor(options)
```

**Parameters:**
- `options` (Object): Configuration options
  - `configPath` (string): Path to configuration file
  - `silent` (boolean): Suppress console output

**Example:**
```javascript
const processor = new TokenProcessor({
  configPath: './design-tokens.config.js',
  silent: false
});
```

#### Methods

##### `init()`

Initialize the processor with configuration.

```javascript
async init()
```

**Returns:** Promise<Object> - Configuration object

**Example:**
```javascript
const config = await processor.init();
console.log('Loaded config:', config);
```

##### `loadTokens(forceReload)`

Load and parse tokens from the configured input file.

```javascript
async loadTokens(forceReload = false)
```

**Parameters:**
- `forceReload` (boolean): Force reload even if tokens are cached

**Returns:** Promise<Object> - Parsed tokens

**Example:**
```javascript
const tokens = await processor.loadTokens();
console.log('Colors:', tokens.colors);
```

##### `transformTokens(rawTokens)`

Transform raw tokens into standardized format.

```javascript
transformTokens(rawTokens)
```

**Parameters:**
- `rawTokens` (Object): Raw token data from Token Studio

**Returns:** Object - Transformed tokens

**Example:**
```javascript
const transformed = processor.transformTokens(rawTokens);
```

##### `sync(options)`

Synchronize tokens to output files.

```javascript
async sync(options = {})
```

**Parameters:**
- `options` (Object): Sync options
  - `force` (boolean): Force sync even if no changes
  - `skipGit` (boolean): Skip git operations

**Returns:** Promise<Object> - Sync results

**Example:**
```javascript
const results = await processor.sync({
  force: true,
  skipGit: false
});
```

##### `watch()`

Start watching for token changes.

```javascript
async watch()
```

**Example:**
```javascript
await processor.watch();
console.log('Watching for changes...');
```

##### `stopWatch()`

Stop watching for changes.

```javascript
async stopWatch()
```

### TokenValidator

Validates token structure and values.

```javascript
import { TokenValidator } from 'design-tokens-sync/core';
```

#### Constructor

```javascript
new TokenValidator(options)
```

**Parameters:**
- `options` (Object): Validation options
  - `strict` (boolean): Enable strict validation
  - `rules` (Object): Custom validation rules

#### Methods

##### `validate(tokens)`

Validate token structure and values.

```javascript
async validate(tokens)
```

**Parameters:**
- `tokens` (Object): Tokens to validate

**Returns:** Promise<Object> - Validation results
- `isValid` (boolean): Overall validation result
- `errors` (Array): Validation errors
- `warnings` (Array): Validation warnings

**Example:**
```javascript
const validator = new TokenValidator();
const result = await validator.validate(tokens);

if (!result.isValid) {
  console.error('Validation errors:', result.errors);
}
```

##### `validateStructure(tokens)`

Validate token file structure.

```javascript
validateStructure(tokens)
```

**Returns:** Object - Structure validation results

##### `validateColors(colors)`

Validate color token values.

```javascript
validateColors(colors)
```

**Parameters:**
- `colors` (Object): Color tokens

**Returns:** Array - Validation errors

##### `validateSpacing(spacing)`

Validate spacing token values.

```javascript
validateSpacing(spacing)
```

**Parameters:**
- `spacing` (Object): Spacing tokens

**Returns:** Array - Validation errors

### FileGenerator

Generates output files in multiple formats.

```javascript
import { FileGenerator } from 'design-tokens-sync/core';
```

#### Constructor

```javascript
new FileGenerator(options)
```

#### Methods

##### `generateCSS(tokens, outputPath)`

Generate CSS custom properties.

```javascript
async generateCSS(tokens, outputPath)
```

**Parameters:**
- `tokens` (Object): Design tokens
- `outputPath` (string): Output file path

**Example:**
```javascript
const generator = new FileGenerator();
await generator.generateCSS(tokens, 'src/styles/tokens.css');
```

##### `generateTailwind(tokens, outputPath)`

Generate Tailwind configuration.

```javascript
async generateTailwind(tokens, outputPath)
```

##### `generateTypeScript(tokens, outputPath)`

Generate TypeScript definitions.

```javascript
async generateTypeScript(tokens, outputPath)
```

##### `generateSCSS(tokens, outputPath)`

Generate SCSS variables.

```javascript
async generateSCSS(tokens, outputPath)
```

##### `generateJSON(tokens, outputPath)`

Generate JSON output.

```javascript
async generateJSON(tokens, outputPath)
```

### GitManager

Handles version control operations.

```javascript
import { GitManager } from 'design-tokens-sync/core';
```

#### Constructor

```javascript
new GitManager(options)
```

#### Methods

##### `isGitRepository()`

Check if current directory is a git repository.

```javascript
async isGitRepository()
```

**Returns:** Promise<boolean>

##### `hasChanges()`

Check if there are unstaged changes.

```javascript
async hasChanges()
```

**Returns:** Promise<boolean>

##### `addFiles(files)`

Stage files for commit.

```javascript
async addFiles(files)
```

**Parameters:**
- `files` (Array): File paths to stage

##### `commit(message)`

Create a commit.

```javascript
async commit(message)
```

**Parameters:**
- `message` (string): Commit message

##### `push()`

Push changes to remote.

```javascript
async push()
```

## Analytics Module

### AnalyticsEngine

Analyzes token usage across codebase.

```javascript
import { AnalyticsEngine } from 'design-tokens-sync/analytics';
```

#### Constructor

```javascript
new AnalyticsEngine(options)
```

#### Methods

##### `collectUsage(scanPath)`

Collect token usage data.

```javascript
async collectUsage(scanPath = './src')
```

**Parameters:**
- `scanPath` (string): Directory to scan

**Returns:** Promise<Object> - Usage data

**Example:**
```javascript
const analytics = new AnalyticsEngine();
const usage = await analytics.collectUsage('./src');
console.log('Token usage:', usage);
```

##### `generateReport(usageData, options)`

Generate analytics report.

```javascript
async generateReport(usageData, options = {})
```

**Parameters:**
- `usageData` (Object): Usage data from collectUsage
- `options` (Object): Report options
  - `format` (string): 'json' | 'html' | 'csv'
  - `outputPath` (string): Output file path

**Returns:** Promise<Object> - Report data

##### `scanFile(filePath)`

Scan a single file for token usage.

```javascript
async scanFile(filePath)
```

**Parameters:**
- `filePath` (string): File to scan

**Returns:** Promise<Array> - Found tokens

##### `analyzeUsagePatterns(usageData)`

Analyze token usage patterns.

```javascript
analyzeUsagePatterns(usageData)
```

**Parameters:**
- `usageData` (Object): Usage data

**Returns:** Object - Analysis results

## Utility Functions

### Configuration

```javascript
import { loadConfig, validateConfig } from 'design-tokens-sync/utils';
```

#### `loadConfig(configPath)`

Load configuration from file.

```javascript
async loadConfig(configPath)
```

**Parameters:**
- `configPath` (string): Path to config file

**Returns:** Promise<Object> - Configuration object

#### `validateConfig(config)`

Validate configuration object.

```javascript
validateConfig(config)
```

**Parameters:**
- `config` (Object): Configuration to validate

**Returns:** Object - Validation results

### Token Utilities

```javascript
import { flattenTokens, resolveReferences } from 'design-tokens-sync/utils';
```

#### `flattenTokens(tokens, prefix)`

Flatten nested token structure.

```javascript
flattenTokens(tokens, prefix = '')
```

**Parameters:**
- `tokens` (Object): Nested tokens
- `prefix` (string): Key prefix

**Returns:** Object - Flattened tokens

#### `resolveReferences(tokens)`

Resolve token references.

```javascript
resolveReferences(tokens)
```

**Parameters:**
- `tokens` (Object): Tokens with references

**Returns:** Object - Resolved tokens

## CLI Commands

### Programmatic CLI Access

```javascript
import { runCommand } from 'design-tokens-sync/cli';
```

#### `runCommand(command, options)`

Run CLI command programmatically.

```javascript
async runCommand(command, options = {})
```

**Parameters:**
- `command` (string): Command name ('init', 'sync', 'watch', etc.)
- `options` (Object): Command options

**Returns:** Promise<Object> - Command results

**Example:**
```javascript
// Run sync command
const result = await runCommand('sync', {
  force: true,
  config: './my-config.js'
});

// Run analytics
const analytics = await runCommand('analytics', {
  action: 'report',
  format: 'html'
});
```

## Type Definitions

### Token Structure

```typescript
interface DesignToken {
  value: string | number;
  type: 'color' | 'spacing' | 'typography' | 'borderRadius' | 'shadow';
  description?: string;
}

interface TokenSet {
  [key: string]: DesignToken | TokenSet;
}

interface DesignTokens {
  colors?: TokenSet;
  spacing?: TokenSet;
  typography?: TokenSet;
  borderRadius?: TokenSet;
  shadows?: TokenSet;
  [key: string]: TokenSet | undefined;
}
```

### Configuration

```typescript
interface Config {
  tokens: {
    input: string;
    validation?: {
      required?: string[];
      optional?: string[];
      strict?: boolean;
    };
  };
  output: {
    css?: string;
    tailwind?: string;
    typescript?: string;
    scss?: string;
    json?: string;
  };
  git?: {
    enabled?: boolean;
    autoCommit?: boolean;
    autoPush?: boolean;
    commitMessage?: string;
  };
  analytics?: {
    enabled?: boolean;
    autoCollect?: boolean;
  };
  watch?: {
    enabled?: boolean;
    ignore?: string[];
  };
}
```

### Usage Data

```typescript
interface UsageData {
  tokens: {
    [tokenName: string]: {
      count: number;
      files: string[];
      locations: Array<{
        file: string;
        line: number;
        column: number;
      }>;
    };
  };
  summary: {
    totalTokens: number;
    usedTokens: number;
    unusedTokens: number;
    totalUsages: number;
  };
}
```

## Error Handling

All async methods can throw errors. Always use try-catch blocks:

```javascript
try {
  const tokens = await processor.loadTokens();
  await processor.sync();
} catch (error) {
  console.error('Error syncing tokens:', error.message);
  
  // Handle specific error types
  if (error.code === 'TOKENS_NOT_FOUND') {
    console.error('Tokens file not found');
  } else if (error.code === 'VALIDATION_FAILED') {
    console.error('Token validation failed:', error.details);
  }
}
```

## Events

The TokenProcessor emits events during processing:

```javascript
processor.on('tokens:loaded', (tokens) => {
  console.log('Tokens loaded:', Object.keys(tokens));
});

processor.on('sync:start', () => {
  console.log('Starting sync...');
});

processor.on('sync:complete', (results) => {
  console.log('Sync complete:', results);
});

processor.on('error', (error) => {
  console.error('Error:', error);
});
```

## Performance

### Optimization Tips

1. **Use caching:** Enable token caching for repeated operations
2. **Selective watching:** Configure watch ignore patterns
3. **Batch operations:** Process multiple files in batches
4. **Memory management:** Clean up large token objects when done

### Memory Usage

```javascript
// Monitor memory usage
const processor = new TokenProcessor();
console.log('Memory before:', process.memoryUsage());

await processor.loadTokens();
console.log('Memory after loading:', process.memoryUsage());

// Clean up
processor.cleanup();
```

---

For more examples and detailed usage, see the [examples directory](../examples/) and [README.md](../README.md). 