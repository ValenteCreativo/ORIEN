// Execution Engine - runs tools in isolated workspaces
import { spawn } from 'child_process';
import { mkdir, rm } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { ExecutionRequest, ExecutionResponse, ExecutionStatus, ToolDefinition } from './types.js';
import { config } from './config.js';

interface ActiveExecution {
  id: string;
  request: ExecutionRequest;
  tool: ToolDefinition;
  workspacePath: string;
  status: ExecutionStatus;
  startedAt: Date;
  completedAt?: Date;
  output: string;
  error: string;
  exitCode?: number;
}

class Executor {
  private executions = new Map<string, ActiveExecution>();
  private totalExecutions = 0;

  async execute(request: ExecutionRequest): Promise<ExecutionResponse> {
    const tool = config.tools.find(t => t.id === request.toolId);
    if (!tool) {
      throw new Error(`Tool '${request.toolId}' not found in whitelist`);
    }

    // Validate required args
    for (const arg of tool.args) {
      if (arg.required && !(arg.name in request.args)) {
        throw new Error(`Missing required argument: ${arg.name}`);
      }
    }

    // Create execution
    const executionId = `exec-${randomUUID()}`;
    const workspacePath = join(config.workspaceRoot, request.sessionId);

    // Ensure workspace exists
    await mkdir(workspacePath, { recursive: true });

    const execution: ActiveExecution = {
      id: executionId,
      request,
      tool,
      workspacePath,
      status: 'pending',
      startedAt: new Date(),
      output: '',
      error: '',
    };

    this.executions.set(executionId, execution);
    this.totalExecutions++;

    // Execute in background
    this.runExecution(execution).catch(err => {
      console.error(`Execution ${executionId} failed:`, err);
      execution.status = 'failed';
      execution.error = err.message;
      execution.completedAt = new Date();
    });

    return {
      executionId,
      status: 'pending',
      startedAt: execution.startedAt.toISOString(),
    };
  }

  private async runExecution(execution: ActiveExecution): Promise<void> {
    execution.status = 'running';

    const { tool, request, workspacePath } = execution;

    // Build command args
    const commandArgs: string[] = [];
    for (const argDef of tool.args) {
      const value = request.args[argDef.name];
      if (value !== undefined) {
        if (argDef.type === 'file') {
          // Resolve file path relative to workspace
          commandArgs.push(join(workspacePath, String(value)));
        } else {
          commandArgs.push(String(value));
        }
      }
    }

    return new Promise((resolve, reject) => {
      const child = spawn(tool.command, commandArgs, {
        cwd: workspacePath,
        timeout: tool.maxDurationSeconds * 1000,
        env: {
          ...process.env,
          // Limit environment exposure
          PATH: process.env.PATH,
          HOME: workspacePath,
        },
      });

      child.stdout.on('data', (data) => {
        execution.output += data.toString();
      });

      child.stderr.on('data', (data) => {
        execution.error += data.toString();
      });

      child.on('close', (code) => {
        execution.exitCode = code ?? undefined;
        execution.status = code === 0 ? 'completed' : 'failed';
        execution.completedAt = new Date();
        resolve();
      });

      child.on('error', (err) => {
        execution.error = err.message;
        execution.status = 'failed';
        execution.completedAt = new Date();
        reject(err);
      });

      // Handle timeout
      setTimeout(() => {
        if (execution.status === 'running') {
          child.kill('SIGTERM');
          execution.status = 'timeout';
          execution.error = `Execution exceeded time limit of ${tool.maxDurationSeconds}s`;
          execution.completedAt = new Date();
        }
      }, tool.maxDurationSeconds * 1000);
    });
  }

  getExecution(executionId: string): ActiveExecution | undefined {
    return this.executions.get(executionId);
  }

  getActiveExecutions(): number {
    return Array.from(this.executions.values()).filter(
      e => e.status === 'running' || e.status === 'pending'
    ).length;
  }

  getTotalExecutions(): number {
    return this.totalExecutions;
  }

  async cleanupSession(sessionId: string): Promise<void> {
    const workspacePath = join(config.workspaceRoot, sessionId);
    await rm(workspacePath, { recursive: true, force: true });
    console.log(`Cleaned up workspace for session ${sessionId}`);
  }
}

export const executor = new Executor();
