#!/usr/bin/env node

import DesignSystemAnalytics from './design-analytics.js';

const analytics = new DesignSystemAnalytics();

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    format: args.find(arg => arg.startsWith('--format='))?.split('=')[1] || 'json',
    output: args.find(arg => arg.startsWith('--output='))?.split('=')[1],
    console: args.includes('--console'),
    help: args.includes('--help') || args.includes('-h')
  };
}

function showHelp() {
  console.log(`
📊 Design System Analytics Report Generator

Usage:
  node scripts/generate-report.js [options]

Options:
  --format=FORMAT     Output format: json, csv, html (default: json)
  --output=FILE       Output file path (optional)
  --console          Also display summary in console
  --help, -h         Show this help message

Examples:
  node scripts/generate-report.js --format=html --console
  node scripts/generate-report.js --format=csv --output=reports/tokens.csv
  node scripts/generate-report.js --console
`);
}

async function main() {
  const options = parseArgs();
  
  if (options.help) {
    showHelp();
    return;
  }
  
  console.log('📊 Generating Design System Analytics Report...\n');
  
  try {
    // Ensure we have fresh usage data
    await analytics.analyzeUsage();
    
    // Generate comprehensive report
    const report = analytics.generateReport();
    
    // Export to specified format
    let outputFile;
    if (options.format) {
      outputFile = analytics.exportData(options.format);
      console.log(`✅ Report exported to: ${outputFile}`);
    }
    
    // Copy to custom output location if specified
    if (options.output && outputFile) {
      const fs = await import('fs');
      const path = await import('path');
      
      // Ensure output directory exists
      const outputDir = path.dirname(options.output);
      fs.mkdirSync(outputDir, { recursive: true });
      
      // Copy file
      fs.copyFileSync(outputFile, options.output);
      console.log(`📋 Report copied to: ${options.output}`);
    }
    
    // Show console summary if requested
    if (options.console) {
      displayConsoleSummary(report);
    }
    
  } catch (error) {
    console.error('❌ Error generating report:', error.message);
    process.exit(1);
  }
}

function displayConsoleSummary(report) {
  console.log('\n' + '='.repeat(60));
  console.log('🎨 DESIGN SYSTEM ANALYTICS REPORT');
  console.log('='.repeat(60));
  
  console.log(`\n📅 Generated: ${new Date(report.metadata.generatedAt).toLocaleString()}`);
  console.log(`📊 Period: ${report.metadata.period}`);
  console.log(`🔖 Version: ${report.metadata.version}`);
  
  console.log('\n📈 SUMMARY');
  console.log('─'.repeat(30));
  console.log(`Total Tokens: ${report.summary.totalTokens}`);
  console.log(`Active Tokens: ${report.summary.activeTokens}`);
  console.log(`Adoption Rate: ${report.summary.adoptionRate.toFixed(1)}%`);
  console.log(`Total Changes: ${report.summary.totalChanges}`);
  console.log(`Contributors: ${report.summary.uniqueContributors}`);
  
  if (report.summary.unusedTokens.length > 0) {
    console.log(`\n⚠️  Unused Tokens: ${report.summary.unusedTokens.length}`);
    console.log('First 5:', report.summary.unusedTokens.slice(0, 5).join(', '));
  }
  
  console.log('\n🏆 MOST USED TOKENS');
  console.log('─'.repeat(30));
  report.summary.mostUsedTokens.slice(0, 8).forEach((token, index) => {
    console.log(`${(index + 1).toString().padStart(2)}. ${token.token.padEnd(25)} ${token.count.toString().padStart(3)} uses`);
  });
  
  if (report.categoryBreakdown && Object.keys(report.categoryBreakdown).length > 0) {
    console.log('\n📂 CATEGORY BREAKDOWN');
    console.log('─'.repeat(30));
    Object.entries(report.categoryBreakdown).forEach(([category, data]) => {
      console.log(`${category.padEnd(15)} ${data.count.toString().padStart(4)} uses (${data.tokens.length} tokens)`);
    });
  }
  
  if (report.changeFrequency && report.changeFrequency.length > 0) {
    console.log('\n🔄 MOST CHANGED TOKENS');
    console.log('─'.repeat(30));
    report.changeFrequency.slice(0, 5).forEach((item, index) => {
      console.log(`${(index + 1).toString().padStart(2)}. ${item.token.padEnd(25)} ${item.changeCount.toString().padStart(2)} changes`);
    });
  }
  
  if (report.recommendations && report.recommendations.length > 0) {
    console.log('\n💡 RECOMMENDATIONS');
    console.log('─'.repeat(30));
    report.recommendations.forEach((rec, index) => {
      const priorityIcon = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
      console.log(`${priorityIcon} ${rec.message}`);
      if (rec.details && rec.details.length > 0) {
        console.log(`   Details: ${rec.details.slice(0, 3).join(', ')}`);
      }
    });
  }
  
  if (report.trends) {
    console.log('\n📊 RECENT TRENDS (30 days)');
    console.log('─'.repeat(30));
    console.log(`Recent Activity: ${report.trends.recentActivity} changes`);
    console.log(`New Tokens: ${report.trends.newTokens}`);
    console.log(`Modified Tokens: ${report.trends.modifiedTokens}`);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📋 For detailed analysis, check the exported report file');
  console.log('='.repeat(60));
}

main(); 