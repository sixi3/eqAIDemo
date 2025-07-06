# Design System Analytics

A comprehensive analytics system for tracking design token usage, changes, and adoption across your codebase.

## 🎯 Features

- **Token Usage Tracking**: Automatically scan your codebase to find token usage patterns
- **Change History**: Track all token modifications with git metadata
- **Adoption Metrics**: Calculate adoption rates and identify unused tokens
- **Visual Dashboard**: Interactive React dashboard with charts and metrics
- **Automated Reports**: Generate reports in multiple formats (JSON, CSV, HTML)
- **CI/CD Integration**: Automated weekly reports via GitHub Actions
- **Trend Analysis**: Track changes over time and identify patterns

## 🚀 Quick Start

### 1. Collect Analytics Data

```bash
npm run analytics:collect
```

This will scan your codebase and collect token usage statistics.

### 2. Generate a Report

```bash
npm run analytics:report --console
```

This generates a comprehensive report and displays a summary in the console.

### 3. View the Dashboard

```bash
npm run analytics:dashboard
```

Opens the interactive analytics dashboard at `http://localhost:3000/analytics`.

## 📊 Available Commands

### Data Collection

```bash
# Collect current usage data
npm run analytics:collect

# Update tokens and track changes
npm run tokens:update
```

### Report Generation

```bash
# Generate report with console output
npm run analytics:report --console

# Generate HTML report
npm run analytics:report --format=html

# Generate CSV export
npm run analytics:report --format=csv --output=reports/analytics.csv
```

### Data Export

```bash
# Export all data as JSON
npm run analytics:export

# Export only usage data as CSV
npm run analytics:export:csv --data=usage

# Export recommendations as HTML
npm run analytics:export:html --data=recommendations

# Export with custom options
npm run analytics:export --format=txt --data=changes --output=changes.txt
```

### Dashboard

```bash
# Launch analytics dashboard
npm run analytics:dashboard

# View design system showcase
npm run dev
# Then navigate to /analytics
```

## 🔧 Configuration

### Analytics File Structure

The system creates a `.design-system-analytics.json` file to store:

```json
{
  "tokenChanges": [
    {
      "timestamp": "2024-01-15T10:30:00Z",
      "type": "modified",
      "token": "colors.primary.500",
      "oldValue": "#00a337",
      "newValue": "#00b140",
      "author": "john.doe",
      "commit": "abc123",
      "category": "colors"
    }
  ],
  "usage": {
    "colors.primary.500": {
      "count": 45,
      "files": ["src/App.tsx", "src/components/Button.tsx"],
      "type": "color",
      "category": "colors"
    }
  },
  "lastScan": "2024-01-15T10:30:00Z"
}
```

### Token Detection Patterns

The system automatically detects tokens using these patterns:

- **CSS Variables**: `var(--token-name)`
- **Tailwind Classes**: `text-primary-500`, `bg-secondary-200`
- **Typography**: `text-lg`, `font-semibold`
- **Spacing**: `spacing-4`, `p-4`, `m-8`
- **Border Radius**: `rounded-lg`, `rounded-full`

### Adding Custom Patterns

Edit `scripts/design-analytics.js` to add custom search patterns:

```javascript
const searchPatterns = [
  { pattern: /your-custom-pattern/g, type: 'custom-type' },
  // ... existing patterns
];
```

## 📈 Understanding the Reports

### Summary Metrics

- **Total Tokens**: All defined tokens in `tokens.json`
- **Active Tokens**: Tokens actually used in your codebase
- **Adoption Rate**: Percentage of defined tokens being used
- **Total Changes**: Number of token modifications tracked

### Usage Analytics

- **Most Used Tokens**: Ranked by frequency of use
- **Category Breakdown**: Usage by token category (colors, spacing, etc.)
- **File Distribution**: Which files use the most tokens

### Change Tracking

- **Change Frequency**: Tokens that change most often
- **Recent Activity**: Changes in the last 30 days
- **Contributors**: Who makes token changes

### Recommendations

The system provides actionable recommendations:

- **🟡 Medium Priority**: Unused tokens to consider removing
- **🔴 High Priority**: Frequently changing tokens (stability issues)
- **🟢 Low Priority**: General optimization suggestions

## 🤖 Automated Workflows

### GitHub Actions

The system includes a GitHub Action (`.github/workflows/design-system-report.yml`) that:

- Runs every Monday at 9 AM UTC
- Generates comprehensive reports
- Archives data for trend analysis
- Sends Slack notifications (optional)
- Comments on relevant PRs

### Manual Trigger

You can manually trigger the workflow:

1. Go to your repository's Actions tab
2. Select "Design System Weekly Report"
3. Click "Run workflow"
4. Choose format and notification options

### Slack Integration

To enable Slack notifications, add these secrets to your repository:

```bash
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
```

## 📋 Report Formats

### JSON Format

Complete analytics data suitable for programmatic analysis:

```json
{
  "metadata": {
    "generatedAt": "2024-01-15T10:30:00Z",
    "period": "2024-01-01 to 2024-01-31",
    "version": "1.0.0"
  },
  "summary": {
    "totalTokens": 85,
    "activeTokens": 67,
    "adoptionRate": 78.8,
    "mostUsedTokens": [...]
  }
}
```

### CSV Format

Tabular data perfect for spreadsheet analysis:

```csv
Token,Usage Count,Files Count,Category,Type
colors.primary.500,45,12,colors,color
spacing.4,38,15,spacing,dimension
```

### HTML Format

Visual report with styling and charts, great for sharing with stakeholders.

### Text Format

Plain text summary for quick console viewing or documentation.

## 🔍 Troubleshooting

### Common Issues

**No tokens detected**
- Ensure your code uses the supported token patterns
- Check that files are in the correct directories (`src/`, `components/`)
- Verify the search patterns match your naming conventions

**Missing change history**
- Token changes are only tracked after the first run
- Ensure the analytics system is integrated with your token update process

**Dashboard not loading**
- Make sure you've installed all dependencies: `npm install`
- Check that the route is properly configured in your React app
- Verify there are no TypeScript compilation errors

### Debug Mode

Enable debug logging:

```bash
DEBUG=true npm run analytics:collect
```

### Manual Data Reset

To reset analytics data:

```bash
rm .design-system-analytics.json
npm run analytics:collect
```

## 📦 Integration Examples

### Pre-commit Hook

Add to `.husky/pre-commit`:

```bash
#!/bin/sh
npm run analytics:collect
```

### CI/CD Pipeline

Add to your CI pipeline:

```yaml
- name: Update Design System Analytics
  run: |
    npm run analytics:collect
    npm run analytics:report --format=json
    
- name: Upload Analytics
  uses: actions/upload-artifact@v4
  with:
    name: design-system-analytics
    path: .design-system-analytics.json
```

### VS Code Integration

Add to `.vscode/tasks.json`:

```json
{
  "label": "Generate Analytics Report",
  "type": "shell",
  "command": "npm run analytics:report --console",
  "group": "build"
}
```

## 🎨 Dashboard Features

The React dashboard (`/analytics`) provides:

- **Real-time Metrics**: Live token usage statistics
- **Interactive Charts**: Visual breakdowns by category
- **Trend Visualization**: Historical data and changes
- **Recommendation Cards**: Actionable insights
- **Export Options**: Download reports directly from the UI

### Customizing the Dashboard

The dashboard component is located at `src/components/design-system/DesignSystemDashboard.tsx`. You can:

- Modify the layout and styling
- Add custom charts and visualizations
- Integrate with your existing design system
- Add filtering and search capabilities

## 📚 API Reference

### DesignSystemAnalytics Class

```javascript
import DesignSystemAnalytics from './scripts/design-analytics.js';

const analytics = new DesignSystemAnalytics();

// Analyze current usage
await analytics.analyzeUsage();

// Generate comprehensive report
const report = analytics.generateReport();

// Track a token change
analytics.trackTokenChange({
  type: 'modified',
  token: 'colors.primary.500',
  oldValue: '#00a337',
  newValue: '#00b140'
});

// Export data
const filename = analytics.exportData('html');
```

### Key Methods

- `analyzeUsage()`: Scan codebase for token usage
- `generateReport()`: Create comprehensive analytics report
- `trackTokenChange(change)`: Record a token modification
- `exportData(format)`: Export analytics in specified format
- `compareTokens(oldTokens, newTokens)`: Find differences between token sets

## 🚀 Contributing

To contribute to the analytics system:

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Update documentation
5. Submit a pull request

### Development Setup

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run analytics
npm run analytics:collect
npm run analytics:report --console
```

## 📄 License

This analytics system is part of the EQ AI Voice Assistant prototype and follows the project's licensing terms. 