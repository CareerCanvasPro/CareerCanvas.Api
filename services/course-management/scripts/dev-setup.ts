import { execSync } from 'child_process';
import * as dotenv from 'dotenv';

console.log('🚀 Setting up development environment...');

try {
  // Load dev environment
  dotenv.config({ path: '.env.development' });

  // Install dependencies
  execSync('npm install', { stdio: 'inherit' });

  // Deploy to dev stage
  execSync('serverless deploy --stage dev', { stdio: 'inherit' });

  console.log('✅ Development environment is ready!');
  console.log('\nAPI Endpoints:');
  execSync('serverless info --stage dev', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Setup failed:', error);
  process.exit(1);
}