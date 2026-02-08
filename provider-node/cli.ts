#!/usr/bin/env node
// ORIEN Provider CLI - Quick setup for Mac Mini / compute providers

import { program } from 'commander';
import { execSync } from 'child_process';
import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

program
  .name('orien-provider')
  .description('ORIEN Provider Node CLI - Setup your compute in minutes')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize provider node')
  .option('-n, --name <name>', 'Provider name')
  .option('-p, --port <port>', 'Server port', '4000')
  .option('-c, --coordinator <url>', 'ORIEN Coordinator URL', 'https://orien.vercel.app')
  .action((options) => {
    console.log('🚀 Initializing ORIEN Provider Node...\n');

    const config = {
      providerId: `provider-${Date.now()}`,
      name: options.name || 'My Provider',
      port: parseInt(options.port, 10),
      coordinatorUrl: options.coordinator,
      workspaceRoot: '/tmp/orien-workspaces',
    };

    // Create .env file
    const envContent = `
PROVIDER_ID=${config.providerId}
PROVIDER_NAME="${config.name}"
PORT=${config.port}
COORDINATOR_URL=${config.coordinatorUrl}
WORKSPACE_ROOT=${config.workspaceRoot}
`;

    writeFileSync('.env', envContent.trim());
    console.log('✅ Created .env file');

    // Install dependencies if needed
    if (!existsSync('node_modules')) {
      console.log('📦 Installing dependencies...');
      execSync('pnpm install', { stdio: 'inherit' });
    }

    console.log('\n✨ Provider node initialized!');
    console.log(`\n📋 Next steps:`);
    console.log(`   1. Edit .env to configure tools`);
    console.log(`   2. Run: pnpm dev`);
    console.log(`   3. Register at: ${config.coordinatorUrl}/register\n`);
  });

program
  .command('start')
  .description('Start provider node')
  .option('-d, --detach', 'Run in background')
  .action((options) => {
    console.log('▶️  Starting ORIEN Provider Node...\n');
    
    if (options.detach) {
      // Background mode (production)
      execSync('pnpm start &', { stdio: 'inherit' });
      console.log('✅ Provider node running in background');
    } else {
      // Foreground mode (development)
      execSync('pnpm dev', { stdio: 'inherit' });
    }
  });

program
  .command('status')
  .description('Check provider node status')
  .action(async () => {
    console.log('🔍 Checking provider node status...\n');
    
    try {
      const response = await fetch('http://localhost:4000/health');
      const data = await response.json();
      
      console.log('✅ Provider node is running');
      console.log(`   Uptime: ${Math.floor(data.uptime)}s`);
      console.log(`   Active executions: ${data.activeExecutions}`);
      console.log(`   Total executions: ${data.totalExecutions}\n`);
    } catch (error) {
      console.log('❌ Provider node is not running\n');
      console.log('   Run: orien-provider start\n');
    }
  });

program
  .command('tools')
  .description('List available tools')
  .action(async () => {
    console.log('🛠️  Available tools:\n');
    
    try {
      const response = await fetch('http://localhost:4000/tools');
      const data = await response.json();
      
      data.tools.forEach((tool: any) => {
        console.log(`   ${tool.name}`);
        console.log(`   ID: ${tool.id}`);
        console.log(`   Max duration: ${tool.maxDurationSeconds}s`);
        console.log(`   Description: ${tool.description}\n`);
      });
    } catch (error) {
      console.log('   ❌ Could not fetch tools (is node running?)\n');
    }
  });

program.parse();
