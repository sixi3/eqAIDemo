# Figma Integration Guide

This guide explains how to use the Figma integration system to sync your design system between your code and Figma designs.

## Overview

The Figma integration allows you to:
- **Push design system changes** from your code to Figma
- **Pull design updates** from Figma back to your code
- **Auto-sync** changes in real-time
- **Export design tokens** for Figma plugins
- **Generate Figma Variables** for the new Variables feature

## Setup Instructions

### 1. Get Figma Access Token

1. Open Figma and go to **Settings** → **Personal access tokens**
2. Click **Generate new token**
3. Give it a name like "Design System Sync"
4. Select the following permissions:
   - **File content** - **Read only** (required for reading styles and file data)
   - **Library assets** - **Read only** (for accessing published styles)
5. Copy the generated token (save it securely!)

### 2. Get Figma File Key

1. Open your Figma file
2. Copy the URL from your browser
3. Extract the file key from the URL:
   ```
   https://www.figma.com/file/[FILE_KEY]/Your-Design-System
                              ^^^^^^^^
                              This is your file key
   ```

### 3. Configure Integration

#### Method 1: Using the UI Manager
1. Go to `/design-system` in your app
2. Click the floating ⚙️ button
3. Navigate to the **Figma** tab
4. Enter your access token and file key
5. Click **Setup Figma Sync**

#### Method 2: Programmatically
```typescript
import { createFigmaSync } from './utils/figma-sync';

const figmaSync = createFigmaSync({
  accessToken: 'your-figma-token',
  fileKey: 'your-file-key',
  autoSync: true,
  syncInterval: 30000 // 30 seconds
});

// Start syncing
figmaSync.startAutoSync();
```

## Usage Methods

### 1. Pull from Figma (Figma → Code) - **Primary Method**

**What it does**: Imports design system changes from Figma back to your code.

**When to use**: After designers make changes in Figma and you want to update your code.

```typescript
// Via UI Manager
// Click "📥 Pull from Figma" button

// Programmatically
await figmaSync.pullFromFigma();
```

**What gets synced**:
- ✅ Color styles from Figma → Your design system
- ✅ Text styles and typography → Your code
- ✅ Published library components
- ✅ Style organization and naming

### 2. Export Design Tokens (Figma → Files)

**What it does**: Generates JSON files from your Figma styles for use in code or other tools.

**When to use**: To create design token files that match your Figma styles exactly.

### 2. Pull from Figma (Figma → Code)

**What it does**: Imports design system changes from Figma back to your code.

**When to use**: After designers make changes in Figma and you want to update your code.

```typescript
// Via UI Manager
// Click "📥 Pull from Figma" button

// Programmatically
await figmaSync.pullFromFigma();
```

### 3. Auto-Sync

**What it does**: Automatically pushes changes to Figma every 30 seconds when enabled.

**When to use**: During active development when you want real-time sync.

```typescript
// Enable auto-sync
figmaSync.startAutoSync();

// Disable auto-sync
figmaSync.stopAutoSync();
```

### 4. Export Design Tokens

**What it does**: Generates JSON files compatible with Figma plugins and tools.

#### Design Tokens Format
```json
{
  "global": {
    "colors": {
      "primary": {
        "50": { "value": "#f0f9ff" },
        "500": { "value": "#00b140" },
        "900": { "value": "#0c4a6e" }
      }
    },
    "typography": {
      "fontFamily": {
        "primary": { "value": "DM Sans" }
      }
    },
    "spacing": {
      "4": { "value": "1rem" },
      "8": { "value": "2rem" }
    }
  }
}
```

#### Figma Variables Format
```json
{
  "collections": [
    {
      "id": "colors",
      "name": "Colors",
      "modes": [{ "id": "light", "name": "Light" }],
      "variables": [
        {
          "id": "primary-500",
          "name": "primary/500",
          "type": "COLOR",
          "values": { "light": "#00b140" }
        }
      ]
    }
  ]
}
```

## Integration Workflows

### Workflow 1: Designer-First (Figma → Code)

1. **Designer** creates/updates styles in Figma
2. **Developer** pulls changes: `figmaSync.pullFromFigma()`
3. **System** updates code design system automatically
4. **Developer** reviews and commits changes

### Workflow 2: Developer-First (Code → Figma)

1. **Developer** updates design system in code
2. **System** automatically pushes to Figma (if auto-sync enabled)
3. **Designer** sees updated styles in Figma
4. **Team** stays in sync

### Workflow 3: Collaborative (Bidirectional)

1. **Anyone** makes changes in either Figma or code
2. **System** syncs changes automatically
3. **Team** gets notifications of changes
4. **Conflicts** are resolved through version control

## Figma File Structure

### Recommended Setup

Create a dedicated Figma file for your design system with:

```
📁 Design System File
├── 🎨 Colors Page
│   ├── Primary Colors
│   ├── Secondary Colors
│   ├── Neutral Colors
│   └── Semantic Colors
├── 📝 Typography Page
│   ├── Display Styles
│   ├── Headline Styles
│   ├── Title Styles
│   ├── Body Styles
│   └── Label Styles
├── 📐 Spacing Page
│   └── Spacing Scale
└── 🧩 Components Page
    ├── Buttons
    ├── Cards
    ├── Forms
    └── Voice Components
```

### Style Naming Convention

The system creates styles with this naming pattern:

**Colors**:
- `Primary/50`, `Primary/100`, ..., `Primary/900`
- `Secondary/50`, `Secondary/100`, ..., `Secondary/900`
- `Neutral/50`, `Neutral/100`, ..., `Neutral/900`
- `Success/500`, `Warning/500`, `Error/500`

**Typography**:
- `Display Large`, `Display Medium`, `Display Small`
- `Headline Large`, `Headline Medium`, `Headline Small`
- `Title Large`, `Title Medium`, `Title Small`
- `Body Large`, `Body Medium`, `Body Small`
- `Label Large`, `Label Medium`, `Label Small`

## Advanced Features

### Custom Sync Configuration

```typescript
const figmaSync = createFigmaSync({
  accessToken: 'your-token',
  fileKey: 'your-file-key',
  autoSync: true,
  syncInterval: 60000, // 1 minute
  teamId: 'your-team-id' // Optional: for team-specific features
});
```

### Selective Sync

```typescript
// Only sync colors
await figmaSync.pushColorsToFigma();

// Only sync typography
await figmaSync.pushTypographyToFigma();

// Custom sync with specific styles
await figmaSync.pushCustomStyles({
  colors: ['primary', 'secondary'],
  typography: ['display-large', 'body-medium']
});
```

### Batch Operations

```typescript
// Sync multiple files
const files = ['file-key-1', 'file-key-2', 'file-key-3'];
await Promise.all(files.map(fileKey => {
  const sync = createFigmaSync({ accessToken, fileKey, autoSync: false, syncInterval: 0 });
  return sync.pushToFigma();
}));
```

## Integration with Design System Manager

The Figma integration is built into the Design System Manager UI:

### Real-time Sync Status
- ✅ **Connected**: Figma API is configured and working
- 🔄 **Auto-sync Enabled**: Changes sync automatically
- 📊 **Last Sync**: Timestamp of last successful sync
- 📈 **Sync History**: All sync operations are logged

### Change Tracking
All Figma sync operations are tracked in the change history:
```typescript
// Example change log entry
{
  timestamp: 1642678800000,
  type: 'component',
  property: 'figma-sync',
  oldValue: null,
  newValue: 'pushed-to-figma',
  reason: 'Design system synchronized with Figma'
}
```

## Troubleshooting

### Common Issues

#### 1. Authentication Errors
```
❌ Failed to push to Figma: 401 Unauthorized
```
**Solution**: Check your access token is valid and has correct permissions.

#### 2. File Not Found
```
❌ Failed to push to Figma: 404 Not Found
```
**Solution**: Verify the file key is correct and you have access to the file.

#### 3. Rate Limiting
```
❌ Failed to push to Figma: 429 Too Many Requests
```
**Solution**: Reduce sync frequency or implement retry logic.

#### 4. Network Issues
```
❌ Failed to push to Figma: Network error
```
**Solution**: Check internet connection and Figma API status.

### Debug Mode

Enable debug logging to troubleshoot issues:

```typescript
// Enable debug mode
const figmaSync = createFigmaSync({
  accessToken: 'your-token',
  fileKey: 'your-file-key',
  autoSync: false,
  syncInterval: 0,
  debug: true // Enable debug logging
});
```

### Testing Connection

```typescript
// Test if connection works
try {
  await figmaSync.testConnection();
  console.log('✅ Figma connection successful');
} catch (error) {
  console.error('❌ Figma connection failed:', error);
}
```

## Best Practices

### 1. Use Dedicated Design System File
- Create a separate Figma file for your design system
- Don't mix design system styles with project-specific designs
- Use consistent naming conventions

### 2. Establish Clear Workflows
- Define who can make changes where (Figma vs code)
- Set up review processes for design system changes
- Use version control for both code and Figma files

### 3. Monitor Sync Operations
- Regularly check sync history in the Design System Manager
- Set up alerts for failed sync operations
- Keep backups of both code and Figma files

### 4. Handle Conflicts Gracefully
- Use pull requests for design system changes
- Review changes before merging
- Communicate changes to the team

### 5. Security Considerations
- Store Figma tokens securely (environment variables)
- Rotate tokens regularly
- Use team-specific tokens when possible
- Don't commit tokens to version control

## Environment Variables

Set up environment variables for production use:

```bash
# .env
FIGMA_ACCESS_TOKEN=your-figma-token
FIGMA_FILE_KEY=your-file-key
FIGMA_AUTO_SYNC=true
FIGMA_SYNC_INTERVAL=30000
```

```typescript
// Use in your app
const figmaSync = createFigmaSync({
  accessToken: process.env.FIGMA_ACCESS_TOKEN!,
  fileKey: process.env.FIGMA_FILE_KEY!,
  autoSync: process.env.FIGMA_AUTO_SYNC === 'true',
  syncInterval: parseInt(process.env.FIGMA_SYNC_INTERVAL || '30000')
});
```

## API Reference

### FigmaDesignSystemSync Class

```typescript
class FigmaDesignSystemSync {
  constructor(config: FigmaConfig)
  
  // Core sync methods
  async pushToFigma(): Promise<void>
  async pullFromFigma(): Promise<void>
  
  // Auto-sync control
  startAutoSync(): void
  stopAutoSync(): void
  
  // Export methods
  generateFigmaTokens(): string
  exportForFigma(): any
  
  // Utility methods
  async testConnection(): Promise<boolean>
  getLastSyncTime(): Date | null
  getSyncHistory(): SyncHistoryEntry[]
}
```

### Configuration Interface

```typescript
interface FigmaConfig {
  accessToken: string;    // Figma personal access token
  fileKey: string;        // Figma file key from URL
  teamId?: string;        // Optional team ID
  autoSync: boolean;      // Enable automatic syncing
  syncInterval: number;   // Sync interval in milliseconds
}
```

This comprehensive Figma integration ensures your design system stays synchronized between your code and Figma designs, enabling seamless collaboration between designers and developers. 