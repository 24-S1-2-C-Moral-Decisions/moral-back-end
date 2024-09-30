import { Injectable, NestMiddleware, BadRequestException, Logger, } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
    private rateLimiter: RateLimiterMemory;

    constructor() {
        this.rateLimiter = new RateLimiterMemory({
            points: 7, // 5 access per day
            duration: 24 * 60 * 60,

        });
    }

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            await this.rateLimiter.consume(req.ip);
            next();
        } catch (rejRes) {
            Logger.log(`Current IP ${req.ip} has sumbitted too many requests, alowed: ${this.rateLimiter.points}, request: ${rejRes.consumedPoints}`, 'RateLimiterMiddleware');
            Logger.warn(rejRes, 'RateLimiterMiddleware');
            throw new BadRequestException(`Current IP ${req.ip} has sumbitted too many requests, alowed: ${this.rateLimiter.points}, request: ${rejRes.consumedPoints}`);
        }
    }
}
