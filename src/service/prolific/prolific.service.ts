import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Prolific } from '../../entity/Prolific';
import { Repository } from 'typeorm';

@Injectable()
export class ProlificService {
    constructor(
        @InjectRepository(Prolific, 'survey') private prolificRepository: Repository<Prolific>,
    ) { }

    async createOrUpdate(prolificId: string, prolificData: Partial<Prolific>): Promise<Prolific> {
        let entity = await this.findProlificById(prolificId);

        if (!entity) {
            entity = this.createProlific(prolificData);
            return this.prolificRepository.save(entity);
        }
        else {
            entity = this.prolificRepository.merge(entity, prolificData);
            this.prolificRepository.update(entity._id, entity);
            return entity;
        }
    }

    async findProlificById(id: string): Promise<Prolific> {
        return this.prolificRepository.findOneBy({ prolificId: id });
    }

    createProlific(prolific: Partial<Prolific>): Prolific {
        return this.prolificRepository.create(prolific);
    }
}
