import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DesignSystemAnalytics {
  constructor() {
    this.analyticsFile = path.join(process.cwd(), '.design-system-analytics.json');
    this.tokensFile = path.join(process.cwd(), 'tokens.json');
    this.loadAnalytics();
  }

  loadAnalytics() {
    try {
      this.data = JSON.parse(fs.readFileSync(this.analyticsFile, 'utf8'));
    } catch {
      this.data = {
        tokenChanges: [],
        usage: {},
        adoption: {},
        history: [],
        lastScan: null
      };
    }
  }

  // Track every token change with metadata
  trackTokenChange(change) {
    const entry = {
      timestamp: new Date().toISOString(),
      type: change.type, // 'added', 'modified', 'deleted'
      token: change.token,
      oldValue: change.oldValue,
      newValue: change.newValue,
      author: this.getGitAuthor(),
      commit: this.getGitCommit(),
      category: this.getTokenCategory(change.token)
    };
    
    this.data.tokenChanges.push(entry);
    this.save();
    
    console.log(`📊 Tracked token change: ${change.type} - ${change.token}`);
  }

  // Track token usage across codebase
  async analyzeUsage() {
    console.log('🔍 Analyzing token usage across codebase...');
    const usage = {};
    
    // Search patterns for different token usage types
    const searchPatterns = [
      { pattern: /var\(--([^)]+)\)/g, type: 'css-variable' },
      { pattern: /text-primary-(\d+)/g, type: 'tailwind-text' },
      { pattern: /bg-primary-(\d+)/g, type: 'tailwind-bg' },
      { pattern: /bg-secondary-(\d+)/g, type: 'tailwind-secondary' },
      { pattern: /border-primary-(\d+)/g, type: 'tailwind-border' },
      { pattern: /spacing-(\w+)/g, type: 'spacing-token' },
      { pattern: /text-(xs|sm|base|lg|xl|\d*xl)/g, type: 'typography-size' },
      { pattern: /font-(normal|medium|semibold|bold)/g, type: 'typography-weight' },
      { pattern: /rounded-(none|sm|md|lg|xl|\d*xl|full)/g, type: 'border-radius' }
    ];

    const files = this.getSourceFiles();
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        searchPatterns.forEach(({ pattern, type }) => {
          const matches = content.matchAll(pattern);
          for (const match of matches) {
            const token = this.normalizeTokenName(match[1] || match[0], type);
            
            if (!usage[token]) {
              usage[token] = { 
                count: 0, 
                files: [], 
                type,
                category: this.getTokenCategory(token)
              };
            }
            
            usage[token].count++;
            if (!usage[token].files.includes(file)) {
              usage[token].files.push(file);
            }
          }
        });
      } catch (error) {
        console.warn(`⚠️ Could not analyze file: ${file}`);
      }
    }
    
    this.data.usage = usage;
    this.data.lastScan = new Date().toISOString();
    this.save();
    
    console.log(`✅ Found ${Object.keys(usage).length} tokens in use`);
    return usage;
  }

  // Compare old and new tokens to detect changes
  compareTokens(oldTokens, newTokens) {
    const changes = [];
    const oldFlat = this.flattenTokens(oldTokens);
    const newFlat = this.flattenTokens(newTokens);
    
    // Check for modified tokens
    Object.keys(newFlat).forEach(token => {
      if (oldFlat[token] && oldFlat[token].value !== newFlat[token].value) {
        changes.push({
          type: 'modified',
          token,
          oldValue: oldFlat[token].value,
          newValue: newFlat[token].value
        });
      } else if (!oldFlat[token]) {
        changes.push({
          type: 'added',
          token,
          oldValue: null,
          newValue: newFlat[token].value
        });
      }
    });
    
    // Check for deleted tokens
    Object.keys(oldFlat).forEach(token => {
      if (!newFlat[token]) {
        changes.push({
          type: 'deleted',
          token,
          oldValue: oldFlat[token].value,
          newValue: null
        });
      }
    });
    
    return changes;
  }

  // Generate comprehensive analytics report
  generateReport() {
    const report = {
      metadata: {
        generatedAt: new Date().toISOString(),
        period: this.getReportPeriod(),
        version: this.getProjectVersion()
      },
      summary: {
        totalTokens: Object.keys(this.getAllDefinedTokens()).length,
        activeTokens: Object.keys(this.data.usage).length,
        totalChanges: this.data.tokenChanges.length,
        uniqueContributors: this.getUniqueContributors().length,
        lastUpdate: this.data.tokenChanges[this.data.tokenChanges.length - 1]?.timestamp,
        mostUsedTokens: this.getMostUsedTokens(),
        unusedTokens: this.getUnusedTokens().unused.map(t => t.token),
        unusedTokensAnalysis: this.getUnusedTokens(),
        adoptionRate: this.calculateAdoptionRate()
      },
      changeFrequency: this.calculateChangeFrequency(),
      adoptionMetrics: this.calculateAdoption(),
      categoryBreakdown: this.getCategoryBreakdown(),
      recommendations: this.generateRecommendations(),
      trends: this.calculateTrends()
    };
    
    return report;
  }

  // Helper methods
  getMostUsedTokens(limit = 10) {
    return Object.entries(this.data.usage)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, limit)
      .map(([token, data]) => ({ token, ...data }));
  }

  // Improved method for getting unused tokens with better logic
  getUnusedTokens() {
    const allTokens = this.getAllDefinedTokens();
    const usedTokens = this.data.usage;
    
    // Create a comprehensive mapping of all possible token references
    const tokenMappings = this.createTokenMappings(allTokens);
    
    const unusedTokens = [];
    const partiallyUsedTokens = [];
    const indirectlyUsedTokens = [];
    
    Object.keys(allTokens).forEach(tokenPath => {
      const possibleReferences = tokenMappings[tokenPath] || [];
      
      // Check if any variation of this token is used
      const isDirectlyUsed = Object.keys(usedTokens).some(usedToken => 
        possibleReferences.includes(usedToken) || usedToken === tokenPath
      );
      
      // Check for indirect usage (e.g., through Tailwind defaults)
      const isIndirectlyUsed = this.checkIndirectUsage(tokenPath, usedTokens);
      
      if (!isDirectlyUsed && !isIndirectlyUsed) {
        // Categorize the unused token
        const category = this.categorizeUnusedToken(tokenPath, allTokens[tokenPath]);
        unusedTokens.push({
          token: tokenPath,
          category: category.type,
          reason: category.reason,
          value: allTokens[tokenPath].value,
          recommendation: category.recommendation
        });
      } else if (isIndirectlyUsed && !isDirectlyUsed) {
        indirectlyUsedTokens.push({
          token: tokenPath,
          usage: 'indirect',
          value: allTokens[tokenPath].value
        });
      }
    });
    
    return {
      unused: unusedTokens,
      indirectlyUsed: indirectlyUsedTokens,
      summary: {
        totalUnused: unusedTokens.length,
        safeToRemove: unusedTokens.filter(t => t.recommendation === 'remove').length,
        reviewNeeded: unusedTokens.filter(t => t.recommendation === 'review').length,
        keepForSystem: unusedTokens.filter(t => t.recommendation === 'keep').length
      }
    };
  }

  // Create comprehensive token mapping for all possible references
  createTokenMappings(allTokens) {
    const mappings = {};
    
    Object.keys(allTokens).forEach(tokenPath => {
      const variations = [];
      
      // Original path
      variations.push(tokenPath);
      
      // CSS variable format (with dashes)
      variations.push(tokenPath.replace(/\./g, '-'));
      
      // Extract final segment for Tailwind classes
      const segments = tokenPath.split('.');
      if (segments.length > 1) {
        const lastSegment = segments[segments.length - 1];
        variations.push(lastSegment);
        
        // For colors, add common Tailwind patterns
        if (tokenPath.includes('colors.')) {
          const colorName = segments[1]; // primary, secondary, etc.
          const shade = segments[2];
          variations.push(`${colorName}-${shade}`);
          variations.push(`colors.${colorName}.${shade}`);
        }
        
        // For spacing, add common patterns
        if (tokenPath.includes('spacing.')) {
          const spaceValue = segments[1];
          variations.push(`spacing-${spaceValue}`);
          variations.push(spaceValue);
        }
        
        // For typography
        if (tokenPath.includes('typography.')) {
          const typeCategory = segments[1]; // fontSize, fontWeight, etc.
          const typeValue = segments[2];
          variations.push(`${typeCategory}.${typeValue}`);
          variations.push(`typography.${typeCategory}.${typeValue}`);
        }
        
        // For borderRadius
        if (tokenPath.includes('borderRadius.')) {
          const radiusValue = segments[1];
          variations.push(`borderRadius.${radiusValue}`);
          variations.push(`border-radius-${radiusValue}`);
        }
      }
      
      mappings[tokenPath] = [...new Set(variations)]; // Remove duplicates
    });
    
    return mappings;
  }

  // Check for indirect usage (tokens used through system defaults)
  checkIndirectUsage(tokenPath, usedTokens) {
    // Check if this token is referenced by other tokens (token references)
    const tokenValue = this.getAllDefinedTokens()[tokenPath]?.value;
    if (tokenValue && tokenValue.startsWith('{') && tokenValue.endsWith('}')) {
      // This is a reference token, might be used indirectly
      return true;
    }
    
    // Check for system defaults that might use this token
    if (tokenPath.includes('spacing.0') || tokenPath.includes('opacity.100')) {
      // These are often used as defaults in CSS frameworks
      return true;
    }
    
    // Check if this token is used in generated CSS files
    const cssFiles = ['src/styles/tokens.css', 'tailwind.config.js'];
    // This would require file reading, simplified for now
    
    return false;
  }

  // Categorize unused tokens for better insights
  categorizeUnusedToken(tokenPath, tokenData) {
    const value = tokenData.value;
    const description = tokenData.description || '';
    
    // System/utility tokens
    if (tokenPath.includes('opacity.0') || 
        tokenPath.includes('spacing.0') || 
        tokenPath.includes('borderRadius.DEFAULT')) {
      return {
        type: 'system',
        reason: 'System utility token, may be used indirectly',
        recommendation: 'keep'
      };
    }
    
    // Font families (often defined but used through CSS)
    if (tokenPath.includes('fontFamily')) {
      return {
        type: 'system',
        reason: 'Font family tokens are often used in CSS configuration',
        recommendation: 'review'
      };
    }
    
    // Extreme color shades (very light/dark)
    if (tokenPath.includes('colors.') && 
        (tokenPath.includes('.50') || tokenPath.includes('.950') || 
         tokenPath.includes('.900') || tokenPath.includes('.100'))) {
      return {
        type: 'design-scale',
        reason: 'Extreme shade in color scale, may be used for subtle effects',
        recommendation: 'review'
      };
    }
    
    // Large spacing values
    if (tokenPath.includes('spacing.') && 
        (tokenPath.includes('.20') || tokenPath.includes('.24'))) {
      return {
        type: 'design-scale',
        reason: 'Large spacing value, may be used for layout',
        recommendation: 'review'
      };
    }
    
    // Mid-range tokens that are likely truly unused
    if (tokenPath.includes('colors.') && 
        (tokenPath.includes('.200') || tokenPath.includes('.300') || 
         tokenPath.includes('.400') || tokenPath.includes('.800'))) {
      return {
        type: 'unused-design',
        reason: 'Mid-range design token not found in codebase',
        recommendation: 'remove'
      };
    }
    
    // Default case
    return {
      type: 'unknown',
      reason: 'Token not detected in codebase scan',
      recommendation: 'review'
    };
  }

  // Enhanced recommendations based on improved unused token analysis
  generateRecommendations() {
    const recommendations = [];
    const unusedAnalysis = this.getUnusedTokens();
    const changeFreq = this.calculateChangeFrequency();
    
    // Improved unused tokens recommendations
    if (unusedAnalysis.summary.safeToRemove > 0) {
      recommendations.push({
        type: 'cleanup',
        priority: 'medium',
        message: `Consider removing ${unusedAnalysis.summary.safeToRemove} unused design tokens`,
        details: unusedAnalysis.unused
          .filter(t => t.recommendation === 'remove')
          .slice(0, 5)
          .map(t => t.token),
        actionable: true,
        impact: 'Reduces bundle size and design system complexity'
      });
    }
    
    if (unusedAnalysis.summary.reviewNeeded > 0) {
      recommendations.push({
        type: 'review',
        priority: 'low',
        message: `Review ${unusedAnalysis.summary.reviewNeeded} tokens that may be used indirectly`,
        details: unusedAnalysis.unused
          .filter(t => t.recommendation === 'review')
          .slice(0, 5)
          .map(t => t.token),
        actionable: false,
        impact: 'Ensures no important tokens are accidentally removed'
      });
    }
    
    // System tokens notification
    if (unusedAnalysis.summary.keepForSystem > 0) {
      recommendations.push({
        type: 'info',
        priority: 'low',
        message: `${unusedAnalysis.summary.keepForSystem} system tokens are unused but should be kept`,
        details: unusedAnalysis.unused
          .filter(t => t.recommendation === 'keep')
          .slice(0, 3)
          .map(t => t.token),
        actionable: false,
        impact: 'These tokens provide system functionality'
      });
    }
    
    // Find frequently changing tokens
    const unstableTokens = changeFreq.filter(item => item.changeCount > 5);
    if (unstableTokens.length > 0) {
      recommendations.push({
        type: 'stability',
        priority: 'high',
        message: `${unstableTokens.length} tokens have high change frequency`,
        details: unstableTokens.slice(0, 3).map(t => t.token),
        actionable: true,
        impact: 'Frequent changes may indicate design inconsistency'
      });
    }
    
    // Check adoption rate
    const adoptionRate = this.calculateAdoptionRate();
    if (adoptionRate < 60) {
      recommendations.push({
        type: 'adoption',
        priority: 'medium',
        message: `Token adoption rate is ${adoptionRate.toFixed(1)}% - consider improving documentation`,
        details: [],
        actionable: true,
        impact: 'Better adoption leads to more consistent design'
      });
    }
    
    // Check for tokens with very low usage
    const lowUsageTokens = Object.entries(this.data.usage)
      .filter(([token, data]) => data.count === 1)
      .slice(0, 5);
      
    if (lowUsageTokens.length > 5) {
      recommendations.push({
        type: 'usage',
        priority: 'low',
        message: `${lowUsageTokens.length} tokens are used only once - consider if they're necessary`,
        details: lowUsageTokens.map(([token]) => token),
        actionable: false,
        impact: 'Reduces design system complexity'
      });
    }
    
    return recommendations;
  }

  calculateChangeFrequency() {
    const changes = {};
    
    this.data.tokenChanges.forEach(change => {
      const key = change.token;
      changes[key] = changes[key] || { token: key, changes: [] };
      changes[key].changes.push({
        type: change.type,
        timestamp: change.timestamp,
        author: change.author
      });
    });
    
    return Object.values(changes)
      .map(item => ({
        ...item,
        changeCount: item.changes.length,
        lastChanged: item.changes[item.changes.length - 1]?.timestamp
      }))
      .sort((a, b) => b.changeCount - a.changeCount);
  }

  calculateAdoption() {
    const monthlyAdoption = {};
    
    this.data.tokenChanges.forEach(change => {
      const month = change.timestamp.substring(0, 7); // YYYY-MM
      if (!monthlyAdoption[month]) {
        monthlyAdoption[month] = new Set();
      }
      monthlyAdoption[month].add(change.token);
    });
    
    return Object.entries(monthlyAdoption).map(([month, tokens]) => ({
      month,
      tokensModified: tokens.size,
      totalTokens: Object.keys(this.getAllDefinedTokens()).length,
      adoptionRate: (tokens.size / Object.keys(this.getAllDefinedTokens()).length) * 100
    }));
  }

  getCategoryBreakdown() {
    const breakdown = {};
    
    Object.entries(this.data.usage).forEach(([token, data]) => {
      const category = data.category || 'unknown';
      if (!breakdown[category]) {
        breakdown[category] = { count: 0, tokens: [] };
      }
      breakdown[category].count += data.count;
      breakdown[category].tokens.push(token);
    });
    
    return breakdown;
  }

  generateRecommendations() {
    const recommendations = [];
    const unusedTokens = this.getUnusedTokens();
    const changeFreq = this.calculateChangeFrequency();
    
    if (unusedTokens.summary.safeToRemove > 0) {
      recommendations.push({
        type: 'cleanup',
        priority: 'medium',
        message: `Consider removing ${unusedTokens.summary.safeToRemove} unused design tokens`,
        details: unusedTokens.unused
          .filter(t => t.recommendation === 'remove')
          .slice(0, 5)
          .map(t => t.token),
        actionable: true,
        impact: 'Reduces bundle size and design system complexity'
      });
    }
    
    if (unusedTokens.summary.reviewNeeded > 0) {
      recommendations.push({
        type: 'review',
        priority: 'low',
        message: `Review ${unusedTokens.summary.reviewNeeded} tokens that may be used indirectly`,
        details: unusedTokens.unused
          .filter(t => t.recommendation === 'review')
          .slice(0, 5)
          .map(t => t.token),
        actionable: false,
        impact: 'Ensures no important tokens are accidentally removed'
      });
    }
    
    // System tokens notification
    if (unusedTokens.summary.keepForSystem > 0) {
      recommendations.push({
        type: 'info',
        priority: 'low',
        message: `${unusedTokens.summary.keepForSystem} system tokens are unused but should be kept`,
        details: unusedTokens.unused
          .filter(t => t.recommendation === 'keep')
          .slice(0, 3)
          .map(t => t.token),
        actionable: false,
        impact: 'These tokens provide system functionality'
      });
    }
    
    // Find frequently changing tokens
    const unstableTokens = changeFreq.filter(item => item.changeCount > 5);
    if (unstableTokens.length > 0) {
      recommendations.push({
        type: 'stability',
        priority: 'high',
        message: `${unstableTokens.length} tokens have high change frequency`,
        details: unstableTokens.slice(0, 3).map(t => t.token),
        actionable: true,
        impact: 'Frequent changes may indicate design inconsistency'
      });
    }
    
    // Check adoption rate
    const adoptionRate = this.calculateAdoptionRate();
    if (adoptionRate < 60) {
      recommendations.push({
        type: 'adoption',
        priority: 'medium',
        message: `Token adoption rate is ${adoptionRate.toFixed(1)}% - consider improving documentation`,
        details: [],
        actionable: true,
        impact: 'Better adoption leads to more consistent design'
      });
    }
    
    // Check for tokens with very low usage
    const lowUsageTokens = Object.entries(this.data.usage)
      .filter(([token, data]) => data.count === 1)
      .slice(0, 5);
      
    if (lowUsageTokens.length > 5) {
      recommendations.push({
        type: 'usage',
        priority: 'low',
        message: `${lowUsageTokens.length} tokens are used only once - consider if they're necessary`,
        details: lowUsageTokens.map(([token]) => token),
        actionable: false,
        impact: 'Reduces design system complexity'
      });
    }
    
    return recommendations;
  }

  calculateTrends() {
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentChanges = this.data.tokenChanges.filter(
      change => new Date(change.timestamp) > last30Days
    );
    
    return {
      recentActivity: recentChanges.length,
      trendsUp: this.getTrendingTokens('up'),
      trendsDown: this.getTrendingTokens('down'),
      newTokens: recentChanges.filter(c => c.type === 'added').length,
      modifiedTokens: recentChanges.filter(c => c.type === 'modified').length
    };
  }

  // Utility methods
  getSourceFiles() {
    const extensions = ['.tsx', '.ts', '.jsx', '.js', '.css', '.scss'];
    const directories = ['src', 'components'];
    const files = [];
    
    directories.forEach(dir => {
      if (fs.existsSync(dir)) {
        this.walkDirectory(dir, files, extensions);
      }
    });
    
    return files;
  }

  walkDirectory(dir, files, extensions) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        this.walkDirectory(fullPath, files, extensions);
      } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    });
  }

  getAllDefinedTokens() {
    try {
      const tokens = JSON.parse(fs.readFileSync(this.tokensFile, 'utf8'));
      return this.flattenTokens(tokens);
    } catch {
      return {};
    }
  }

  flattenTokens(obj, prefix = '') {
    const flattened = {};
    
    Object.keys(obj).forEach(key => {
      if (key.startsWith('$')) return; // Skip metadata
      
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (value && typeof value === 'object' && value.value !== undefined) {
        flattened[newKey] = value;
      } else if (value && typeof value === 'object') {
        Object.assign(flattened, this.flattenTokens(value, newKey));
      }
    });
    
    return flattened;
  }

  normalizeTokenName(token, type) {
    // Normalize different token naming conventions
    switch (type) {
      case 'tailwind-text':
        return `colors.primary.${token}`;
      case 'tailwind-bg':
        return `colors.primary.${token}`;
      case 'tailwind-secondary':
        return `colors.secondary.${token}`;
      case 'typography-size':
        return `typography.fontSize.${token}`;
      case 'typography-weight':
        return `typography.fontWeight.${token}`;
      case 'border-radius':
        return `borderRadius.${token}`;
      default:
        return token;
    }
  }

  getTokenCategory(token) {
    if (token.includes('color') || token.includes('primary') || token.includes('secondary')) {
      return 'colors';
    }
    if (token.includes('spacing') || token.includes('space')) {
      return 'spacing';
    }
    if (token.includes('font') || token.includes('text')) {
      return 'typography';
    }
    if (token.includes('border') || token.includes('radius')) {
      return 'borderRadius';
    }
    if (token.includes('opacity')) {
      return 'opacity';
    }
    return 'other';
  }

  getGitAuthor() {
    try {
      return execSync('git config user.name', { encoding: 'utf8' }).trim();
    } catch {
      return 'unknown';
    }
  }

  getGitCommit() {
    try {
      return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
    } catch {
      return 'unknown';
    }
  }

  getProjectVersion() {
    try {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return pkg.version || '1.0.0';
    } catch {
      return '1.0.0';
    }
  }

  getReportPeriod() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return `${thirtyDaysAgo.toISOString().split('T')[0]} to ${now.toISOString().split('T')[0]}`;
  }

  getUniqueContributors() {
    const contributors = new Set();
    this.data.tokenChanges.forEach(change => {
      if (change.author && change.author !== 'unknown') {
        contributors.add(change.author);
      }
    });
    return Array.from(contributors);
  }

  calculateAdoptionRate() {
    const totalTokens = Object.keys(this.getAllDefinedTokens()).length;
    const usedTokens = Object.keys(this.data.usage).length;
    const unusedAnalysis = this.getUnusedTokens();
    
    // More nuanced adoption rate calculation
    const directlyUsed = usedTokens;
    const indirectlyUsed = unusedAnalysis.indirectlyUsed.length;
    const effectivelyUsed = directlyUsed + indirectlyUsed;
    
    return totalTokens > 0 ? (effectivelyUsed / totalTokens) * 100 : 0;
  }

  getTrendingTokens(direction) {
    // This would require historical data - placeholder for now
    return [];
  }

  save() {
    fs.writeFileSync(this.analyticsFile, JSON.stringify(this.data, null, 2));
  }

  // Export analytics data
  exportData(format = 'json') {
    const report = this.generateReport();
    const timestamp = new Date().toISOString().split('T')[0];
    
    switch (format) {
      case 'csv':
        return this.exportToCSV(report, timestamp);
      case 'html':
        return this.exportToHTML(report, timestamp);
      default:
        return this.exportToJSON(report, timestamp);
    }
  }

  exportToJSON(report, timestamp) {
    const filename = `reports/design-system-${timestamp}.json`;
    fs.mkdirSync('reports', { recursive: true });
    fs.writeFileSync(filename, JSON.stringify(report, null, 2));
    return filename;
  }

  exportToCSV(report, timestamp) {
    const filename = `reports/design-system-${timestamp}.csv`;
    fs.mkdirSync('reports', { recursive: true });
    
    const csvData = [
      ['Token', 'Usage Count', 'Files', 'Category', 'Type'],
      ...Object.entries(this.data.usage).map(([token, data]) => [
        token,
        data.count,
        data.files.length,
        data.category,
        data.type
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    fs.writeFileSync(filename, csvContent);
    return filename;
  }

  exportToHTML(report, timestamp) {
    const filename = `reports/design-system-${timestamp}.html`;
    fs.mkdirSync('reports', { recursive: true });
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Design System Analytics Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 40px; }
        .metric { background: #f5f5f5; padding: 20px; margin: 10px 0; border-radius: 8px; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #f2f2f2; }
    </style>
</head>
<body>
    <h1>🎨 Design System Analytics Report</h1>
    <p>Generated: ${report.metadata.generatedAt}</p>
    
    <div class="metric">
        <h2>Summary</h2>
        <p><strong>Total Tokens:</strong> ${report.summary.totalTokens}</p>
        <p><strong>Active Tokens:</strong> ${report.summary.activeTokens}</p>
        <p><strong>Adoption Rate:</strong> ${report.summary.adoptionRate.toFixed(1)}%</p>
        <p><strong>Total Changes:</strong> ${report.summary.totalChanges}</p>
    </div>
    
    ${report.recommendations.length > 0 ? `
    <div class="metric warning">
        <h2>Recommendations</h2>
        ${report.recommendations.map(rec => `<p>• ${rec.message}</p>`).join('')}
    </div>
    ` : ''}
    
    <h2>Most Used Tokens</h2>
    <table>
        <tr><th>Token</th><th>Usage Count</th><th>Files</th></tr>
        ${report.summary.mostUsedTokens.map(token => 
          `<tr><td>${token.token}</td><td>${token.count}</td><td>${token.files.length}</td></tr>`
        ).join('')}
    </table>
</body>
</html>`;
    
    fs.writeFileSync(filename, html);
    return filename;
  }
}

export default DesignSystemAnalytics; 