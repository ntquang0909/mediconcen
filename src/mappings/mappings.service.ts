import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mapping } from './entities/mapping.entity';
import Redis from 'ioredis';
import Redlock from 'redlock';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MappingsService {
  private redisClient: Redis;
  private redlock: Redlock;

  constructor(
    @InjectRepository(Mapping)
    private mappingRepository: Repository<Mapping>,
  ) {
    // Initialize Redis and Redlock for distributed locking
    this.redisClient = new Redis({ host: 'localhost', port: 6379 });
    this.redlock = new Redlock([this.redisClient], {
      driftFactor: 0.01,
      retryCount: 10,
      retryDelay: 200,
      retryJitter: 200,
    });
  }

  async processMapping(id1: string, id2: string): Promise<{ userId: string }> {
    const cacheKey = `mapping:${id1}:${id2}`;
    const lockKey = `lock:${cacheKey}`;

    // 1. Fast Path: Check Redis Cache
    const cachedUserId = await this.redisClient.get(cacheKey);
    if (cachedUserId) {
      return { userId: cachedUserId };
    }

    // 2. Concurrency Control: Acquire Distributed Lock
    // Prevents multiple simultaneous requests from hitting the DB and trying to insert
    let lock;
    try {
      lock = await this.redlock.acquire([lockKey], 5000); // Lock for 5 seconds

      // 3. Double-Check DB inside the lock (Another thread might have just inserted it)
      let mapping = await this.mappingRepository.findOne({
        where: { id1, id2 },
      });

      if (mapping) {
        await this.redisClient.set(cacheKey, mapping.userId, 'EX', 3600); // Cache for 1 hour
        return { userId: mapping.userId };
      }

      // 4. Generate UUIDv4 and Insert
      const newUserId = uuidv4();
      const newMapping = this.mappingRepository.create({
        id1,
        id2,
        userId: newUserId,
      });

      try {
        await this.mappingRepository.save(newMapping);
      } catch (error) {
        // Ultimate Fallback: Handle MySQL Unique Constraint Violation (Error 1062)
        // Just in case Redis goes down or lock expires prematurely
        if (error.code === 'ER_DUP_ENTRY') {
          mapping = await this.mappingRepository.findOne({
            where: { id1, id2 },
          });
          return { userId: mapping!.userId };
        }
        throw new InternalServerErrorException('Database error occurred');
      }

      // 5. Cache the newly created record
      await this.redisClient.set(cacheKey, newUserId, 'EX', 3600);

      return { userId: newUserId };
    } finally {
      // 6. Always release the lock
      if (lock) {
        await lock
          .release()
          .catch((err) => console.error('Failed to release lock', err));
      }
    }
  }
}
