import 'server-only';

import { Redis } from 'ioredis';

const DEFAULT_REDIS_URL = 'redis://localhost:6379';
const HEARTBEAT_INTERVAL_MS = 30000;

let redisInstance: Redis | null = null;
let heartbeatInterval: NodeJS.Timeout | null = null;

const startHeartbeat = (): void => {
  if (heartbeatInterval) return;

  heartbeatInterval = setInterval(async () => {
    try {
      await redisInstance?.ping();
    } catch (error) {
      console.error('Redis heartbeat failed:', error);
    }
  }, HEARTBEAT_INTERVAL_MS);

  process.on('beforeExit', () => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }
    if (redisInstance) {
      redisInstance.disconnect();
      redisInstance = null;
    }
  });
};

export const RedisClient = (() => {
  if (redisInstance) return redisInstance;

  redisInstance = new Redis(process.env.REDIS_URL || DEFAULT_REDIS_URL, {
    retryStrategy: (times) => Math.min(times * 50, 2000),
    enableReadyCheck: true,
    maxRetriesPerRequest: 3,
  });

  redisInstance
    .on('error', (err) => console.error('Redis Client Error:', err))
    .on('connect', () => console.log('Redis Client Connected'))
    .on('close', () => console.log('Redis Client Closed'))
    .on('ready', () => startHeartbeat());

  return redisInstance;
})();
