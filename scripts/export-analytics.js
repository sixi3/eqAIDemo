#!/usr/bin/env node

import DesignSystemAnalytics from './design-analytics.js';
import fs from 'fs';
import path from 'path';

const analytics = new DesignSystemAnalytics();

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    format: 'json',
    output: null,
    help: false,
    data: 'all' // all, usage, changes, recommendations
  };

  args.forEach(arg => {
    if (arg.startsWith('--format=')) {
      options.format = arg.split('=')[1];
    } else if (arg.startsWith('--output=')) {
      options.output = arg.split('=')[1];
    } else if (arg.startsWith('--data=')) {
      options.data = arg.split('=')[1];
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    }
  });

  return options;
}

function showHelp() {
  console.log(`
📊 Analytics Data Export Tool

Usage:
  node scripts/export-analytics.js [options]

Options:
  --format=FORMAT    Export format: json, csv, html, txt (default: json)
  --output=FILE      Output file path (default: auto-generated)
  --data=TYPE        Data type: all, usage, changes, recommendations (default: all)
  --help, -h         Show this help message

Formats:
  json              Full analytics data as JSON
  csv               Tabular data suitable for spreadsheets
  html              Visual report with styling
  txt               Plain text summary

Data Types:
  all               Complete analytics report
  usage             Token usage statistics only
  changes           Change history only
  recommendations   Recommendations only

Examples:
  node scripts/export-analytics.js --format=csv --data=usage
  node scripts/export-analytics.js --format=html --output=report.html
  node scripts/export-analytics.js --data=recommendations --format=txt
`);
}

async function exportSpecificData(report, dataType) {
  switch (dataType) {
    case 'usage':
      return {
        metadata: report.metadata,
        usage: report.summary.mostUsedTokens,
        categoryBreakdown: report.categoryBreakdown,
        unusedTokens: report.summary.unusedTokens
      };
    
    case 'changes':
      return {
        metadata: report.metadata,
        changeFrequency: report.changeFrequency,
        trends: report.trends,
        totalChanges: report.summary.totalChanges
      };
    
    case 'recommendations':
      return {
        metadata: report.metadata,
        recommendations: report.recommendations,
        adoptionRate: report.summary.adoptionRate,
        unusedTokens: report.summary.unusedTokens
      };
    
    default:
      return report;
  }
}

function exportAsText(data, dataType) {
  let text = `Design System Analytics Export\n`;
  text += `Generated: ${new Date(data.metadata.generatedAt).toLocaleString()}\n`;
  text += `Period: ${data.metadata.period}\n`;
  text += `Version: ${data.metadata.version}\n\n`;

  if (dataType === 'usage' || dataType === 'all') {
    text += `=== TOKEN USAGE ===\n`;
    if (data.usage) {
      data.usage.forEach((token, index) => {
        text += `${index + 1}. ${token.token}: ${token.count} uses (${token.files.length} files)\n`;
      });
    }
    text += `\n`;

    if (data.categoryBreakdown) {
      text += `=== CATEGORY BREAKDOWN ===\n`;
      Object.entries(data.categoryBreakdown).forEach(([category, info]) => {
        text += `${category}: ${info.count} uses (${info.tokens.length} tokens)\n`;
      });
    }
    text += `\n`;
  }

  if (dataType === 'changes' || dataType === 'all') {
    text += `=== CHANGE FREQUENCY ===\n`;
    if (data.changeFrequency) {
      data.changeFrequency.slice(0, 10).forEach((item, index) => {
        text += `${index + 1}. ${item.token}: ${item.changeCount} changes\n`;
      });
    }
    text += `\n`;
  }

  if (dataType === 'recommendations' || dataType === 'all') {
    text += `=== RECOMMENDATIONS ===\n`;
    if (data.recommendations) {
      data.recommendations.forEach((rec, index) => {
        const priority = rec.priority === 'high' ? '[HIGH]' : 
                        rec.priority === 'medium' ? '[MED]' : '[LOW]';
        text += `${index + 1}. ${priority} ${rec.message}\n`;
        if (rec.details && rec.details.length > 0) {
          text += `   Details: ${rec.details.join(', ')}\n`;
        }
      });
    }
    text += `\n`;
  }

  if (data.unusedTokens && data.unusedTokens.length > 0) {
    text += `=== UNUSED TOKENS (${data.unusedTokens.length}) ===\n`;
    data.unusedTokens.forEach(token => {
      text += `- ${token}\n`;
    });
  }

  return text;
}

function exportAsCSV(data, dataType) {
  let csv = '';

  if (dataType === 'usage' || dataType === 'all') {
    csv += 'Token,Usage Count,Files Count,Category,Type\n';
    if (data.usage) {
      data.usage.forEach(token => {
        csv += `"${token.token}",${token.count},${token.files.length},"${token.category}","${token.type}"\n`;
      });
    }
    csv += '\n';
  }

  if (dataType === 'changes' || dataType === 'all') {
    if (csv) csv += '\n';
    csv += 'Token,Change Count,Last Changed\n';
    if (data.changeFrequency) {
      data.changeFrequency.forEach(item => {
        csv += `"${item.token}",${item.changeCount},"${item.lastChanged}"\n`;
      });
    }
    csv += '\n';
  }

  if (dataType === 'recommendations' || dataType === 'all') {
    if (csv) csv += '\n';
    csv += 'Priority,Type,Message,Details\n';
    if (data.recommendations) {
      data.recommendations.forEach(rec => {
        csv += `"${rec.priority}","${rec.type}","${rec.message}","${rec.details.join('; ')}"\n`;
      });
    }
  }

  return csv;
}

async function main() {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    return;
  }

  console.log('📊 Exporting analytics data...');

  try {
    // Ensure we have fresh data
    await analytics.analyzeUsage();
    
    // Generate report
    const fullReport = analytics.generateReport();
    const data = await exportSpecificData(fullReport, options.data);

    let content;
    let defaultExtension;

    switch (options.format.toLowerCase()) {
      case 'json':
        content = JSON.stringify(data, null, 2);
        defaultExtension = 'json';
        break;
      
      case 'csv':
        content = exportAsCSV(data, options.data);
        defaultExtension = 'csv';
        break;
      
      case 'txt':
        content = exportAsText(data, options.data);
        defaultExtension = 'txt';
        break;
      
      case 'html':
        content = analytics.exportToHTML(fullReport, new Date().toISOString().split('T')[0]);
        defaultExtension = 'html';
        // For HTML, we already have the file, just copy it
        if (options.output) {
          fs.copyFileSync(content, options.output);
          console.log(`✅ HTML report exported to: ${options.output}`);
          return;
        } else {
          console.log(`✅ HTML report generated: ${content}`);
          return;
        }
      
      default:
        throw new Error(`Unsupported format: ${options.format}`);
    }

    // Determine output path
    const outputPath = options.output || 
      `analytics-${options.data}-${new Date().toISOString().split('T')[0]}.${defaultExtension}`;

    // Ensure output directory exists
    const outputDir = path.dirname(path.resolve(outputPath));
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write file
    fs.writeFileSync(outputPath, content, 'utf8');

    console.log(`✅ Analytics data exported to: ${outputPath}`);
    console.log(`📊 Format: ${options.format.toUpperCase()}`);
    console.log(`📁 Data type: ${options.data}`);
    console.log(`📏 File size: ${(content.length / 1024).toFixed(1)} KB`);

    // Show quick summary
    if (options.format !== 'html') {
      const lines = content.split('\n').length;
      console.log(`📄 Lines: ${lines}`);
    }

  } catch (error) {
    console.error('❌ Export failed:', error.message);
    process.exit(1);
  }
}

main(); 