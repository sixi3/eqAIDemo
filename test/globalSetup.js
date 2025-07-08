import path from 'path';
import fs from 'fs-extra';
import os from 'os';

export default async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.DESIGN_TOKENS_TEST = 'true';
  
  // Create global test directory
  const testDir = path.join(os.tmpdir(), 'design-tokens-sync-test-global');
  await fs.ensureDir(testDir);
  
  // Store in global variable for cleanup
  global.__TEST_DIR__ = testDir;
  
  console.log('🧪 Test environment initialized');
}; 