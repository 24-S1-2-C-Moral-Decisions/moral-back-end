import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Prolific } from '../../entity/Prolific';
import { Repository } from 'typeorm';
import { SurveyConnectionName } from '../../utils/ConstantValue';

@Injectable()
export class ProlificService {
    constructor(
        @InjectRepository(Prolific, SurveyConnectionName) private prolificRepository: Repository<Prolific>,
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
