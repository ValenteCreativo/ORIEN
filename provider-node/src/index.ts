// Provider Node Entry Point
import { fastify } from './server.js';
import { config } from './config.js';
import { mkdir } from 'fs/promises';

async function start() {
  try {
    // Ensure workspace root exists
    await mkdir(config.workspaceRoot, { recursive: true });

    // Start server
    await fastify.listen({ port: config.port, host: '0.0.0.0' });
    
    console.log(`
╔════════════════════════════════════════════════╗
║  ORIEN Provider Node                           ║
╚════════════════════════════════════════════════╝

🆔  Provider ID:   ${config.providerId}
📦  Name:          ${config.name}
🌐  Port:          ${config.port}
📁  Workspace:     ${config.workspaceRoot}
🛠️   Tools:         ${config.tools.length} available

Server running at http://localhost:${config.port}
    `);

    // Register with coordinator (TODO: implement when coordinator is ready)
    // await registerWithCoordinator();

  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await fastify.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down gracefully...');
  await fastify.close();
  process.exit(0);
});

start();
