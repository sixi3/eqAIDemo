import fs from 'fs-extra';

export default async () => {
  // Clean up global test directory
  if (global.__TEST_DIR__) {
    await fs.remove(global.__TEST_DIR__);
  }
  
  console.log('🧹 Test environment cleaned up');
}; 