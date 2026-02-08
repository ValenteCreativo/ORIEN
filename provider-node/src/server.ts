// Provider Node Server - Fastify API
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { z } from 'zod';
import { executor } from './executor.js';
import { config } from './config.js';
import { ExecutionRequest, HealthResponse } from './types.js';

const fastify = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
    },
  },
});

// Enable CORS
await fastify.register(cors, {
  origin: true, // Allow all origins in dev (restrict in production)
});

// ============ HEALTH CHECK ============

fastify.get('/health', async () => {
  const response: HealthResponse = {
    status: 'ok',
    uptime: process.uptime(),
    activeExecutions: executor.getActiveExecutions(),
    totalExecutions: executor.getTotalExecutions(),
    version: '0.1.0',
  };
  return response;
});

// ============ TOOLS ============

fastify.get('/tools', async () => {
  return {
    tools: config.tools.map(tool => ({
      id: tool.id,
      name: tool.name,
      description: tool.description,
      args: tool.args,
      maxDurationSeconds: tool.maxDurationSeconds,
      resourceLimits: tool.resourceLimits,
    })),
  };
});

// ============ EXECUTION ============

const executeRequestSchema = z.object({
  sessionId: z.string().min(1),
  toolId: z.string().min(1),
  args: z.record(z.unknown()),
});

fastify.post<{ Body: ExecutionRequest }>('/execute', async (request, reply) => {
  try {
    const body = executeRequestSchema.parse(request.body);
    const response = await executor.execute(body);
    return reply.code(202).send(response);
  } catch (error) {
    return reply.code(400).send({
      error: error instanceof Error ? error.message : 'Invalid request',
    });
  }
});

// ============ EXECUTION STATUS ============

fastify.get<{ Params: { executionId: string } }>(
  '/executions/:executionId',
  async (request, reply) => {
    const { executionId } = request.params;
    const execution = executor.getExecution(executionId);

    if (!execution) {
      return reply.code(404).send({ error: 'Execution not found' });
    }

    return {
      executionId: execution.id,
      status: execution.status,
      startedAt: execution.startedAt.toISOString(),
      completedAt: execution.completedAt?.toISOString(),
      effectiveDurationMs: execution.completedAt
        ? execution.completedAt.getTime() - execution.startedAt.getTime()
        : undefined,
      output: execution.output,
      error: execution.error || undefined,
      exitCode: execution.exitCode,
    };
  }
);

// ============ SESSION CLEANUP ============

fastify.delete<{ Params: { sessionId: string } }>(
  '/sessions/:sessionId/workspace',
  async (request, reply) => {
    const { sessionId } = request.params;
    try {
      await executor.cleanupSession(sessionId);
      return { success: true, message: 'Workspace cleaned up' };
    } catch (error) {
      return reply.code(500).send({
        error: error instanceof Error ? error.message : 'Cleanup failed',
      });
    }
  }
);

// ============ ERROR HANDLER ============

fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  reply.code(500).send({
    error: 'Internal server error',
    message: error instanceof Error ? error.message : 'Unknown error',
  });
});

export { fastify };
