import type { Redis } from 'ioredis';

export class RedisHashRepository<T extends Record<string, unknown>> {
  private redis: Redis;
  private hashKey: string;

  constructor(hashKey: string, redis: Redis) {
    this.redis = redis;
    this.hashKey = hashKey;
  }

  async set(field: keyof T, value: T[keyof T]): Promise<number> {
    return await this.redis.hset(
      this.hashKey,
      field as string,
      this.serialize(value)
    );
  }

  async setAll(fields: Partial<T>): Promise<'OK'> {
    const serialized = Object.entries(fields).reduce(
      (acc, [field, value]) =>
        Object.assign(acc, {
          [field]: this.serialize(value),
        }),
      {}
    );
    return this.redis.hmset(this.hashKey, serialized);
  }

  async get<K extends keyof T>(field: K): Promise<T[K] | null> {
    const value = await this.redis.hget(this.hashKey, field as string);
    return value ? (this.deserialize(value) as T[K]) : null;
  }

  async getAll(): Promise<T | null> {
    const fields = await this.redis.hgetall(this.hashKey);
    if (!Object.keys(fields).length) return null;

    return Object.entries(fields).reduce(
      (acc, [field, value]) =>
        Object.assign(acc, {
          [field]: this.deserialize(value),
        }),
      {} as T
    );
  }

  async getMany<K extends keyof T>(fields: K[]): Promise<(T[K] | null)[]> {
    const values = await this.redis.hmget(
      this.hashKey,
      ...fields.map((f) => f as string)
    );
    return values.map((value) =>
      value ? (this.deserialize(value) as T[K]) : null
    );
  }

  async del(...fields: Array<keyof T>): Promise<number> {
    return this.redis.hdel(this.hashKey, ...fields.map((f) => f as string));
  }

  async exists(field: keyof T): Promise<boolean> {
    return (await this.redis.hexists(this.hashKey, field as string)) === 1;
  }

  async keys(): Promise<Array<keyof T>> {
    return await this.redis.hkeys(this.hashKey);
  }

  async values(): Promise<T[keyof T][]> {
    const values = await this.redis.hvals(this.hashKey);
    return values.map((value) => this.deserialize(value) as T[keyof T]);
  }

  async len(): Promise<number> {
    return await this.redis.hlen(this.hashKey);
  }

  async incrBy(field: keyof T, increment = 1): Promise<number> {
    return await this.redis.hincrby(this.hashKey, field as string, increment);
  }

  async incrByFloat(field: keyof T, increment: number): Promise<number> {
    const result = await this.redis.hincrbyfloat(
      this.hashKey,
      field as string,
      increment
    );
    return Number.parseFloat(result);
  }

  async scan(
    match = '*',
    count = 10
  ): Promise<{ cursor: string; items: Partial<T> }> {
    const [cursor, result] = await this.redis.hscan(
      this.hashKey,
      '0',
      'MATCH',
      match,
      'COUNT',
      count
    );

    const items: Record<string, unknown> = {};
    for (let i = 0; i < result.length; i += 2) {
      items[result[i] as string] = this.deserialize(result[i + 1] as string);
    }

    return { cursor, items: items as Partial<T> };
  }

  private serialize(value: unknown): string {
    if (value === null) return 'null';
    if (typeof value === 'boolean') return value ? '1' : '0';
    return JSON.stringify(value);
  }

  private deserialize(value: string): unknown {
    if (value === 'null') return null;
    if (value === '1' || value === '0') return value === '1';

    try {
      return JSON.parse(value);
    } catch {
      if (!Number.isNaN(Number(value))) return Number(value);
      return value;
    }
  }
}
