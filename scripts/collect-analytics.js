#!/usr/bin/env node

import DesignSystemAnalytics from './design-analytics.js';

const analytics = new DesignSystemAnalytics();

async function main() {
  console.log('📊 Collecting Design System Analytics...\n');
  
  try {
    // Analyze current usage
    const usage = await analytics.analyzeUsage();
    
    console.log('✅ Analytics collection complete!\n');
    
    // Show quick summary
    const summary = {
      totalTokensInUse: Object.keys(usage).length,
      totalUsageCount: Object.values(usage).reduce((sum, token) => sum + token.count, 0),
      filesAnalyzed: new Set(Object.values(usage).flatMap(token => token.files)).size
    };
    
    console.log('📈 Quick Summary:');
    console.log(`   • ${summary.totalTokensInUse} tokens in use`);
    console.log(`   • ${summary.totalUsageCount} total token references`);
    console.log(`   • ${summary.filesAnalyzed} files analyzed`);
    
    // Show top 5 most used tokens
    const topTokens = Object.entries(usage)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 5);
      
    if (topTokens.length > 0) {
      console.log('\n🏆 Most Used Tokens:');
      topTokens.forEach(([token, data], index) => {
        console.log(`   ${index + 1}. ${token} (${data.count} uses)`);
      });
    }
    
    console.log('\n💡 Run `npm run analytics:report` to generate a full report');
    
  } catch (error) {
    console.error('❌ Error collecting analytics:', error.message);
    process.exit(1);
  }
}

main(); 