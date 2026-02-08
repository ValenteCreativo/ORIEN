// Provider Node Configuration
import { ProviderConfig } from './types.js';

export const config: ProviderConfig = {
  providerId: process.env.PROVIDER_ID || 'provider-demo',
  name: process.env.PROVIDER_NAME || 'Demo Provider Node',
  coordinatorUrl: process.env.COORDINATOR_URL || 'http://localhost:3000',
  apiKey: process.env.PROVIDER_API_KEY || 'demo-key',
  port: parseInt(process.env.PORT || '4000', 10),
  workspaceRoot: process.env.WORKSPACE_ROOT || '/tmp/orien-workspaces',
  
  // Tool whitelist - only these can be executed
  tools: [
    {
      id: 'echo',
      name: 'Echo',
      description: 'Simple echo command for testing',
      command: 'echo',
      args: [
        {
          name: 'message',
          type: 'string',
          required: true,
          description: 'Message to echo',
        },
      ],
      maxDurationSeconds: 5,
    },
    {
      id: 'node_script',
      name: 'Run Node.js Script',
      description: 'Execute a Node.js script in the workspace',
      command: 'node',
      args: [
        {
          name: 'script',
          type: 'file',
          required: true,
          description: 'Path to the Node.js script (relative to workspace)',
        },
      ],
      maxDurationSeconds: 60,
      resourceLimits: {
        maxCpu: 50,
        maxMemory: 512,
      },
    },
    {
      id: 'python_script',
      name: 'Run Python Script',
      description: 'Execute a Python script in the workspace',
      command: 'python3',
      args: [
        {
          name: 'script',
          type: 'file',
          required: true,
          description: 'Path to the Python script (relative to workspace)',
        },
      ],
      maxDurationSeconds: 120,
      resourceLimits: {
        maxCpu: 75,
        maxMemory: 1024,
      },
    },
    {
      id: 'build_npm',
      name: 'NPM Build',
      description: 'Run npm build in the workspace',
      command: 'npm',
      args: [
        {
          name: 'command',
          type: 'string',
          required: false,
          description: 'NPM command (default: build)',
          validation: {
            allowedValues: ['build', 'test', 'install'],
          },
        },
      ],
      maxDurationSeconds: 300,
      resourceLimits: {
        maxCpu: 100,
        maxMemory: 2048,
      },
    },
  ],
};
