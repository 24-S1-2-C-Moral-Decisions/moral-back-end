import { Injectable, NestMiddleware, BadRequestException, } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
    private rateLimiter: RateLimiterMemory;

    constructor() {
        this.rateLimiter = new RateLimiterMemory({
            points: 5, // 5 access per day
            duration: 24 * 60 * 60,
        });
    }

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            await this.rateLimiter.consume(req.ip);
            next();
        } catch (rejRes) {
            throw new BadRequestException('Too many requests');
        }
    }
}
